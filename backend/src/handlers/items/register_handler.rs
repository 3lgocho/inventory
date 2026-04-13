use serde::Deserialize;
use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};

use crate::models::{ItemCategory, ItemLocation};
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct CreateItemRequest {
    pub name: String,
    pub global_category: ItemCategory,
    pub attributes: Option<serde_json::Value>,
    pub location: ItemLocation, 
    pub amount: i32,
    pub minimum_stock: i32,
}

pub async fn create_item(
    auth: AuthUser,
    State(pool): State<PgPool>,
    Json(payload): Json<CreateItemRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    
    let mut tx = pool.begin().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let item_id = sqlx::query_scalar!(
        r#"
        INSERT INTO items (name, global_category, attributes, minimum_stock)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        "#,
        payload.name,
        payload.global_category as ItemCategory,
        payload.attributes,
        payload.minimum_stock
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|e| (StatusCode::BAD_REQUEST, format!("Error al crear catálogo: {}", e)))?;

    sqlx::query!(
        r#"
        INSERT INTO item_stock (item_id, location, amount)
        VALUES ($1, $2, $3)
        "#,
        item_id,
        payload.location as ItemLocation,
        payload.amount
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al asignar stock: {}", e)))?;

    let user_id = auth.0.sub.parse::<i32>().unwrap_or(0);
    
    sqlx::query!(
        r#"
        INSERT INTO movements (item_id, user_id, amount, origin, destination, reason)
        VALUES ($1, $2, $3, 'proveedor', $4, $5)
        "#,
        item_id,
        user_id,
        payload.amount,
        payload.location as ItemLocation,
        "Carga inicial de inventario"
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error en historial: {}", e)))?;

    // 5. Confirmar todos los cambios
    tx.commit().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::CREATED)
}