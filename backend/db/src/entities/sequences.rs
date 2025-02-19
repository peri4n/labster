use serde::Deserialize;
use serde::Serialize;
use sqlx::Postgres;
use validator::Validate;

#[derive(Serialize, Debug, Deserialize)]
pub struct Sequence {
    id: i32,
    identifier: String,
    description: String,
    sequence: String,
}

#[derive(Deserialize, Validate, Clone)]
pub struct SequenceChangeset {
    #[validate(length(min = 1))]
    identifier: String,

    description: String,

    #[validate(length(min = 1))]
    sequence: String,
}

pub async fn load_all(
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Vec<Sequence>, crate::Error> {
    let sequences = sqlx::query_as!(Sequence, "SELECT id, identifier, description, sequence FROM sequences")
        .fetch_all(executor)
        .await?;
    Ok(sequences)
}

pub async fn load(
    id: i32,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Sequence, crate::Error> {
    match sqlx::query_as!(
        Sequence,
        "SELECT id, identifier, description, sequence FROM sequences WHERE id = $1",
        id
    )
    .fetch_optional(executor)
    .await
    .map_err(crate::Error::DbError)?
    {
        Some(sequence) => Ok(sequence),
        None => Err(crate::Error::NoRecordFound),
    }
}

pub async fn create(
    sequence: SequenceChangeset,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Sequence, crate::Error> {
    sequence.validate()?;

    let record = sqlx::query!(
        "INSERT INTO sequences (identifier, description, sequence) VALUES ($1, $2, $3) RETURNING id",
        sequence.identifier,
        sequence.description,
        sequence.sequence,
    )
    .fetch_one(executor)
    .await
    .map_err(crate::Error::DbError)?;

    Ok(Sequence {
        id: record.id,
        identifier: sequence.identifier,
        description: sequence.description,
        sequence: sequence.sequence
    })
}

pub async fn update(
    id: i32,
    sequence: SequenceChangeset,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Sequence, crate::Error> {
    sequence.validate()?;

    match sqlx::query!(
        "UPDATE sequences SET identifier = $1, description = $2, sequence = $3 WHERE id = $4 RETURNING id, identifier, description, sequence",
        sequence.identifier,
        sequence.description,
        sequence.sequence,
        id
    )
    .fetch_optional(executor)
    .await
    .map_err(crate::Error::DbError)?
    {
        Some(record) => Ok(Sequence {
            id: record.id,
            identifier: record.identifier,
            description: record.description,
            sequence: record.sequence,
        }),
        None => Err(crate::Error::NoRecordFound),
    }
}

pub async fn delete(
    id: i32,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<(), crate::Error> {
    match sqlx::query!("DELETE FROM sequences WHERE id = $1 RETURNING id", id)
        .fetch_optional(executor)
        .await
        .map_err(crate::Error::DbError)?
    {
        Some(_) => Ok(()),
        None => Err(crate::Error::NoRecordFound),
    }
}
