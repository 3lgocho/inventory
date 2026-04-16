use sqlx::PgPool;
use axum::{extract::{State, Query}, Json, http::StatusCode};

use crate::handlers::users::middleware::AuthUser;
use crate::models::{UserResponse, UserRole, Pagination, PagedResponse};

pub async fn get_all_users(
    _auth: AuthUser,
    State(pool): State<PgPool>,
    Query(pag): Query<Pagination>,
) -> Result<Json<PagedResponse<UserResponse>>, (StatusCode, String)> {

    let per_page = pag.per_page.unwrap_or(10);
    let page = pag.page.unwrap_or(1);
    let offset = (page - 1) * per_page;

    let total_records = sqlx::query_scalar!("SELECT COUNT(*) FROM users")
        .fetch_one(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error de conteo: {}", e)))?
        .unwrap_or(0);

    let users = sqlx::query_as!(
        UserResponse,
        r#"
            SELECT
                id,
                name,
                email,
                role as "role: UserRole",
                created_at,
                updated_at
            FROM users
            ORDER BY created_at DESC
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
        data: users,
    }))
}