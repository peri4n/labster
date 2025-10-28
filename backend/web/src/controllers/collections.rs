use crate::{error::Error, state::SharedAppState};
use axum::{extract::Path, extract::State, http::StatusCode, Json};
use labster_db::entities;
use tracing::info;

#[axum::debug_handler]
#[utoipa::path(
    post,
    path = "/collections",
    request_body = entities::collections::CollectionChangeset,
    responses(
        (status = 201, description = "Collection created successfully", body = entities::collections::Collection),
        (status = 400, description = "Bad request - validation failed"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn create(
    State(app_state): State<SharedAppState>,
    Json(collection): Json<entities::collections::CollectionChangeset>,
) -> Result<(StatusCode, Json<entities::collections::Collection>), Error> {

    let collection = entities::collections::create(collection, &app_state.db_pool).await?;
    Ok((StatusCode::CREATED, Json(collection)))
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    path = "/collections",
    responses(
        (status = 200, description = "List all collections", body = [entities::collections::Collection]),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn read_all(
    State(app_state): State<SharedAppState>,
) -> Result<Json<Vec<entities::collections::Collection>>, Error> {
    let collections = entities::collections::load_all(&app_state.db_pool)
        .await?;

    info!("responding with {:?}", collections);

    Ok(Json(collections))
}

#[axum::debug_handler]
#[utoipa::path(
    get,
    path = "/collections/{id}",
    params(
        ("id" = i32, Path, description = "Collection ID")
    ),
    responses(
        (status = 200, description = "Get collection by ID", body = entities::collections::Collection),
        (status = 404, description = "Collection not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn read_one(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<Json<entities::collections::Collection>, Error> {
    let collection = entities::collections::load(id, &app_state.db_pool).await?;
    Ok(Json(collection))
}

#[axum::debug_handler]
#[utoipa::path(
    put,
    path = "/collections/{id}",
    params(
        ("id" = i32, Path, description = "Collection ID")
    ),
    request_body = entities::collections::CollectionChangeset,
    responses(
        (status = 200, description = "Collection updated successfully", body = entities::collections::Collection),
        (status = 400, description = "Bad request - validation failed"),
        (status = 404, description = "Collection not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn update(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
    Json(collection): Json<entities::collections::CollectionChangeset>,
) -> Result<Json<entities::collections::Collection>, Error> {

    let collection = entities::collections::update(id, collection, &app_state.db_pool).await?;
    Ok(Json(collection))
}

#[axum::debug_handler]
#[utoipa::path(
    delete,
    path = "/collections/{id}",
    params(
        ("id" = i32, Path, description = "Collection ID")
    ),
    responses(
        (status = 204, description = "Collection deleted successfully"),
        (status = 404, description = "Collection not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn delete(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, Error> {

    entities::collections::delete(id, &app_state.db_pool).await?;
    Ok(StatusCode::NO_CONTENT)
}
