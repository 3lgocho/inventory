use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "varchar")]
pub enum ItemUbicacion {
    IT,
    Deposito,
    #[serde(rename = "En uso")]
    #[sqlx(rename = "En uso")]
    EnUso,
    Ronny
}

#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "varchar")]
pub enum TipoMovimiento {
    Entrada,
    Salida,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Item {
    pub id: i32,
    pub nombre: String,
    pub categoria_global: String,
    pub atributos: Option<serde_json::Value>,
    pub ubicacion: ItemUbicacion, 
    pub cantidad: u32,
    pub stock_minimo: u32,
    pub actualizado_en: DateTime<Utc>
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Movimiento {
    pub id: i32,
    pub item_id: i32,
    pub cantidad: u32,
    pub tipo: TipoMovimiento,
    pub encargado: String,
    pub motivo: String,
    pub fecha: DateTime<Utc>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
    pub id: i32,
    pub nombre: String,
    #[serde(skip_serializing)]
    password: String,
    pub rol: String,
}