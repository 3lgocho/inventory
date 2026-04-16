use sqlx::PgPool;
use axum::{extract::{State, Path, Query}, Json, http::StatusCode};

use crate::handlers::users::middleware::AuthUser;
use crate::models::{MovementDetailed, ItemLocation, Pagination, PagedResponse};

pub async fn get_item_history(
    _auth: AuthUser,
    Path(item_id): Path<i32>, // Filtramos por este ID
    State(pool): State<PgPool>,
    Query(pag): Query<Pagination>,
) -> Result<Json<PagedResponse<MovementDetailed>>, (StatusCode, String)> {

    let per_page = pag.per_page.unwrap_or(10);
    let page = pag.page.unwrap_or(1);
    let offset = (page - 1) * per_page;

    let total_records = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM movements WHERE item_id = $1",
        item_id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error count: {}", e)))?
    .unwrap_or(0);
    
    let historial = sqlx::query_as!(
        MovementDetailed,
        r#"
            SELECT 
                m.id,
                i.name as item_name,
                u.name as user_name,
                m.amount,
                m.origin as "origin: ItemLocation",
                m.destination as "destination: ItemLocation",
                m.reason,
                m.created_at
            FROM movements m
            JOIN items i ON m.item_id = i.id
            JOIN users u ON m.user_id = u.id
            WHERE m.item_id = $1
            ORDER BY m.created_at DESC
            LIMIT $2 OFFSET $3
        "#,
        item_id,
        per_page,
        offset
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error query: {}", e)))?;

    let total_pages = (total_records as f64 / per_page as f64).ceil() as i64;

    Ok(Json(PagedResponse {
        total_records,
        current_page: page,
        total_pages,
        data: historial,
    }))
}