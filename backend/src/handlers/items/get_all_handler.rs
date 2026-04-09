use sqlx::PgPool;
use axum::{extract::State, Json, http::StatusCode};

use crate::models::{Item, ItemUbicacion};
use crate::handlers::users::middleware::AuthUser;

pub async fn get_all_items(
    _auth: AuthUser,
    State(pool): State<PgPool>,
) -> Result<Json<Vec<Item>>, (StatusCode, String)> {
    let rows = sqlx::query!(
        r#"
            SELECT
                id, 
                nombre, 
                categoria_global, 
                atributos, 
                ubicacion as "ubicacion: ItemUbicacion", 
                cantidad, 
                stock_minimo, 
                created_at, 
                updated_at
            FROM items
        "#
    )
    .fetch_all(&pool)
    .await
    .map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, format!("Error al obtener items: {}", e))
    })?;

    let items: Vec<Item> = rows.into_iter().map(|row| {
        Item {
            id: row.id,
            nombre: row.nombre,
            categoria_global: row.categoria_global,
            atributos: row.atributos,
            ubicacion: row.ubicacion, // Esto ya viene como ItemUbicacion por el alias en el query!
            cantidad: row.cantidad as u32,      // <--- EL TRUCO: Casteo seguro aquí
            stock_minimo: row.stock_minimo as u32, // <--- EL TRUCO: Casteo seguro aquí
            created_at: row.created_at.unwrap(),
            updated_at: row.updated_at.unwrap(),
        }
    }).collect();

    Ok(Json(items))
}