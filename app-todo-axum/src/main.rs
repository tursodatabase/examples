use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};

use dotenvy::dotenv;
use libsql::{params, Connection, Database};
use serde::{Deserialize, Serialize};
use std::env;

#[tokio::main]
async fn main() {
    // initialize tracing
    tracing_subscriber::fmt::init();

    // build our application with a route
    let app = Router::new()
        // `GET /` goes to `root`
        .route("/", get(root))
        // `GET /todos` goes to `create_todo`
        .route("/todos", get(get_todos))
        // `POST /todos` goes to `create_todo`
        .route("/todos", post(create_todo));

    let conn = connection().await;

    let _ = conn
        .execute(
            "CREATE TABLE IF NOT EXISTS todos(task varchar non null)",
            (),
        )
        .await;

    // run our app with hyper
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

// basic handler that responds with a static string
async fn root() -> &'static str {
    "Hello, Axum! ❤︎ Turso"
}

// Initializes a database connection
async fn connection() -> Connection {
    dotenv().expect(".env file not found");

    let db_url = env::var("TURSO_DATABASE_URL").unwrap();
    let auth_token = env::var("TURSO_AUTH_TOKEN").unwrap();

    let db = Database::open_remote(db_url, auth_token).unwrap();

    db.connect().unwrap()
}

// Gets all tasks from the todo table
async fn get_todos() -> impl IntoResponse {
    let conn = connection().await;

    let mut results = conn.query("SELECT * FROM todos", ()).await.unwrap();

    let mut todos: Vec<Todo> = Vec::new();

    while let Some(row) = results.next().unwrap() {
        let todo: Todo = Todo {
            task: row.get(0).unwrap(),
        };
        todos.push(todo);
    }

    (StatusCode::OK, Json(todos))
}

// Creates a new task in the todo table
async fn create_todo(Json(payload): Json<CreateTodo>) -> impl IntoResponse {
    let todo = Todo { task: payload.task };

    let conn = connection().await;

    let _ = conn
        .query("INSERT into todos values (?1)", params![todo.task.clone()])
        .await;

    (StatusCode::CREATED, Json(todo))
}

// the struct for a todo item
#[derive(Serialize)]
struct Todo {
    task: String,
}

// the input to the create_todos handler
#[derive(Deserialize, Serialize, Debug)]
struct CreateTodo {
    task: String,
}
