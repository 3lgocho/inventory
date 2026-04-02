/* use axum::{routing::{get, post}, Router};
use sqlx::MySqlPool;
use crate::handlers::{obtener_inventario, mover_inventario};

pub fn crear_rutas(pool: MySqlPool) -> Router {
    Router::new()
        .route("/api/inventario", get(obtener_inventario))
        .route("/api/inventario/mover", post(mover_inventario))
        .with_state(pool)
} */