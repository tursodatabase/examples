#[macro_use]
extern crate rocket;

use dotenvy::dotenv;
use libsql::{params, Database};
use rocket::serde::{json::Json, Deserialize, Serialize};
use std::env;

#[derive(Deserialize, Serialize, Debug)]
#[serde(crate = "rocket::serde")]
struct Todo {
    task: String,
}

#[get("/")]
async fn index() -> &'static str {
    "Hello, Turso!"
}

#[get("/todos")]
async fn get_todos() -> Json<Vec<Todo>> {
    dotenv().expect(".env file not found");

    let url = env::var("TURSO_DATABASE_URL").expect("TURSO_DATABASE_URL not found!");
    let token = env::var("TURSO_AUTH_TOKEN").expect("TURSO_AUTH_TOKEN not found!");

    let db = Database::open_remote(url, token).unwrap();
    let conn = db.connect().unwrap();

    let mut response = conn.query("select from ? from todos", ()).await.unwrap();

    let mut todos: Vec<Todo> = Vec::new();
    while let Some(row) = response.next().unwrap() {
        let todo: Todo = Todo {
            task: row.get(0).unwrap(),
        };
        todos.push(todo);
    }

    Json(todos)
}

#[post("/todos", format = "json", data = "<todo>")]
async fn add_todos(todo: Json<Todo>) -> Json<Todo> {
    dotenv().expect(".env file not found");

    let url = env::var("TURSO_DATABASE_URL").expect("TURSO_DATABASE_URL not found!");
    let token = env::var("TURSO_AUTH_TOKEN").expect("TURSO_AUTH_TOKEN not found!");

    println!("{:?} :::: {:?}", url, token);

    let db = Database::open_remote(url, token).unwrap();
    let conn = db.connect().unwrap();

    let _ = conn
        .query("insert into todos values (?1)", params!(todo.task.clone()))
        .await
        .unwrap();

    todo
}

#[launch]
fn rocket() -> _ {
    dotenv().ok();
    rocket::build().mount("/", routes![index, get_todos, add_todos])
}
