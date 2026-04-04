pub mod models;
pub mod handlers;

use crate::handlers::users::{register_user, login_user};
use crate::handlers::items::register_handler::create_item;

use axum::{routing::{get, post}, Router};
use sqlx::postgres::PgPoolOptions;
use dotenvy::dotenv;
use std::env;
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL no definida en .env");
    let server_address = env::var("SERVER_ADDRESS").unwrap_or_else(|_| "0.0.0.0:3000".to_string());

    println!("🚀 Iniciando servidor en {}", server_address);

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("❌ No se pudo conectar a la base de datos");

    println!("✅ Conexión a la base de datos exitosa");

    let app = Router::new()
        .route("/auth/register", post(register_user))
        .route("/auth/login", post(login_user))
        .route("/items/register", post(create_item))
        //.route("/", get(|| async { "Inventario IT API Corriendo" }))
        .with_state(pool);

    let addr: SocketAddr = server_address.parse().expect("Dirección de servidor inválida");
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();

    println!("🚀 Servidor escuchando en http://{}", addr);

    // Arrancamos directamente aquí
    ax_server(listener, app).await.unwrap();
}

async fn ax_server(listener: tokio::net::TcpListener, app: Router) -> Result<(), std::io::Error> {
    axum::serve(listener, app).await
}