use axum::{routing::{post, get}, Router};
use sqlx::PgPool;

pub mod register_handler;
pub mod get_all_handler;

pub use register_handler::create_item;
pub use get_all_handler::get_all_items;

pub fn item_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(create_item))
        .route("/get-all", get(get_all_items))
}