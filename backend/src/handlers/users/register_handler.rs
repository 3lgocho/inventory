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
    validate_password(&payload.password)
        .map_err(|e| (StatusCode::BAD_REQUEST, e))?;

    let hashed_password = hash(&payload.password, DEFAULT_COST)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error al procesar contraseña".to_string()))?;

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


fn validate_password(password: &str) -> Result<(), String> {
    if password.len() < 8 {
        return Err("La contraseña debe tener al menos 8 caracteres".to_string());
    }

    let tiene_mayuscula = password.chars().any(|c| c.is_uppercase());
    let tiene_minuscula = password.chars().any(|c| c.is_lowercase());
    let tiene_numero = password.chars().any(|c| c.is_numeric());
    let tiene_especial = password.chars().any(|c| !c.is_alphanumeric());

    if !tiene_mayuscula {
        return Err("Debe contener al menos una mayúscula".to_string());
    }
    if !tiene_minuscula {
        return Err("Debe contener al menos una minúscula".to_string());
    }
    if !tiene_numero {
        return Err("Debe contener al menos un número".to_string());
    }
    if !tiene_especial {
        return Err("Debe contener al menos un carácter especial (@, #, $, etc.)".to_string());
    }

    Ok(())
}