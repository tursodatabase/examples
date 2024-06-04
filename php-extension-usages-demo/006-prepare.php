<?php

$db = new LibSQL(":memory:");

if (!$db) {
    throw new Exception("Database Not Connected!");
}

$createUsers = <<<STMT
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    age INTEGER
);
INSERT INTO users (name, age) VALUES ('Bilal Ali Maftullah', 21);
INSERT INTO users (name, age) VALUES ('Lisa Nur Amelia', 22);
STMT;

$db->executeBatch($createUsers);

$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$user = $stmt->query([2]);
if (empty($user['rows'])) {
    echo "User not found!" . PHP_EOL;
    exit(1);
}
var_dump($user);

$db->close();
