use serde::Deserialize;
use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};

use crate::models::TipoMovimiento;
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct RegisterMovementRequest {
    pub item_id: i32,
    pub cantidad: i32,
    pub tipo: TipoMovimiento,
    pub motivo: String,
}

pub async fn register_movement(
    auth: AuthUser,
    State(pool): State<PgPool>,
    Json(payload): Json<RegisterMovementRequest>
) -> Result<StatusCode, (StatusCode, String)> {
    let mut tx = pool.begin().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let user = sqlx::query!("SELECT id FROM users WHERE email = $1", auth.0.sub)
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::UNAUTHORIZED, format!("Usuario no encontrado: {}", e)))?;

    sqlx::query!(
        r#"
            INSERT INTO movimientos (item_id, user_id, cantidad, tipo, motivo) VALUES ($1, $2, $3, $4, $5)
        "#,
        payload.item_id,
        user.id,
        payload.cantidad,
        payload.tipo as TipoMovimiento,
        payload.motivo
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al registrar movimiento: {}", e)))?;

    let operador = match payload.tipo {
        TipoMovimiento::Entrada => 1,
        TipoMovimiento::Salida => -1,
    };

    let cantidad_final = payload.cantidad * operador;

    let res = sqlx::query!(
        r#"
            UPDATE items SET cantidad = cantidad + $1 WHERE id = $2 AND (cantidad + $1) >= 0
        "#,
        cantidad_final,
        payload.item_id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al actualizar stock: {}", e)))?;

    if res.rows_affected() == 0 {
        return Err((StatusCode::BAD_REQUEST, "Stock insuficiente o item no encontrado".to_string()));
    }

    tx.commit().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::CREATED)
}