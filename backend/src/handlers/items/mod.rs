use axum::{Router, routing::{get, patch, post}};
use sqlx::PgPool;

pub mod register_handler;
pub mod get_all_handler;
pub mod get_item_by_id_handler;
pub mod update_handler;

pub use register_handler::create_item;
pub use get_all_handler::get_all_items;
pub use get_item_by_id_handler::get_item_by_id;
pub use update_handler::update_item;

pub fn item_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(create_item))
        .route("/get-all", get(get_all_items))
        .route("/item/:id", get(get_item_by_id))
        .route("/update/:id", patch(update_item))
}