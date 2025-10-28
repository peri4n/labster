use crate::entities::collections::{Collection, CollectionChangeset};
use sqlx::postgres::PgPool;

pub async fn create(
    collection: CollectionChangeset,
    db: &PgPool,
) -> Result<Collection, anyhow::Error> {
    let record = sqlx::query!(
        "INSERT INTO collections (name, description, alphabet) VALUES ($1, $2, $3) RETURNING id, created_at, last_modified",
        collection.name,
        collection.description,
        collection.alphabet as _
    )
    .fetch_one(db)
    .await?;

    Ok(Collection {
        name: collection.name,
        description: collection.description,
        alphabet: collection.alphabet,
        id: record.id,
        created_at: record.created_at,
        last_modified: record.last_modified,
    })
}
