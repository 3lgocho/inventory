use sqlx::PgPool;
use axum::{extract::{State, Path}, Json, http::StatusCode};

use crate::handlers::users::middleware::AuthUser;
use crate::models::{Item, ItemCategoria, ItemUbicacion};

pub async fn get_item_by_id(
    _auth: AuthUser,
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<Item>, (StatusCode, String)> {
    let item = sqlx::query_as!(
        Item,
        r#"
            SELECT
                id,
                nombre,
                categoria_global as "categoria_global: ItemCategoria",
                atributos,
                ubicacion as "ubicacion: ItemUbicacion",
                cantidad,
                stock_minimo,
                created_at,
                updated_at
            FROM items
            WHERE id = $1
        "#,
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    match item {
        Some(i) => Ok(Json(i)),
        None => Err((StatusCode::NOT_FOUND, "El producto no existe".into())),
    }
}