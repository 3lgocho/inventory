use axum::{Router, routing::{get, post}};
use sqlx::PgPool;

pub mod register_handler; 
pub mod auth_handler;
pub mod middleware;
pub mod get_all_handler;

pub use register_handler::register_user;
pub use auth_handler::login_user;
pub use get_all_handler::get_all_users;

pub fn auth_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register_user))
        .route("/login", post(login_user))
        .route("/get-all", get(get_all_users))  
}