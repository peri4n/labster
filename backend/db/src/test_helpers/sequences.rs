use crate::entities::sequences::{Sequence, SequenceChangeset};
use sqlx::postgres::PgPool;

pub async fn create(sequence: SequenceChangeset, db: &PgPool) -> Result<Sequence, anyhow::Error> {
    let record = sqlx::query!(
        "INSERT INTO sequences (identifier, description, sequence) VALUES ($1, $2, $3) RETURNING id, created_at",
        sequence.identifier,
        sequence.description,
        sequence.sequence,
    )
    .fetch_one(db)
    .await?;

    Ok(Sequence::new(record.id, sequence.identifier, sequence.description, sequence.sequence, record.created_at))
}
