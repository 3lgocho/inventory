mod models;
mod handlers;
mod routes; // <-- Declaramos los nuevos módulos

use dotenvy::dotenv;
use sqlx::mysql::MySqlPoolOptions;
use std::env;

#[tokio::main]
async fn main() {
/*     dotenv().ok();

    let database_url = env::var("DATABASE_URL")
        .expect("Falta definir DATABASE_URL en el archivo .env");

    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Error crítico: No se pudo conectar a la base de datos");

    // Conectamos las rutas modulares
    let app = routes::crear_rutas(pool);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    println!("Servidor Rust corriendo en http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap(); */
}