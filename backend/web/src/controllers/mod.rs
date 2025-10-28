use serde::Deserialize;
use validator::Validate;

pub mod sequences;

#[derive(Deserialize, Validate)]
pub struct Pagination {
    page: Option<usize>,
    per_page: Option<usize>,
}

impl Pagination {
    fn offset(&self) -> usize {
        self.page() * self.per_page()
    }

    fn per_page(&self) -> usize {
        self.per_page.unwrap_or(10)
    }

    fn page(&self) -> usize {
        self.page.unwrap_or(0)
    }
}
pub mod collections;
