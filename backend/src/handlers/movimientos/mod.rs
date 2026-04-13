use axum::{Router, routing::{get, post}};
use sqlx::PgPool;

pub mod register_handler;
pub mod get_all_handler;
pub mod get_by_product_handler;

pub use register_handler::move_stock;
pub use get_all_handler::get_history;
pub use get_by_product_handler::get_item_history;

pub fn movement_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(move_stock))
        .route("/get-all", get(get_history))
        .route("/item/:id", get(get_item_history))
}

