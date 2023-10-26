// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use libsql::{params, Database};
use serde::{Deserialize, Serialize};
use std::env;

use std::ptr::null;
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
            return Err(error.to_string());
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

    info!("All notes: {:?}", notes);
    Ok(notes)
}

#[tauri::command]
async fn new_note() -> Result<NoteItem, String> {
    tracing_subscriber::fmt::init();

    dotenv().expect(".env file not found");

    let db_path = env::var("DB_PATH").unwrap();
    let sync_url = env::var("TURSO_SYNC_URL").unwrap();
    let auth_token = env::var("TURSO_TOKEN").unwrap();

    println!(
        "Here are the env vars: _db_path: {:?}, _auth_token: {:?}, _sync_url: {:?}",
        db_path, auth_token, sync_url
    );

    let db = match Database::open_with_remote_sync(db_path, sync_url, auth_token).await {
        Ok(db) => db,
        Err(error) => {
            eprintln!("Error connecting to remote sync server: {}", error);
            return Err(error.to_string());
        }
    };

    let conn = db.connect().unwrap();

    let id = Uuid::new_v4();
    let created_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    };
    let title = String::from("New note..");

    let params = params![id.to_string(), title, created_at];

    let mut response = conn
        .query(
            "INSERT INTO note (id, title, created_at) VALUES (?, ?, ?)",
            params,
        )
        .await
        .unwrap();

    print!("Syncing with remote database...");
    db.sync().await.unwrap();
    println!(" done");

    let mut added_note = NoteItem {
        id: "".to_string(),
        title: "".to_string(),
        text: "".to_string(),
        created_at: created_at,
        updated_at: created_at,
    };
    if let Some(row) = response.next().unwrap() {
        added_note = NoteItem {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            text: row.get(2).unwrap(),
            created_at: row.get(3).unwrap(),
            updated_at: row.get(4).unwrap(),
        };
    }

    print!("Syncing with remote database...");
    db.sync().await.unwrap();
    println!(" done");

    format!("New note: {:?}", added_note);

    Ok(added_note)
}

#[tauri::command]
async fn update_note(id: String, new_text: String) -> Result<NoteItem, String> {
    tracing_subscriber::fmt::init();

    info!(id, new_text);

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
            return Err(error.to_string());
        }
    };

    let conn = db.connect().unwrap();

    let updated_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
        Ok(n) => n.as_secs(),
        Err(_) => panic!("SystemTime before UNIX EPOCH!"),
    };

    let params = params!([new_text.to_string(), updated_at.to_string(), id.to_string()]);

    conn.query(
        "UPDATE notes SET text = ?, updated_at = ? WHERE id = ?",
        params,
    )
    .await
    .unwrap();

    let results = conn
        .query("SELECT * from notes WHERE id = ?", params![id.to_string()])
        .await
        .unwrap();

    let mut updated_note;
    while let Some(row) = results.next().unwrap() {
        let updated_note: NoteItem = NoteItem {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            text: row.get(2).unwrap(),
            created_at: row.get(3).unwrap(),
            updated_at: row.get(4).unwrap(),
        };
        info!("  {:?}", updated_note);
        break;
    }

    print!("Syncing with remote database...");
    db.sync().await.unwrap();
    println!(" done");

    format!("Updated note: {:?}", updated_note);

    Ok(updated_note)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_notes,
            new_note,
            update_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
