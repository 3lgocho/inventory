use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sqlx::{FromRow, Type};

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "varchar")]
pub enum ItemCategoria {
    Red,
    Hardware,
    Complemento,
}

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "varchar")]
pub enum ItemUbicacion {
    IT,
    Deposito,
    #[serde(rename = "En uso")]
    #[sqlx(rename = "En uso")]
    EnUso,
    Ronny
}

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "varchar")]
pub enum TipoMovimiento {
    Entrada,
    Salida,
}

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "varchar")]
pub enum UserRole {
    Admin
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Item {
    pub id: i32,
    pub nombre: String,
    pub categoria_global: ItemCategoria,
    pub atributos: Option<serde_json::Value>,
    pub ubicacion: ItemUbicacion, 
    pub cantidad: i32,
    pub stock_minimo: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Movimiento {
    pub id: i32,
    pub item_id: i32,
    pub user_id: i32,
    pub cantidad: i32,
    pub tipo: TipoMovimiento,
    pub motivo: String,
    pub created_at: DateTime<Utc>
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub nombre: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub rol: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

#[derive(Serialize)]
pub struct MovimientoDetallado {
    pub id: i32,
    pub item_name: String,
    pub user_name: String,
    pub cantidad: i32,
    pub tipo: TipoMovimiento,
    pub motivo: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Deserialize)]
pub struct Pagination {
    pub page: Option<i64>,
    pub per_page: Option<i64>,
}

#[derive(serde::Serialize)]
pub struct PagedResponse<T> {
    pub total_records: i64,
    pub current_page: i64,
    pub total_pages: i64,
    pub data: Vec<T>,
}

#[derive(serde::Serialize)]
pub struct UserResponse {
    pub id: i32,
    pub nombre: String,
    pub email: String,
    pub rol: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}