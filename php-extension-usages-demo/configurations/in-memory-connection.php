<?php

$db = new LibSQL(":memory:");
if (!$db) {
    throw new Exception("Database Not Connected!");
}
$db->close();
