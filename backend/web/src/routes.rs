use crate::{controllers, state::AppState};
use axum::{
    routing::{delete, get, post},
    Router,
};
use tower_http::cors::CorsLayer;

use std::sync::Arc;

/// Initializes the application's routes.
///
/// This function maps paths (e.g. "/sequences") and HTTP methods (e.g. "GET") to functions in [`crate::controllers`] as well as includes middlewares defined in [`crate::middlewares`] into the routing layer (see [`axum::Router`]).
pub fn init_routes(app_state: AppState) -> Router {
    let shared_app_state = Arc::new(app_state);
    Router::new()
        .route("/sequences", get(controllers::sequences::read_all))
        .route("/sequences", post(controllers::sequences::create))
        .route("/sequences/:id", delete(controllers::sequences::delete))
        .route("/sequences/:id", get(controllers::sequences::read_one))
        .layer(CorsLayer::permissive())
        .with_state(shared_app_state)
}
