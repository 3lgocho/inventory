use serde::{Serialize, Deserialize};
use axum::{ extract::State, Json, http::StatusCode };
use sqlx::PgPool;
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};
use std::env;

use crate::models::{Claims, UserRole};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

pub async fn login_user(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {

    let user_record = sqlx::query!(
        r#"SELECT id as "id!", password, role as "role!: UserRole" FROM users WHERE email = $1"#,
        payload.email
    )
    .fetch_one(&pool)
    .await
    .map_err(|_| (StatusCode::UNAUTHORIZED, "Credenciales incorrectas".to_string()))?;

    let is_valid = verify(&payload.password, &user_record.password)
        .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error interno de validación".to_string()))?;

    if !is_valid {
        return Err((StatusCode::UNAUTHORIZED, "Credenciales incorrectas".to_string()));
    }

    let expiration = Utc::now()
        .checked_add_signed(Duration::hours(6))
        .expect("Timestamp invalido")
        .timestamp() as usize;

    let my_claims = Claims {
        sub: user_record.id.to_string(),
        exp: expiration,
        role: user_record.role,
    };

    let secret = env::var("JWT_SECRET_KEY").map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, "Variable de entorno no configurada".to_string())
    })?;

    // 5. Codificar el token
    let token = encode(
        &Header::default(),
        &my_claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "Error al generar token".to_string()))?;

    Ok(Json(LoginResponse{token}))
}