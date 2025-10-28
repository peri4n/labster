use labster_web::test_helpers::{BodyExt, DbTestContext, RouterExt};
use axum::{
    body::Body,
    http::{self, Method},
};
use fake::{Fake, Faker};
use googletest::prelude::*;
use hyper::StatusCode;
use labster_db::{entities::{self, sequences::SequenceChangeset}, transaction, Error};
use labster_macros::db_test;
use serde_json::json;
use std::collections::HashMap;
use uuid::Uuid;

#[db_test]
async fn test_create_invalid(context: &DbTestContext) {

    let payload = json!(SequenceChangeset {
        identifier: String::from(""),
        description: None,
        sequence: String::from(""),
    });

    let response = context
        .app
        .request("/sequences")
        .method(Method::POST)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::BAD_REQUEST));
}

#[db_test]
async fn test_create_success(context: &DbTestContext) {
    let changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let payload = json!(changeset);

    let response = context
        .app
        .request("/sequences")
        .method(Method::POST)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::CREATED));

    let sequences = entities::sequences::load_all(&context.db_pool, 0, 100).await.unwrap();
    assert_that!(sequences, len(eq(1)));
    assert_that!(
        sequences.first().unwrap().description,
        eq(&changeset.description)
    );
}

#[db_test]
async fn test_read_all(context: &DbTestContext) {
    let changeset: entities::sequences::SequenceChangeset = Faker.fake();
    entities::sequences::create(changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let response = context
        .app
        .request("/sequences")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let sequences: Vec<entities::sequences::Sequence> = response.into_body().into_json::<Vec<entities::sequences::Sequence>>().await;
    assert_that!(sequences, len(eq(1)));
    assert_that!(
        sequences.first().unwrap().description,
        eq(&changeset.description)
    );
}

#[db_test]
async fn test_read_one_nonexistent(context: &DbTestContext) {
    let response = context
        .app
        .request(&format!("/sequences/{}", 42))
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NOT_FOUND));
}

#[db_test]
async fn test_read_one_success(context: &DbTestContext) {
    let sequence_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let sequence = entities::sequences::create(sequence_changeset.clone(), &context.db_pool)
        .await
        .unwrap();
    let sequence_id = sequence.id;

    let response = context
        .app
        .request(&format!("/sequences/{}", sequence_id))
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let sequence: entities::sequences::Sequence = response.into_body().into_json::<entities::sequences::Sequence>().await;
    assert_that!(sequence.id, eq(sequence_id));
    assert_that!(sequence.description, eq(&sequence_changeset.description));
}

#[db_test]
async fn test_update_invalid(context: &DbTestContext) {
    let sequence_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let sequence = entities::sequences::create(sequence_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let payload = json!(entities::sequences::SequenceChangeset {
        identifier: String::from(""),
        description: None,
        sequence: String::from(""),
    });

    let response = context
        .app
        .request(&format!("/sequences/{}", sequence.id))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::BAD_REQUEST));

    let sequence_after = entities::sequences::load(sequence.id, &context.db_pool).await.unwrap();
    assert_that!(sequence_after.description, eq(&sequence.description));
}

#[db_test]
async fn test_update_nonexistent(context: &DbTestContext) {
    let sequence_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let payload = json!(sequence_changeset);

    let response = context
        .app
        .request(&format!("/sequences/{}", 52))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NOT_FOUND));
}

#[db_test]
async fn test_update_success(context: &DbTestContext) {
    let sequence_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let sequence = entities::sequences::create(sequence_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let new_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let payload = json!(new_changeset);

    let response = context
        .app
        .request(&format!("/sequences/{}", sequence.id))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let updated_sequence: entities::sequences::Sequence = response.into_body().into_json::<entities::sequences::Sequence>().await;
    assert_that!(updated_sequence.description, eq(&new_changeset.description));

    let sequence_from_db = entities::sequences::load(sequence.id, &context.db_pool).await.unwrap();
    assert_that!(sequence_from_db.description, eq(&new_changeset.description));
}

#[db_test]
async fn test_delete_nonexistent(context: &DbTestContext) {
    let response = context
        .app
        .request(&format!("/sequences/{}", 73))
        .method(Method::DELETE)
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NO_CONTENT));
}

#[db_test]
async fn test_delete_success(context: &DbTestContext) {
    let sequence_changeset: entities::sequences::SequenceChangeset = Faker.fake();
    let sequence = entities::sequences::create(sequence_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let response = context
        .app
        .request(&format!("/sequences/{}", sequence.id))
        .method(Method::DELETE)
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NO_CONTENT));

    let result = entities::sequences::load(sequence.id, &context.db_pool).await;
    assert_that!(result, err(anything()));
}
