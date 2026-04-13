use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use sqlx::{FromRow, Type};
use serde_json::Value;

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "item_category", rename_all = "snake_case")]
pub enum ItemCategory {
    Redes,
    Hardware,
    Complemento,
}

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "item_location", rename_all = "snake_case")]
pub enum ItemLocation {
    IT,
    CS,
    LM,
    Billing,
    Clerks,
    Arche,
    Deposito,
    Ronny,
    #[serde(rename = "En uso")]
    EnUso,
    Others,
    Proveedor
}

#[derive(Debug, Serialize, Deserialize, Type, Clone, Copy)]
#[sqlx(type_name = "user_role", rename_all = "snake_case")]
pub enum UserRole {
    Admin
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Item {
    pub id: i32,
    pub name: String,
    pub global_category: ItemCategory,
    pub attributes: Value,
    pub minimum_stock: i32,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize)]
pub struct ItemResponseDto {
    pub id: i32,
    pub name: String,
    pub global_category: ItemCategory,
    pub attributes: serde_json::Value,
    pub minimum_stock: i32,
    pub total_amount: i32, // Aquí sí vive el cálculo
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct ItemStock {
    pub id: i32,
    pub item_id: i32,
    pub location: ItemLocation,
    pub amount: i32,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Movement {
    pub id: i32,
    pub item_id: i32,
    pub user_id: i32,
    pub amount: i32,
    pub origin: ItemLocation,
    pub destination: ItemLocation,
    pub reason: String,
    pub created_at: DateTime<Utc>
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct MovementDetailed {
    pub id: i32,
    pub item_name: String,    // Viene del JOIN con items
    pub user_name: String,    // Viene del JOIN con users
    pub amount: i32,
    pub origin: ItemLocation,
    pub destination: ItemLocation,
    pub reason: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub role: UserRole,
}

/* 
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
*/

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
    pub name: String,
    pub email: String,
    pub role: UserRole,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}