use axum::{extract::{Path, State}, Json, http::StatusCode};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::ItemCategoria;
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct UpdateItemRequest {
    nombre: Option<String>,
    categoria_global: Option<ItemCategoria>,
    atributos: Option<serde_json::Value>,
    stock_minimo: Option<i32>,
}

pub async fn update_item(
    _auth: AuthUser,
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(payload): Json<UpdateItemRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    sqlx::query!(
        r#"
            UPDATE items
            SET
                nombre = COALESCE($1, nombre),
                categoria_global = COALESCE($2, categoria_global),
                atributos = COALESCE($3, atributos),
                stock_minimo = COALESCE($4, stock_minimo),
                updated_at = NOW()
            WHERE id = $5
        "#,
        payload.nombre,
        payload.categoria_global as Option<ItemCategoria>,
        payload.atributos,
        payload.stock_minimo,
        id
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok(StatusCode::OK)
}