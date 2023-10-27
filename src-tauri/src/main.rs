// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
use libsql::{params, Database};
use serde::{Deserialize, Serialize};
use std::env;

use std::time::SystemTime;
use std::time::UNIX_EPOCH;

use tracing::info;
use uuid::Uuid;

#[derive(Serialize, Debug)]
struct Error {
    msg: String,
}

type Result<T> = std::result::Result<T, Error>;

impl<T> From<T> for Error
    where T: std::error::Error,
{
    fn from(value: T) -> Self {
        Self {
            msg: value.to_string(),
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NoteItem {
    id: String,
    title: String,
    text: String,
    created_at: u64,
    updated_at: u64,
}

#[tauri::command]
async fn get_all_notes() -> Result<Vec<NoteItem>> {
    dotenv().expect(".env file not found");

    let db_path = env::var("DB_PATH").unwrap();
    let sync_url = env::var("TURSO_SYNC_URL").unwrap();
    let auth_token = env::var("TURSO_TOKEN").unwrap();

    println!(
        "Here are the env vars: db_path: {:?}, auth_token: {:?}, _syncrl: {:?}",
        db_path, auth_token, sync_url
    );

    let db = Database::open_with_remote_sync(db_path, sync_url, auth_token).await?;

    let conn = db.connect()?;

    print!("Syncing with remote database...");
    db.sync().await.unwrap();
    println!(" done");

    let mut results = conn.query("SELECT * FROM notes", ()).await?;

    println!("Note entries:");

    let mut notes: Vec<NoteItem> = Vec::new();
    while let Some(row) = results.next()? {
        let note: NoteItem = NoteItem {
            id: row.get(0)?,
            title: row.get(1)?,
            text: row.get(2)?,
            created_at: row.get(3)?,
            updated_at: row.get(4)?,
        };
        info!("  {:?}", note);
        notes.push(note);
    }

    info!("All notes: {:?}", notes);
    Ok(notes)
}

#[tauri::command]
async fn new_note() -> Result<Option<NoteItem>> {
        dotenv().expect(".env file not found");

        let db_path = env::var("DB_PATH").unwrap();
        let sync_url = env::var("TURSO_SYNC_URL").unwrap();
        let auth_token = env::var("TURSO_TOKEN").unwrap();

        println!(
            "Here are the env vars: _db_path: {:?}, _auth_token: {:?}, _sync_url: {:?}",
            db_path, auth_token, sync_url
        );

        let db = Database::open_with_remote_sync(db_path, sync_url, auth_token).await?;

        let conn = db.connect()?;

        let id = Uuid::new_v4();
        let created_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(n) => n.as_secs(),
            Err(_) => panic!("SystemTime before UNIX EPOCH!"),
        };
        let title = String::from("New note..");

        let params = params![id.to_string(), title, created_at];

        let mut response = conn
            .query(
                "INSERT INTO notes (id, title, created_at) VALUES (?, ?, ?)",
                params,
            )
            .await?;

        print!("Syncing with remote database...");
        db.sync().await?;
        println!(" done");

        let ret = match response.next()? {
            Some(row) => {
                Some(NoteItem {
                    id: row.get(0).unwrap(),
                    title: row.get(1).unwrap(),
                    text: row.get(2).unwrap(),
                    created_at: row.get(3).unwrap(),
                    updated_at: row.get(4).unwrap(),
                })
            }
            None => None,
        };

        print!("Syncing with remote database...");
        db.sync().await?;
        println!(" done");

        format!("New note: {ret:?}");

        Ok(ret)
}

#[tauri::command]
async fn update_note(id: String, new_text: String) -> Result<NoteItem> {
        info!(id, new_text);

        dotenv().expect(".env file not found");

        let db_path = env::var("DB_PATH").unwrap();
        let sync_url = env::var("TURSO_SYNC_URL").unwrap();
        let auth_token = env::var("TURSO_TOKEN").unwrap();

        println!(
            "Here are the env vars: db_path: {:?}, auth_token: {:?}, _syncrl: {:?}",
            db_path, auth_token, sync_url
        );

        let db = Database::open_with_remote_sync(db_path, sync_url, auth_token).await?; 

        let conn = db.connect()?;

        let updated_at = match SystemTime::now().duration_since(UNIX_EPOCH) {
            Ok(n) => n.as_secs(),
            Err(_) => panic!("SystemTime before UNIX EPOCH!"),
        };

        let params = params!(new_text, updated_at, id.clone());

        conn.query(
            "UPDATE notes SET text = ?, updated_at = ? WHERE id = ?",
            params,
        )
            .await?;

        let mut results = conn
            .query("SELECT * from notes WHERE id = ?", params![id.to_string()])
            .await?;

        let row = results.next()?.unwrap();
        let updated_note: NoteItem = NoteItem {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            text: row.get(2).unwrap(),
            created_at: row.get(3).unwrap(),
            updated_at: row.get(4).unwrap(),
        };
        info!("  {:?}", updated_note);

        print!("Syncing with remote database...");
        db.sync().await?;
        println!(" done");

        format!("Updated note: {updated_note:?}");

        Ok(updated_note)
}

fn main() {
    tracing_subscriber::fmt::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_all_notes,
            new_note,
            update_note,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
