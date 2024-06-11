<?php

$db = new LibSQL(":memory:");

if (!$db) {
    throw new Exception("Database Not Connected!");
}

$usersTable = <<<STMT
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
);
STMT;

$db->execute($usersTable);

$db->close();
