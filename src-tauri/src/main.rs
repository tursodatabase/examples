// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy::dotenv;
// use libsql::{params, Database, Error, Rows};
use std::env;
// use crate::error::TauriError;
use serde::{Deserialize, Serialize};

// pub type APIResult<T, E = TauriError> = Result<T, E>;

#[derive(Deserialize, Serialize)]
pub struct NoteItem {
    id: String,
    title: String,
    test: String,
}

#[tauri::command]
fn new_note() -> String {
    dotenvy::from_path("../.env.local");
    // dotenv().expect(".env file not found");

    // The local database path where the data will be stored.
    let _db_path = env::var("DB_PATH").unwrap();

    // The remote sync URL to use.
    let _sync_url = env::var("TURSO_SYNC_URL").unwrap();

    // The authentication token to use.
    let _auth_token = env::var("TURSO_TOKEN").unwrap();

    println!(
        "Here are the env vars: _db_path: {:?}, _auth_token: {:?}, _sync_url: {:?}",
        _db_path, _auth_token, _sync_url
    );

    // let response: Vec<NoteItem> = serde_json::from_str(&response).unwrap();
    // response

    format!("Creating a new note!")
}

#[tauri::command]
fn get_all_notes() -> String {
    format!("getting all notes!")
}

#[tauri::command]
fn update_note(text: &str) -> String {
    format!("Last submission to tauri: [{}]!", text)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            new_note,
            get_all_notes,
            update_note
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
