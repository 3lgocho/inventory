use serde::Deserialize;
use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};
use crate::models::{Item, ItemUbicacion};

#[derive(Deserialize)]
pub struct CreateItemRequest {
    pub nombre: String,
    pub categoria_global: String,
    pub atributos: Option<serde_json::Value>,
    pub ubicacion: ItemUbicacion, 
    pub cantidad: i32,
    pub stock_minimo: i32,
}

pub async fn create_item(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateItemRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    sqlx::query!(
        r#"
            INSERT INTO items (nombre, categoria_global, atributos, ubicacion, cantidad, stock_minimo)
            VALUES ($1, $2, $3, $4, $5, $6)
        "#,
        payload.nombre,
        payload.categoria_global,
        payload.atributos,
        payload.ubicacion as ItemUbicacion,
        payload.cantidad,
        payload.stock_minimo
    )
    .execute(&pool)
    .await
    .map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al guardar el item: {}", e))
    })?;

    Ok(StatusCode::CREATED)
}