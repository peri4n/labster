use crate::{error::Error, state::SharedAppState};
use axum::{extract::{Path, Query, State}, http::StatusCode, Json};
use labster_db::entities;
use tracing::info;

use super::Pagination;

#[axum::debug_handler]
#[utoipa::path(
    post,
    path = "/sequences",
    request_body = entities::sequences::SequenceChangeset,
    responses(
        (status = 201, description = "Sequence created successfully", body = entities::sequences::Sequence),
        (status = 400, description = "Bad request - validation failed"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn create(
    State(app_state): State<SharedAppState>,
    Json(sequence): Json<entities::sequences::SequenceChangeset>,
) -> Result<(StatusCode, Json<entities::sequences::Sequence>), Error> {
    let sequence = entities::sequences::create(sequence, &app_state.db_pool).await?;
    Ok((StatusCode::CREATED, Json(sequence)))
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    path = "/sequences",
    params(
        ("offset" = Option<usize>, Query, description = "Number of items to skip before starting to collect the result set"),
        ("per_page" = Option<usize>, Query, description = "Number of items to return per page")
    ),
    responses(
        (status = 200, description = "List all sequences", body = [entities::sequences::Sequence])
    )
)]
pub async fn read_all(
    State(app_state): State<SharedAppState>,
    Query(pagination): Query<Pagination>,
) -> Result<Json<Vec<entities::sequences::Sequence>>, Error> {
    let sequences = entities::sequences::load_all(&app_state.db_pool, pagination.offset(), pagination.per_page()).await?;

    info!("responding with {:?}", sequences);

    Ok(Json(sequences))
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    path = "/sequences/{id}",
    params(
        ("id" = i32, Path, description = "Sequence ID")
    ),
    responses(
        (status = 200, description = "Get sequence by ID", body = entities::sequences::Sequence),
        (status = 404, description = "Sequence not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn read_one(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<Json<entities::sequences::Sequence>, Error> {
    let sequence = entities::sequences::load(id, &app_state.db_pool).await?;
    Ok(Json(sequence))
}

#[axum::debug_handler]
#[utoipa::path(
    put,
    path = "/sequences/{id}",
    params(
        ("id" = i32, Path, description = "Sequence ID")
    ),
    request_body = entities::sequences::SequenceChangeset,
    responses(
        (status = 200, description = "Sequence updated successfully", body = entities::sequences::Sequence),
        (status = 400, description = "Bad request - validation failed"),
        (status = 404, description = "Sequence not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn update(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
    Json(sequence): Json<entities::sequences::SequenceChangeset>,
) -> Result<Json<entities::sequences::Sequence>, Error> {

    let sequence = entities::sequences::update(id, sequence, &app_state.db_pool).await?;
    Ok(Json(sequence))
}

#[axum::debug_handler]
#[utoipa::path(
    delete,
    path = "/sequences/{id}",
    params(
        ("id" = i32, Path, description = "Sequence ID")
    ),
    responses(
        (status = 204, description = "Sequence deleted successfully"),
        (status = 404, description = "Sequence not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn delete(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, Error> {

    entities::sequences::delete(id, &app_state.db_pool).await?;
    Ok(StatusCode::NO_CONTENT)
}
