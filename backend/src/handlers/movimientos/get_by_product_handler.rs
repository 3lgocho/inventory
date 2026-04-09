use sqlx::PgPool;
use axum::{extract::{State, Path, Query}, Json, http::StatusCode};

use crate::handlers::users::middleware::AuthUser;
use crate::models::{TipoMovimiento, MovimientoDetallado, Pagination, PagedResponse};

pub async fn get_item_history(
    _auth: AuthUser,
    Path(item_id): Path<i32>,
    State(pool): State<PgPool>,
    Query(pag): Query<Pagination>,
) -> Result<Json<PagedResponse<MovimientoDetallado>>, (StatusCode, String)> {
    let per_page = pag.per_page.unwrap_or(10);
    let page = pag.page.unwrap_or(1);
    let offset = (page - 1) * per_page;

    let total_records = sqlx::query_scalar!(
        "SELECT COUNT(*) FROM movimientos WHERE item_id = $1",
        item_id
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?
    .unwrap_or(0);
    
    let historial = sqlx::query_as!(
        MovimientoDetallado,
        r#"
        SELECT 
            m.id,
            i.nombre as item_name,
            u.nombre as user_name,
            m.cantidad,
            m.tipo as "tipo: TipoMovimiento",
            m.motivo,
            m.created_at
        FROM movimientos m
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
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    let total_pages = (total_records as f64 / per_page as f64).ceil() as i64;

    Ok(Json(PagedResponse {
        total_records,
        current_page: page,
        total_pages,
        data: historial,
    }))
}