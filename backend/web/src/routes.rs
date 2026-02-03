use crate::{
    controllers,
    state::{AppState, SharedAppState},
};
use axum::{
    Json, Router,
    extract::{MatchedPath, Request, State},
    middleware::Next,
    response::IntoResponse,
    routing::{delete, get, post, put},
};
use tower_http::{compression::CompressionLayer, cors::CorsLayer};
use utoipa::OpenApi;

use std::{sync::Arc, time::Instant};

/// Initializes the application's routes.
///
/// This function maps paths (e.g. "/sequences") and HTTP methods (e.g. "GET") to functions in [`crate::controllers`] as well as includes middlewares defined in [`crate::middlewares`] into the routing layer (see [`axum::Router`]).
pub fn init_routes(app_state: AppState) -> Router {
    let shared_app_state = Arc::new(app_state);
    Router::new()

        // Sequence endpoints
        .route("/sequences", get(controllers::sequences::read_all))
        .route("/sequences", post(controllers::sequences::create))
        .route("/sequences/{id}", put(controllers::sequences::update))
        .route("/sequences/{id}", delete(controllers::sequences::delete))
        .route("/sequences/{id}", get(controllers::sequences::read_one))

        // Collection endpoints
        .route("/collections", get(controllers::collections::read_all))
        .route("/collections", post(controllers::collections::create))
        .route("/collections/{id}", put(controllers::collections::update))
        .route(
            "/collections/{id}",
            delete(controllers::collections::delete),
        )
        .route("/collections/{id}", get(controllers::collections::read_one))
        .route(
            "/collections/{id}/sequences",
            get(controllers::collections::read_all_in_collection),
        )

        // Misc endpoints
        .route("/metrics", get(render_metrics))
        .route("/api-docs/openapi.json", get(openapi))

        // Middlewares
        .layer(CorsLayer::permissive())
        .layer(CompressionLayer::new().gzip(true))
        .layer(axum::middleware::from_fn(track_metrics))
        .with_state(shared_app_state)
}

#[derive(OpenApi)]
#[openapi(
    paths(
        openapi,
        controllers::sequences::create,
        controllers::sequences::read_all,
        controllers::sequences::read_one,
        controllers::sequences::update,
        controllers::sequences::delete,
        controllers::collections::create,
        controllers::collections::read_all,
        controllers::collections::read_one,
        controllers::collections::update,
        controllers::collections::delete,
        controllers::collections::read_all_in_collection,
    ),
    components(
        schemas(
            labster_db::entities::sequences::Sequence,
            labster_db::entities::sequences::SequenceChangeset,
            labster_db::entities::collections::Collection,
            labster_db::entities::collections::CollectionChangeset,
            labster_db::entities::alphabet::Alphabet,
        )
    )
)]
struct ApiDoc;

/// Return JSON version of an OpenAPI schema
#[utoipa::path(
    get,
    path = "/api-docs/openapi.json",
    responses(
        (status = 200, description = "JSON file", body = ())
    )
)]
async fn openapi() -> Json<utoipa::openapi::OpenApi> {
    Json(ApiDoc::openapi())
}

pub async fn render_metrics(State(app_state): State<SharedAppState>) -> impl IntoResponse {
    app_state.metrics_handle.render()
}

async fn track_metrics(req: Request, next: Next) -> impl IntoResponse {
    let start = Instant::now();
    let path = if let Some(matched_path) = req.extensions().get::<MatchedPath>() {
        matched_path.as_str().to_owned()
    } else {
        req.uri().path().to_owned()
    };
    let method = req.method().clone();

    let response = next.run(req).await;

    let latency = start.elapsed().as_secs_f64();
    let status = response.status().as_u16().to_string();

    let labels = [
        ("method", method.to_string()),
        ("path", path),
        ("status", status),
    ];

    let counter = metrics::counter!("http_requests_total", &labels);
    counter.increment(1);
    let histogram = metrics::histogram!("http_requests_duration_seconds", &labels);
    histogram.record(latency);

    response
}
