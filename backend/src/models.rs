use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct InventarioItem {
    pub id: i32,
    pub categoria_global: String,
    pub atributos: Option<serde_json::Value>,
    pub ubicacion: String, 
    pub cantidad: i32,
    pub stock_minimo: i32,
}