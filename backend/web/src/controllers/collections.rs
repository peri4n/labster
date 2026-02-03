use crate::{controllers::Pagination, error::Error, state::SharedAppState};
use axum::{extract::{Path, Query, State}, http::StatusCode, Json};
use labster_db::entities::{self, sequences::Sequence};
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
    let collections = entities::collections::load_all(&app_state.db_pool).await?;

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
    get,
    path = "/collections/{collection_id}/sequences",
    params(
        ("collection_id" = i32, Path, description = "Collection ID"),
        ("offset" = Option<usize>, Query, description = "Number of items to skip before starting to collect the result set"),
        ("per_page" = Option<usize>, Query, description = "Number of items to return per page")
    ),
    responses(
        (status = 200, description = "List all sequences in collection", body = [entities::sequences::Sequence]),
        (status = 404, description = "Collection not found"),
        (status = 500, description = "Internal server error")
    )
)]
pub async fn read_all_in_collection(
    State(app_state): State<SharedAppState>,
    Path(collection_id): Path<i32>,
    Query(pagination): Query<Pagination>,
) -> Result<Json<Vec<Sequence>>, Error> {
    let sequences = entities::sequences::load_from_collection(
        &app_state.db_pool,
        collection_id,
        pagination.offset(),
        pagination.per_page(),
    )
    .await?;

    info!("responding with {:?}", sequences);

    Ok(Json(sequences))
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
