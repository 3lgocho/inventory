use axum::{extract::{Path, State}, Json, http::StatusCode};
use serde::Deserialize;
use sqlx::PgPool;

use crate::models::ItemCategory;
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct UpdateItemRequest {
    pub name: Option<String>,
    pub global_category: Option<ItemCategory>,
    pub attributes: Option<serde_json::Value>,
    pub minimum_stock: Option<i32>,
}

pub async fn update_item(
    _auth: AuthUser,
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
    Json(payload): Json<UpdateItemRequest>,
) -> Result<StatusCode, (StatusCode, String)> {

    let result = sqlx::query!(
        r#"
            UPDATE items
            SET
                name = COALESCE($1, name),
                global_category = COALESCE($2, global_category),
                attributes = COALESCE($3, attributes),
                minimum_stock = COALESCE($4, minimum_stock),
                updated_at = NOW()
            WHERE id = $5
        "#,
        payload.name,
        payload.global_category as Option<ItemCategory>,
        payload.attributes,
        payload.minimum_stock,
        id
    )
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al actualizar: {}", e)))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, "El item no existe".to_string()));
    }

    Ok(StatusCode::OK)
}