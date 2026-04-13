/*
use axum::{extract::State, Json, http::StatusCode};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::{ItemUbicacion, ItemCategoria};
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct TransferRequest {
    pub from_item_id: i32,
    pub to_ubicacion: ItemUbicacion,
    pub cantidad: i32,
    pub motivo: String,
}

pub async fn transfer_item(
    auth: AuthUser,
    State(pool): State<PgPool>,
    Json(payload): Json<TransferRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    let mut tx = pool.begin().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let item_origen = sqlx::query!(
        r#"SELECT nombre, categoria_global as "categoria_global: ItemCategoria", atributos FROM items WHERE id = $1"#,
        payload.from_item_id
    )
    .fetch_one(&mut *tx)
    .await
    .map_err(|_| (StatusCode::NOT_FOUND, "Item no encontrado".into()))?;

    let result = sqlx::query!(
        "UPDATE items SET cantidad = cantidad - $1 WHERE id = $2 AND cantidad >= $1",
        payload.cantidad,
        payload.from_item_id
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::BAD_REQUEST, "Stock insuficiente en el origen".into()));
    }

    sqlx::query!(
        r#"
            INSERT INTO items (nombre, categoria_global, atributos, ubicacion, cantidad, stock_minimo)
            VALUES ($1, $2, $3, $4, $5, 0)
            ON CONFLICT (nombre, ubicacion)
            DO UPDATE SET
                cantidad = items.cantidad + EXCLUDED.cantidad,
                atributos = EXCLUDED.atributos,
                updated_at = NOW()
        "#,
        item_origen.nombre,
        item_origen.categoria_global as ItemCategoria,
        item_origen.atributos,
        payload.to_ubicacion as ItemUbicacion,
        payload.cantidad
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al actualizar destino: {}", e)))?;

    println!("Contenido de auth.0.sub: '{}'", auth.0.sub);

    let user_id = auth.0.sub.parse::<i32>()
        .map_err(|_| (StatusCode::UNAUTHORIZED, "ID de usuario inválido en el token".to_string()))?;

    sqlx::query!(
        r#"
            INSERT INTO movimientos (item_id, user_id, cantidad, tipo, motivo)
            VALUES ($1, $2, $3, 'Salida', $4)
        "#,
        payload.from_item_id,
        user_id,
        payload.cantidad,
        format!("Transferencia a {:?}: {}", payload.to_ubicacion, payload.motivo)
    )
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // 5. FINALIZAR
    tx.commit().await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::OK)
}
*/