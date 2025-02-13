use googletest::prelude::*;
use labster_macros::test;
use labster_web::controllers::greeting::Greeting;
use labster_web::test_helpers::{BodyExt, RouterExt, TestContext};

#[test]
async fn test_hello(context: &TestContext) {
    let response = context.app.request("/greet").send().await;

    let greeting: Greeting = response.into_body().into_json().await;
    assert_that!(greeting.hello, eq(&String::from("world")));
}
