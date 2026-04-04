use serde::Deserialize;
use axum::{ extract::State, Json, http::StatusCode };
use sqlx::PgPool;
use bcrypt::{ hash, DEFAULT_COST };

#[derive(Deserialize)]
pub struct RegisterRequest {
    pub nombre: String,
    pub email: String,
    pub password: String,
}

pub async fn register_user(
    State(pool): State<PgPool>,
    Json(payload): Json<RegisterRequest>,
) -> Result<StatusCode, (StatusCode, String)> {
    let hashed_password = hash(payload.password, DEFAULT_COST)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error interno al procesar la clave".to_string()))?;

    sqlx::query!(
        "INSERT INTO users (nombre, email, password, rol) VALUES ($1, $2, $3, $4)",
        payload.nombre,
        payload.email,
        hashed_password,
        "Admin"
    )
    .execute(&pool)
    .await
    .map_err(|e| {
        (StatusCode::BAD_REQUEST, format!("No se pudo crear el usuario: {}", e))
    })?;

    Ok(StatusCode::CREATED)
}