use sqlx::PgPool;
use axum::{extract::{State, Query}, Json, http::StatusCode};

use crate::models::{ItemCategory, Pagination, PagedResponse, ItemResponseDto};
use crate::handlers::users::middleware::AuthUser;

pub async fn get_all_items(
    _auth: AuthUser,
    State(pool): State<PgPool>,
    Query(pag): Query<Pagination>,
) -> Result<Json<PagedResponse<ItemResponseDto>>, (StatusCode, String)> {

    let per_page = pag.per_page.unwrap_or(10);
    let page = pag.page.unwrap_or(1);
    let offset = (page - 1) * per_page;

    let total_records = sqlx::query_scalar!("SELECT COUNT(*) FROM items")
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
        .unwrap_or(0);

    let items = sqlx::query_as!(
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
            GROUP BY i.id
            ORDER BY i.name ASC
            LIMIT $1 OFFSET $2
        "#,
        per_page,
        offset
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al obtener items: {}", e))
    })?;

    let total_pages = (total_records as f64 / per_page as f64).ceil() as i64;

    Ok(Json(PagedResponse {
        total_records,
        current_page: page,
        total_pages,
        data: items,
    }))
}