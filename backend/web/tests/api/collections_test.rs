use labster_web::test_helpers::{BodyExt, DbTestContext, RouterExt};
use axum::{
    body::Body,
    http::{self, Method},
};
use fake::{Fake, Faker};
use googletest::prelude::*;
use hyper::StatusCode;
use labster_db::{entities::{self, alphabet::Alphabet, collections::{create, load, Collection}}, transaction, Error};
use labster_macros::db_test;
use serde_json::json;

#[db_test]
async fn test_create_invalid(context: &DbTestContext) {

    let payload = json!(entities::collections::CollectionChangeset {
        name: String::from(""),
        description: Some(String::from("")),
        alphabet: Alphabet::Dna,
    });

    let response = context
        .app
        .request("/collections")
        .method(Method::POST)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::BAD_REQUEST));
}

#[db_test]
async fn test_create_success(context: &DbTestContext) {
    let changeset: entities::collections::CollectionChangeset = Faker.fake();
    let payload = json!(changeset);

    let response = context
        .app
        .request("/collections")
        .method(Method::POST)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::CREATED));

    let collections = entities::collections::load_all(&context.db_pool).await.unwrap();
    assert_that!(collections, len(eq(1)));
    assert_that!(
        collections.first().unwrap().description,
        eq(&changeset.description)
    );
}

#[db_test]
async fn test_read_all(context: &DbTestContext) {
    let changeset: entities::collections::CollectionChangeset = Faker.fake();
    entities::collections::create(changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let response = context
        .app
        .request("/collections")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let collections: Vec<entities::collections::Collection> = response.into_body().into_json::<Vec<entities::collections::Collection>>().await;
    assert_that!(collections, len(eq(1)));
    assert_that!(
        collections.first().unwrap().description,
        eq(&changeset.description)
    );
}

#[db_test]
async fn test_read_one_nonexistent(context: &DbTestContext) {
    let response = context
        .app
        .request(&format!("/collections/{}", 42))
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NOT_FOUND));
}

#[db_test]
async fn test_read_one_success(context: &DbTestContext) {
    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let collection = create(collection_changeset.clone(), &context.db_pool)
        .await
        .unwrap();
    let collection_id = collection.id;

    let response = context
        .app
        .request(&format!("/collections/{}", collection_id))
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let collection: entities::collections::Collection = response.into_body().into_json::<entities::collections::Collection>().await;
    assert_that!(collection.id, eq(collection_id));
    assert_that!(collection.description, eq(&collection_changeset.description));
}

#[db_test]
async fn test_update_invalid(context: &DbTestContext) {
    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let collection = create(collection_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let payload = json!(entities::collections::CollectionChangeset {
        name: String::from(""),
        description: Some(String::from("")),
        alphabet: Alphabet::Dna,
    });

    let response = context
        .app
        .request(&format!("/collections/{}", collection.id))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::BAD_REQUEST));

    let collection_after = load(collection.id, &context.db_pool).await.unwrap();
    assert_that!(collection_after.description, eq(&collection.description));
}

#[db_test]
async fn test_update_nonexistent(context: &DbTestContext) {
    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let payload = json!(collection_changeset);

    let response = context
        .app
        .request(&format!("/collections/{}", 52))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NOT_FOUND));
}

#[db_test]
async fn test_update_success(context: &DbTestContext) {

    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let collection = create(collection_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let payload = json!(collection_changeset);

    let response = context
        .app
        .request(&format!("/collections/{}", collection.id))
        .method(Method::PUT)
        .body(Body::from(payload.to_string()))
        .header(http::header::CONTENT_TYPE, "application/json")
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::OK));

    let collection: entities::collections::Collection = response.into_body().into_json::<Collection>().await;
    assert_that!(collection.description, eq(&collection_changeset.description.clone()));

    let collection = load(collection.id, &context.db_pool).await.unwrap();
    assert_that!(collection.description, eq(&collection_changeset.description));
}

#[db_test]
async fn test_delete_nonexistent(context: &DbTestContext) {
    let response = context
        .app
        .request(&format!("/collections/{}", 73))
        .method(Method::DELETE)
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NO_CONTENT));
}

#[db_test]
async fn test_delete_success(context: &DbTestContext) {
    let collection_changeset: entities::collections::CollectionChangeset = Faker.fake();
    let collection = create(collection_changeset.clone(), &context.db_pool)
        .await
        .unwrap();

    let response = context
        .app
        .request(&format!("/collections/{}", collection.id))
        .method(Method::DELETE)
        .send()
        .await;

    assert_that!(response.status(), eq(StatusCode::NO_CONTENT));

    let result = load(collection.id, &context.db_pool).await;
    assert_that!(result, err(anything()));
}
