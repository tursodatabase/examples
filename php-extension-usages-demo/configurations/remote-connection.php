<?php

$url = getenv('TURSO_DB_URL');
$token = getenv('TURSO_DB_AUTH_TOKEN');

$dsn = "libsql:dbname=$url;authToken=$token";
$db = new LibSQL($dsn);
if (!$db) {
    throw new Exception("Database Not Connected!");
}
echo $db->mode . PHP_EOL;
$db->close();
