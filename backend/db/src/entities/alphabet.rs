#[cfg(feature = "test-helpers")]
use fake::Dummy;
use serde::{Deserialize, Serialize};

#[cfg_attr(feature = "test-helpers", derive(Dummy))]
#[derive(Serialize, Debug, Deserialize, sqlx::Type, strum::Display, Clone, Copy, utoipa::ToSchema)]
#[serde(rename_all = "lowercase")]
#[sqlx(type_name = "alphabet", rename_all = "lowercase")]
pub enum Alphabet {
    #[strum(serialize = "dna")]
    Dna,

    #[strum(serialize = "rna")]
    Rna,

    #[strum(serialize = "protein")]
    Protein,
}
