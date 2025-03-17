use serde::Deserialize;
use serde::Serialize;
use sqlx::types::chrono;
use sqlx::Postgres;
use validator::Validate;

#[derive(Serialize, Debug, Deserialize, sqlx::Type, strum::Display)]
#[serde(rename_all = "lowercase")]
#[sqlx(type_name = "alphabet", rename_all = "lowercase")]
enum Alphabet {
    #[strum(serialize = "dna")]
    Dna,

    #[strum(serialize = "rna")]
    Rna,

    #[strum(serialize = "protein")]
    Protein,
}

#[derive(Serialize, Debug, Deserialize)]
pub struct Sequence {
    id: i32,
    alphabet: Alphabet,
    identifier: String,
    description: String,
    sequence: String,
    created_at: chrono::NaiveDateTime,
}

#[derive(Deserialize, Validate)]
pub struct SequenceChangeset {
    #[validate(length(min = 1))]
    identifier: String,

    alphabet: Alphabet,

    description: String,

    #[validate(length(min = 1))]
    sequence: String,
}

pub async fn load_all(
    executor: impl sqlx::Executor<'_, Database = Postgres>,
) -> Result<Vec<Sequence>, crate::Error> {
    let sequences = sqlx::query_as!(Sequence, r#"SELECT id, identifier, alphabet as "alphabet: Alphabet", description, sequence, created_at FROM sequences"#)
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
        r#"SELECT id, identifier, alphabet as "alphabet: _", description, sequence, created_at FROM sequences WHERE id = $1"#,
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
        "INSERT INTO sequences (identifier, alphabet, description, sequence) VALUES ($1, ($2::text)::alphabet, $3, $4) RETURNING id, created_at",
        sequence.identifier,
        sequence.alphabet.to_string(),
        sequence.description,
        sequence.sequence,
    )
    .fetch_one(executor)
    .await
    .map_err(crate::Error::DbError)?;

    Ok(Sequence {
        id: record.id,
        identifier: sequence.identifier,
        alphabet: sequence.alphabet,
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
        r#"UPDATE sequences SET identifier = $1, alphabet = ($2::text)::alphabet , description = $3, sequence = $4 WHERE id = $5 RETURNING id, identifier, alphabet as "alphabet!: Alphabet", description, sequence, created_at"#,
        sequence.identifier,
        sequence.alphabet.to_string(),
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
            alphabet: record.alphabet,
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
    match sqlx::query!("DELETE FROM sequences WHERE id = $1 RETURNING id", id)
        .fetch_optional(executor)
        .await
        .map_err(crate::Error::DbError)?
    {
        Some(_) => Ok(()),
        None => Err(crate::Error::NoRecordFound),
    }
}
