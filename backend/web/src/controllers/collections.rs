use crate::{error::Error, state::SharedAppState};
use axum::{extract::Path, extract::State, http::StatusCode, Json};
use labster_db::entities;
use tracing::info;

#[axum::debug_handler]
pub async fn create(
    State(app_state): State<SharedAppState>,
    Json(collection): Json<entities::collections::CollectionChangeset>,
) -> Result<(StatusCode, Json<entities::collections::Collection>), Error> {

    let collection = entities::collections::create(collection, &app_state.db_pool).await?;
    Ok((StatusCode::CREATED, Json(collection)))
}

#[axum::debug_handler]
pub async fn read_all(
    State(app_state): State<SharedAppState>,
) -> Result<Json<Vec<entities::collections::Collection>>, Error> {
    let collections = entities::collections::load_all(&app_state.db_pool)
        .await?;

    info!("responding with {:?}", collections);

    Ok(Json(collections))
}

#[axum::debug_handler]
pub async fn read_one(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<Json<entities::collections::Collection>, Error> {
    let collection = entities::collections::load(id, &app_state.db_pool).await?;
    Ok(Json(collection))
}

#[axum::debug_handler]
pub async fn update(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
    Json(collection): Json<entities::collections::CollectionChangeset>,
) -> Result<Json<entities::collections::Collection>, Error> {

    let collection = entities::collections::update(id, collection, &app_state.db_pool).await?;
    Ok(Json(collection))
}

#[axum::debug_handler]
pub async fn delete(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, Error> {

    entities::collections::delete(id, &app_state.db_pool).await?;
    Ok(StatusCode::NO_CONTENT)
}
