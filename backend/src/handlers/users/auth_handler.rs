use serde::{Serialize, Deserialize};
use axum::{ extract::State, Json, http::StatusCode };
use sqlx::PgPool;
use bcrypt::verify;
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub token: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    exp: usize,
}

pub async fn login_user(
    State(pool): State<PgPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<LoginResponse>, (StatusCode, String)> {
    let user_record = sqlx::query!(
        "SELECT password FROM users WHERE email = $1",
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
        .checked_add_signed(Duration::hours(24))
        .expect("Timestamp invalido")
        .timestamp() as usize;

    let claims = Claims {
        sub: payload.email,
        exp: expiration,
    };

    let secret = "mi_secreto_super_seguro_123";
    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .map_err(|_| (StatusCode::INTERNAL_SERVER_ERROR, "No se pudo crear el token".to_string()))?;

    Ok(Json(LoginResponse {token}))
}