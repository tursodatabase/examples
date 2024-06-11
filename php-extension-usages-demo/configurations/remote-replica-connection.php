<?php

$config = [
    "url" => "file:database.db",
    "syncUrl" => getenv('TURSO_DB_URL'),
    "authToken" => getenv('TURSO_DB_AUTH_TOKEN')
];

$db = new LibSQL($config);
if (!$db) {
    throw new Exception("Database Not Connected!");
}
echo $db->mode . PHP_EOL;
$db->close();
