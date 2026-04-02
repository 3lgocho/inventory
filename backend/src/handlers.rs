use axum::{extract::State, Json};
use serde::{Deserialize, Serialize};
use sqlx::MySqlPool;
use std::collections::HashMap;
use crate::models::InventarioItem;

// Struct para recibir los datos del frontend al mover un equipo
#[derive(Deserialize)]
pub struct MoverPayload {
    pub id: i32,
    pub nueva_ubicacion: String,
}

// GET: Extrae todo y lo agrupa por "Categoria_Global" en el back
pub async fn obtener_inventario(
    State(pool): State<MySqlPool>,
) -> Result<Json<HashMap<String, Vec<InventarioItem>>>, (axum::http::StatusCode, String)> {
    
    // 1. Buscamos todos los registros
    let registros = sqlx::query_as::<_, InventarioItem>("SELECT * FROM Inventario")
        .fetch_all(&pool)
        .await
        .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    // 2. Agrupamos usando un HashMap (La llave es la categoría, el valor es la lista de items)
    let mut inventario_agrupado: HashMap<String, Vec<InventarioItem>> = HashMap::new();
    
    for item in registros {
        inventario_agrupado
            .entry(item.categoria_global.clone())
            .or_insert(Vec::new())
            .push(item);
    }

    Ok(Json(inventario_agrupado))
}

// POST: Actualiza únicamente el estado (Ubicacion) guiándose por el ID
pub async fn mover_inventario(
    State(pool): State<MySqlPool>,
    Json(payload): Json<MoverPayload>,
) -> Result<Json<serde_json::Value>, (axum::http::StatusCode, String)> {
    
    let resultado = sqlx::query!(
        "UPDATE Inventario SET Ubicacion = ? WHERE ID = ?",
        payload.nueva_ubicacion,
        payload.id
    )
    .execute(&pool)
    .await
    .map_err(|e| (axum::http::StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    if resultado.rows_affected() == 0 {
        return Err((axum::http::StatusCode::NOT_FOUND, "ID no encontrado en la base de datos".to_string()));
    }

    Ok(Json(serde_json::json!({"mensaje": "Estado/Ubicación actualizada correctamente"})))
}