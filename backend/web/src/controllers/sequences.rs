use crate::{error::Error, state::SharedAppState};
use axum::{extract::Path, extract::State, http::StatusCode, Json};
use labster_db::entities;
use tracing::info;
use uuid::Uuid;

#[axum::debug_handler]
pub async fn create(
    State(app_state): State<SharedAppState>,
    Json(sequence): Json<entities::sequences::SequenceChangeset>,
) -> Result<(StatusCode, Json<entities::sequences::Sequence>), Error> {
    let sequence = entities::sequences::create(sequence, &app_state.db_pool).await?;
    Ok((StatusCode::CREATED, Json(sequence)))
}

#[axum::debug_handler]
pub async fn read_all(
    State(app_state): State<SharedAppState>,
) -> Result<Json<Vec<entities::sequences::Sequence>>, Error> {
    let sequences = entities::sequences::load_all(&app_state.db_pool).await?;

    info!("responding with {:?}", sequences);

    Ok(Json(sequences))
}

#[axum::debug_handler]
pub async fn read_one(
    State(app_state): State<SharedAppState>,
    Path(id): Path<Uuid>,
) -> Result<() /* e.g. Json<entities::sequences::Sequence> */, Error> {
    todo!("load resource via labster_db's APIs, trace, and respond!")

    /* Example:
    let sequence = entities::sequences::load(id, &app_state.db_pool).await?;
    Ok(Json(sequence))
    */
}

#[axum::debug_handler]
pub async fn update(
    State(app_state): State<SharedAppState>,
    Path(id): Path<Uuid>,
    Json(sequence): Json<() /* e.g. entities::sequences::SequenceChangeset */>,
) -> Result<() /* e.g. Json<entities::sequences::Sequence> */, Error> {
    todo!("update resource via labster_db's APIs, trace, and respond!")

    /* Example:
    let sequence = entities::sequences::update(id, sequence, &app_state.db_pool).await?;
    Ok(Json(sequence))
    */
}

#[axum::debug_handler]
pub async fn delete(
    State(app_state): State<SharedAppState>,
    Path(id): Path<i32>,
) -> Result<StatusCode, Error> {

    entities::sequences::delete(id, &app_state.db_pool).await?;
    Ok(StatusCode::NO_CONTENT)
}
