#[cfg(feature = "test-helpers")]
use fake::Dummy;
use serde::Deserialize;
use serde::Serialize;
use sqlx::Postgres;
use sqlx::types::chrono;
use validator::Validate;

#[derive(Serialize, Debug, Deserialize, utoipa::ToSchema)]
pub struct Sequence {
    pub id: i32,
    pub identifier: String,
    pub description: Option<String>,
    pub sequence: String,
    #[schema(value_type = String, format = "date-time")]
    pub created_at: chrono::NaiveDateTime,
}

impl Sequence {
    pub fn new(
        id: i32,
        identifier: String,
        description: Option<String>,
        sequence: String,
        created_at: chrono::NaiveDateTime,
    ) -> Self {
        Self {
            id,
            identifier,
            description,
            sequence,
            created_at,
        }
    }
}

#[derive(Deserialize, Validate, Clone, utoipa::ToSchema)]
#[cfg_attr(feature = "test-helpers", derive(Serialize, Dummy))]
pub struct SequenceChangeset {
    #[validate(length(min = 1))]
    pub identifier: String,

    pub description: Option<String>,

    #[validate(length(min = 1))]
    pub sequence: String,
}


pub async fn load_all(
    executor: impl sqlx::Executor<'_, Database = Postgres>,
    offset: usize,
    limit: usize,
) -> Result<Vec<Sequence>, crate::Error> {
    let sequences = sqlx::query_as!(Sequence, r#"SELECT id, identifier, description, sequence, created_at FROM sequences ORDER BY id LIMIT $1 OFFSET $2"#, limit as i32, offset as i32)
        .fetch_all(executor)
        .await?;
    Ok(sequences)
}

pub async fn load_all_in_collection(
    executor: impl sqlx::Executor<'_, Database = Postgres>,
    collection_id: i32,
    offset: usize,
    limit: usize,
) -> Result<Vec<Sequence>, crate::Error> {
    let sequences = sqlx::query_as!(Sequence, r#"SELECT id, identifier, description, sequence, created_at FROM sequences WHERE collection_id = $1 ORDER BY id LIMIT $2 OFFSET $3"#, collection_id, limit as i32, offset as i32)
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
        r#"SELECT id, identifier, description, sequence, created_at FROM sequences WHERE id = $1"#,
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
        "INSERT INTO sequences (identifier, description, sequence) VALUES ($1, $2, $3) RETURNING id, created_at",
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
        sequence: sequence.sequence,
        created_at: record.created_at,
    })
}

pub async fn update(
    id: i32,
    sequence: SequenceChangeset,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Sequence, crate::Error> {
    sequence.validate()?;

    match sqlx::query!(
        r#"UPDATE sequences SET identifier = $1, description = $2, sequence = $3 WHERE id = $4 RETURNING id, identifier, description, sequence, created_at"#,
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
            created_at: record.created_at,
        }),
        None => Err(crate::Error::NoRecordFound),
    }
}

pub async fn delete(
    id: i32,
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<(), crate::Error> {
    sqlx::query!("DELETE FROM sequences WHERE id = $1 RETURNING id", id)
        .fetch_optional(executor)
        .await
        .map_err(crate::Error::DbError)
        .map(|_| ())
}
