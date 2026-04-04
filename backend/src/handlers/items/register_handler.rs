use serde::Deserialize;
use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};

use crate::models::{Item, ItemUbicacion};
use crate::handlers::users::middleware::AuthUser;

#[derive(Deserialize)]
pub struct CreateItemRequest {
    pub nombre: String,
    pub categoria_global: String,
    pub atributos: Option<serde_json::Value>,
    pub ubicacion: ItemUbicacion, 
    pub cantidad: i32,
    pub stock_minimo: i32,
}

pub async fn create_item(
    auth: AuthUser,
    State(pool): State<PgPool>,
    Json(payload): Json<CreateItemRequest>,
) -> Result<Json<Item>, (StatusCode, String)> {
    println!("El usuario {} está creando un nuevo item", auth.0.sub);

    let row = sqlx::query!(
        r#"
            INSERT INTO items (nombre, categoria_global, atributos, ubicacion, cantidad, stock_minimo)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, nombre, categoria_global, atributos, 
                      ubicacion as "ubicacion: ItemUbicacion", 
                      cantidad, stock_minimo, created_at, updated_at
        "#,
        payload.nombre,
        payload.categoria_global,
        payload.atributos,
        payload.ubicacion as ItemUbicacion,
        payload.cantidad, // Enviamos como i32
        payload.stock_minimo // Enviamos como i32
    )
    .fetch_one(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, format!("Error DB: {}", e)))?;

    // 2. Mapeamos manualmente a nuestro Struct Item (haciendo el cast a u32)
    let item = Item {
        id: row.id,
        nombre: row.nombre,
        categoria_global: row.categoria_global,
        atributos: row.atributos,
        ubicacion: row.ubicacion,
        cantidad: row.cantidad as u32,       // <--- Aquí el cast seguro
        stock_minimo: row.stock_minimo as u32, // <--- Aquí el cast seguro
        created_at: row.created_at,
        updated_at: row.updated_at,
    };

    Ok(Json(item))
}