use sqlx::PgPool;
use axum::{extract::{State, Path}, Json, http::StatusCode};

use crate::handlers::users::middleware::AuthUser;
use crate::models::{ItemResponseDto, ItemCategory};

pub async fn get_item_by_id(
    _auth: AuthUser,
    Path(id): Path<i32>,
    State(pool): State<PgPool>,
) -> Result<Json<ItemResponseDto>, (StatusCode, String)> {

    let item = sqlx::query_as!(
        ItemResponseDto,
        r#"
            SELECT
                i.id,
                i.name,
                i.global_category as "global_category: ItemCategory",
                i.attributes,
                i.minimum_stock,
                COALESCE(SUM(s.amount), 0)::INTEGER as "total_amount!",
                i.created_at,
                i.updated_at
            FROM items i
            LEFT JOIN item_stock s ON i.id = s.item_id
            WHERE i.id = $1
            GROUP BY i.id
        "#,
        id
    )
    .fetch_optional(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error de base de datos: {}", e)))?;

    match item {
        Some(i) => Ok(Json(i)),
        None => Err((StatusCode::NOT_FOUND, "El producto no existe".into())),
    }
}