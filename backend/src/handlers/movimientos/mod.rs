use axum::{routing::post, Router};
use sqlx::PgPool;

pub mod register_handler;

pub use register_handler::register_movement;

pub fn movement_routes() -> Router<PgPool> {
    Router::new()
        .route("/register", post(register_movement))
}

