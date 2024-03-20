use std::env;

use actix_web::{http::Error, web, App, HttpResponse, HttpServer, Result};
use dotenvy::dotenv;
use libsql::{Builder, Database, Value};
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct Page {
    title: String,
    link: String,
    visits: i32,
}

#[derive(Deserialize)]
struct QueryParams {
    link: String,
}

#[derive(Deserialize, Serialize, Debug)]
struct CreateHit {
    title: String,
    link: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().expect(".env file not found");

    let port = env::var("PORT").unwrap();
    let port = port.parse::<u16>().expect("Invalid port given");

    HttpServer::new(|| {
        App::new()
            .route("/", web::get().to(index))
            .route("/record", web::post().to(record_visit))
            .route("/hits", web::get().to(get_page_hits))
    })
    .bind(("127.0.0.1", port))?
    .run()
    .await
}

async fn connection() -> Database {
    dotenv().expect(".env file not found");

    let db_file = env::var("LOCAL_DB").unwrap();

    let auth_token = env::var("TURSO_AUTH_TOKEN").unwrap_or_else(|_| {
        println!("Using empty token since TURSO_AUTH_TOKEN was not set");
        "".to_string()
    });

    let url = env::var("TURSO_DATABASE_URL")
        .unwrap_or_else(|_| {
            println!("Using http://localhost:8080 TURSO_DATABASE_URL was not set");
            "http://localhost:8080".to_string()
        })
        .replace("libsql", "https");

    let db: Database = Builder::new_remote_replica(db_file, url, auth_token)
        .read_your_writes(true) // `true` by default - https://docs.turso.tech/sdk/rust/reference#read-your-own-writes
        .build()
        .await
        .unwrap();

    db
}

async fn index() -> Result<String> {
    let db = connection().await;
    let conn = db.connect().unwrap();

    conn.execute(
        "CREATE TABLE IF NOT EXISTS pages(title VARCHAR, link VARCHAR NOT NULL, visits INTEGER)",
        (),
    )
    .await
    .unwrap();

    db.sync().await.unwrap();

    Ok(format!("Welcome to the Web Traffic Checker! ❤︎ Turso"))
}

async fn get_page_hits(query: web::Query<QueryParams>) -> Result<HttpResponse, Error> {
    let db = connection().await;
    let conn = db.connect().unwrap();

    let link = query.link.as_str();

    let mut results = conn
        .query(
            "SELECT * FROM pages WHERE link = (?1)",
            vec![Value::from(link)],
        )
        .await
        .unwrap();

    let mut count_results = conn
        .query(
            "SELECT count(*) FROM pages WHERE link = (?1)",
            vec![Value::from(link)],
        )
        .await
        .unwrap();

    let row = results.next().await.unwrap().unwrap();
    let count = count_results.next().await.unwrap().unwrap();

    let hit: Page = Page {
        title: row.get(0).unwrap(),
        link: row.get(1).unwrap(),
        visits: count.get(0).unwrap(),
    };

    Ok(HttpResponse::Ok().json(hit))
}

async fn record_visit(payload: web::Json<CreateHit>) -> Result<HttpResponse, Error> {
    let hit = Page {
        title: payload.title.clone(),
        link: payload.link.clone(),
        visits: 1,
    };

    let db = connection().await;
    let conn = db.connect().unwrap();

    let _ = conn
        .query(
            "INSERT into pages (title, link, visits) values (?1, ?2, ?3)",
            vec![
                Value::from(hit.title.clone()),
                Value::from(hit.link.clone()),
                Value::from(hit.visits.clone()),
            ],
        )
        .await;

    Ok(HttpResponse::Ok().json(hit))
}
