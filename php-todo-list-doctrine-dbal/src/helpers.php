<?php

use Doctrine\DBAL\Connection;
use Doctrine\DBAL\DriverManager;

const WIDTH = 113;
const VERSION = '1.0.0';

function clearScreen()
{
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        system('cls');
    } else {
        system('clear');
    }
}

function createConnection(): Connection
{
    $params = [
        "auth_token"        => getenv('TURSO_AUTH_TOKEN'),
        "sync_url"          => getenv('TURSO_DATABASE_URL'),
        'driverClass'       => \Turso\Doctrine\DBAL\Driver::class,
    ];

    $db = DriverManager::getConnection($params);
    
    return $db;
}