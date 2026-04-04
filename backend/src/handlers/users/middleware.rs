use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode}, async_trait};
use jsonwebtoken::{decode, DecodingKey, Validation};
use std::env;

use crate::models::Claims;

pub struct AuthUser(pub Claims);

#[async_trait]
impl<S> FromRequestParts<S> for AuthUser
where
    S: Send + Sync
{
    type Rejection = (StatusCode, String);

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let auth_header = parts.headers
            .get("Authorization")
            .and_then(|value| value.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "Formato de token inválido".to_string()))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Formato de token inválido".to_string()));
        }

        let token = &auth_header[7..];

        let secret = env::var("JWT_SECRET_KEY").unwrap_or_else(|_| 
            "MTI0OGVjYzc1ZjZlNGY4MzljYmY5ZmRjMzY2NDVkNjFlZDU3YTMwYmU0MGYzYWE2Cg==".to_string());

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::default(),
        )
        .map_err(|e| {
            eprintln!("Error decodificando JWT: {}", e);
            (StatusCode::UNAUTHORIZED, "Token inválido o expirado".to_string())
        })?;

        Ok(AuthUser(token_data.claims))
    }
}