use serde::Deserialize;
use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};

use crate::{handlers::users::middleware::AuthUser, models::ItemLocation};

#[derive(Deserialize)]
pub struct MoveStockRequest {
    pub item_id: i32,
    pub from_location: ItemLocation,
    pub to_location: ItemLocation,
    pub amount: i32,
    pub reason: String,
}

pub async fn move_stock(
    auth: AuthUser,
    State(pool): State<PgPool>,
    Json(payload): Json<MoveStockRequest>,
) -> Result<StatusCode, (StatusCode, String)> {

    let mut tx = pool.begin().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let res_origin = sqlx::query!(
        r#"
            UPDATE item_stock
            SET amount = amount - $1
            WHERE item_id = $2 AND location = $3 AND amount >=$1
        "#,
        payload.amount,
        payload.item_id,
        payload.from_location as ItemLocation
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error en origen: {}", e)))?;

    if res_origin.rows_affected() == 0 {
        return Err((StatusCode::BAD_REQUEST, "Stock insuficiente en la ubicación de origen".into()));
    }

    sqlx::query!(
        r#"
            INSERT INTO item_stock (item_id, location, amount)
            VALUES ($1, $2, $3)
            ON CONFLICT (item_id, location)
            DO UPDATE SET 
                amount = item_stock.amount + EXCLUDED.amount,
                updated_at = NOW()
        "#,
        payload.item_id,
        payload.to_location as ItemLocation,
        payload.amount
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error en destino: {}", e)))?;

    let user_id = auth.0.sub.parse::<i32>().unwrap_or(0);
    
    sqlx::query!(
        r#"
            INSERT INTO movements (item_id, user_id, amount, origin, destination, reason)
            VALUES ($1, $2, $3, $4, $5, $6)
        "#,
        payload.item_id,
        user_id,
        payload.amount,
        payload.from_location as ItemLocation,
        payload.to_location as ItemLocation,
        payload.reason
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al crear log: {}", e)))?;

    tx.commit().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::OK)
}