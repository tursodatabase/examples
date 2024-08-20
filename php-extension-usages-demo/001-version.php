<?php

$db = new LibSQL(":memory:");

if (!$db) {
    throw new Exception("Database Not Connected!");
}

echo $db->version() . PHP_EOL;
$db->close();
