use axum::{routing::post, Router};
use sqlx::PgPool;

pub mod register_handler; 
pub mod auth_handler;
pub mod middleware;

pub use register_handler::register_user;
pub use auth_handler::login_user;

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
}