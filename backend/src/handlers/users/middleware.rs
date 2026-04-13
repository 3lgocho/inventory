use axum::{extract::FromRequestParts, http::{request::Parts, StatusCode, header::AUTHORIZATION}, async_trait};
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
            .get(AUTHORIZATION)
            .and_then(|value| value.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, "Formato de token inválido".to_string()))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, "Formato de token inválido".to_string()));
        }

        let token = &auth_header[7..];

        let secret = env::var("JWT_SECRET_KEY").map_err(|_| {
            eprintln!("CRITICAL: JWT_SECRET_KEY no configurada");
            (StatusCode::INTERNAL_SERVER_ERROR, "Error interno de configuración".to_string())
        })?;

        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_ref()),
            &Validation::default(),
        )
        .map_err(|e| {
            eprintln!("Error decodificando JWT: {:?}", e);
            (StatusCode::UNAUTHORIZED, "Sesión inválida o expirada".to_string())
        })?;

        Ok(AuthUser(token_data.claims))
    }
}