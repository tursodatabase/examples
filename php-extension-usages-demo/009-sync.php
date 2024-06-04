<?php

$config = [
    "url" => "database.db",
    "syncUrl" => getenv('TURSO_DB_URL'),
    "authToken" => getenv('TURSO_DB_AUTH_TOKEN')
];

$db = new LibSQL($config);

if (!$db) {
    throw new Exception("Database Not Connected!");
}

if ($db->mode === 'remote_replica') {
    $db->sync();
}

$createUsers = <<<STMT
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
);
INSERT INTO users (name, age) VALUES ('Imam Ali Mustofa', 29);
STMT;

$db->executeBatch($createUsers);
$db->close();
