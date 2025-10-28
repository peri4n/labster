#[cfg(feature = "test-helpers")]
use fake::{faker::name::en::*, Dummy};
use serde::Deserialize;
use serde::Serialize;
use sqlx::types::chrono;
use sqlx::Postgres;
use validator::Validate;
use crate::entities::alphabet::Alphabet;

#[derive(Serialize, Debug, Deserialize, utoipa::ToSchema)]
pub struct Collection {
    pub id: i32,
    pub alphabet: Alphabet,
    pub name: String,
    pub description: Option<String>,
    #[schema(value_type = String, format = "date-time")]
    pub created_at: chrono::NaiveDateTime,
    #[schema(value_type = String, format = "date-time")]
    pub last_modified: chrono::NaiveDateTime,
}

#[derive(Deserialize, Validate, Clone, utoipa::ToSchema)]
#[cfg_attr(feature = "test-helpers", derive(Serialize, Dummy))]
pub struct CollectionChangeset {
    #[cfg_attr(feature = "test-helpers", dummy(faker = "Name()"))]
    #[validate(length(min = 1))]
    pub name: String,

    pub description: Option<String>,

    pub alphabet: Alphabet,
}

pub async fn load_all(
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Vec<Collection>, crate::Error> {
    let collections = sqlx::query_as!(Collection, 
        r#"SELECT id, alphabet as "alphabet: _", name, description, created_at, last_modified FROM collections"#)
        .fetch_all(executor)
        .await?;
    Ok(collections)
}

pub async fn load(
    id: i32,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Collection, crate::Error> {
    match sqlx::query_as!(
        Collection,
        r#"SELECT id, alphabet as "alphabet: _", name, description, created_at, last_modified FROM collections WHERE id = $1"#,
        id
    )
    .fetch_optional(executor)
    .await
    .map_err(crate::Error::DbError)?
    {
        Some(collection) => Ok(collection),
        None => Err(crate::Error::NoRecordFound),
    }
}

pub async fn create(
    collection: CollectionChangeset,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Collection, crate::Error> {
    collection.validate()?;

    let record = sqlx::query!(
        "INSERT INTO collections (name, description, alphabet) VALUES ($1, $2, ($3::alphabet)) RETURNING id, created_at, last_modified",
        collection.name, collection.description, collection.alphabet as Alphabet
    )
    .fetch_one(executor)
    .await
    .map_err(crate::Error::DbError)?;

    Ok(Collection {
        id: record.id,
        name: collection.name,
        description: collection.description,
        alphabet: collection.alphabet,
        created_at: record.created_at,
        last_modified: record.last_modified,
    })
}

pub async fn update(
    id: i32,
    collection: CollectionChangeset,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Collection, crate::Error> {
    collection.validate()?;

    match sqlx::query!(
        "UPDATE collections SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description, created_at, last_modified",
        collection.name,
        collection.description,
        id
    )
    .fetch_optional(executor)
    .await
    .map_err(crate::Error::DbError)?
    {
        Some(record) => Ok(Collection {
            id: record.id,
            name: record.name,
            description: record.description,
            alphabet: collection.alphabet,
            created_at: record.created_at,
            last_modified: record.last_modified,
        }),
        None => Err(crate::Error::NoRecordFound),
    }
}

pub async fn delete(
    id: i32,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<(), crate::Error> {
    match sqlx::query!("DELETE FROM collections WHERE id = $1 RETURNING id", id)
        .fetch_optional(executor)
        .await
        .map_err(crate::Error::DbError)?
    {
        Some(_) => Ok(()),
        None => Ok(())
    }
}
