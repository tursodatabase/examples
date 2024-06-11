<?php

$db = new LibSQL("database.db");
if (!$db) {
    throw new Exception("Database Not Connected!");
}
$db->close();
