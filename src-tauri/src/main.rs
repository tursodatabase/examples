// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use libsql::{params, Database, Row, Rows};
use serde::{Deserialize, Serialize};
use std::env;

use std::time::SystemTime;
use std::time::UNIX_EPOCH;
use std::vec;

use tracing::info;
use uuid::Uuid;

#[derive(Deserialize, Serialize, Debug)]
pub struct NoteItem {
    id: String,
    title: String,
    text: String,
    created_at: u64,
    updated_at: u64,
}

#[tauri::command]
async fn get_all_notes() -> Result<Vec<NoteItem>, String> {
    tracing_subscriber::fmt::init();

    dotenv().expect(".env file not found");

    let db_path = env::var("DB_PATH").unwrap();
    let sync_url = env::var("TURSO_SYNC_URL").unwrap();
    let auth_token = env::var("TURSO_TOKEN").unwrap();

    println!(
        "Here are the env vars: db_path: {:?}, auth_token: {:?}, _syncrl: {:?}",
        db_path, auth_token, sync_url
    );

    let db = match Database::open_with_remote_sync(db_path, sync_url, auth_token).await {
        Ok(db) => db,
        Err(error) => {
            eprintln!("Error connecting to remote sync server: {}", error);
            return;
        }
    };

    let conn = db.connect().unwrap();

    print!("Syncing with remote database...");
    db.sync().await.unwrap();
    println!(" done");

    let mut results = conn.query("SELECT * FROM notes", ()).await.unwrap();

    println!("Note entries:");

    let mut notes: Vec<NoteItem> = Vec::new();
    while let Some(row) = results.next().unwrap() {
        let note: NoteItem = NoteItem {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            text: row.get(2).unwrap(),
            created_at: row.get(3).unwrap(),
            updated_at: row.get(4).unwrap(),
        };
        info!("  {:?}", note);
        notes.push(note);
    }

    Ok(notes)
}

// #[tauri::command]
// #[tokio::main]
// async fn new_note() {
//     tracing_subscriber::fmt::init();

//     dotenv().expect(".env file not found");

//     let db_path = env::var("DB_PATH").unwrap();
//     let sync_url = env::var("TURSO_SYNC_URL").unwrap();
//     let auth_token = env::var("TURSO_TOKEN").unwrap();

//     println!(
//         "Here are the env vars: _db_path: {:?}, _auth_token: {:?}, _sync_url: {:?}",
//         db_path, auth_token, sync_url
//     );

//     let db = match Database::open_with_remote_sync(db_path, sync_url, auth_token).await {
//         Ok(db) => db,
//         Err(error) => {
//             eprintln!("Error connecting to remote sync server: {}", error);
//             return;
//         }
//     };

//     let conn = db.connect().unwrap();

//     let mut id = Uuid::new_v4();
//     let mut created_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
//         Ok(n) => n.as_secs(),
//         Err(_) => panic!("SystemTime before UNIX EPOCH!"),
//     };
//     let mut title = String::from("New note..");

//     let params = params![id.to_string(), title, created_at];

//     let response = conn
//         .execute(
//             "INSERT INTO note (id, title, created_at) VALUES (?, ?, ?)",
//             params,
//         )
//         .await
//         .unwrap();

//     print!("Syncing with remote database...");
//     db.sync().await.unwrap();
//     println!(" done");

//     println!("Notes added: [{:?}]!", response);
// }

// #[tauri::command]
// #[tokio::main]
// async fn update_note(id: &str, new_text: &str) -> Result<u64, String> {
//     tracing_subscriber::fmt::init();

//     info!(id, new_text);

//     dotenv().expect(".env file not found");

//     let db_path = env::var("DB_PATH").unwrap();
//     let sync_url = env::var("TURSO_SYNC_URL").unwrap();
//     let auth_token = env::var("TURSO_TOKEN").unwrap();

//     println!(
//         "Here are the env vars: _db_path: {:?}, _auth_token: {:?}, _sync_url: {:?}",
//         db_path, auth_token, sync_url
//     );

//     let db = match Database::open_with_remote_sync(db_path, sync_url, auth_token).await {
//         Ok(db) => db,
//         Err(error) => {
//             println!("Error connecting to remote sync server: {}", error);
//             return;
//         }
//     };

//     let conn = db.connect().unwrap();

//     let created_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
//         Ok(n) => n.as_secs(),
//         Err(_) => panic!("SystemTime before UNIX EPOCH!"),
//     };

//     let params = params!([new_text.to_string(), id]);
//     let updated_note = conn
//         .execute("UPDATE notes SET text = ? where id = ?", params)
//         .await
//         .unwrap();

//     db.sync().await.unwrap();

//     let result = r#"Notes added!"#;
//     result.to_string();
//     format!("Notes added {}", result);

//     Ok(updated_note)
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_notes,
            // new_note,git
            // update_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
