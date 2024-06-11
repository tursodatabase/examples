# Turso/libSQL Native Extension for PHP

Examples of using the methods available in the libSQL Native Extension for PHP.

## Download

Download the latest build extension/driver binary you can see at [Release](https://github.com/tursodatabase/turso-client-php/releases) page. It's available for:
- Linux
- Mac/Darwin
- Windows (still struggle, but you need to try use WSL)

## Installation

- 📦 Extract the archive (2 files, liblibsql and libsql_php_extension.stubs.php)
- 🗃 Locate somewhere in your machine
- 💽 Copy a relative path that address that extension/driver
- 📂 Open `php.ini` search `;extension` if you using nano (ctrl+w) then searching for it
- 📝 add in the next-line `extension=liblibsql_php.so` (in Linux) without `;` at the begining

Check on your console/terminal

```shell
$ php --m | grep libsql
liblibsql_php
```

Now, you can use `LibSQL` class in your PHP code!

## Database Setup

Prepare a turso database for use in remote / remote replica (embedded replica) connection instances.

1. Install [Turso CLI](https://docs.turso.tech/reference/turso-cli#installation)
2. Now signup or login using GitHub:
```shell
# Singup
turso auth signup

# Login
turso auth login

# Singup (WSL)
turso auth signup --headless

# Login (WSL)
turso auth login --headless
```
3. Create a new turso database:
```shell
turso db create turso-php-tutorial
```
> Note: We use `turso-php-tutorial` as the database name in this command, but you can give it any name.
4. To access the data stored inside your database, you need the Turso database url and an authentication token. To obtain the database url, run the following command:
```shell
turso db show turso-php-tutorial --url
```
5. And, to create an authentication token for your database, run:
```shell
turso db tokens create turso-php-tutorial
```
6. Add a `.env` file with the following variables, populating them with the values obtained above.
```env
TURSO_DB_URL=<DB-URL>
TURSO_DB_AUTH_TOKEN=<AUTH-TOKEN>
```

## List of Examples

This is a lists of examples how to use Turso/libSQL PHP Native Extension to configure database connections and use all the methods provide by the extension.

### Configurations

Turso/libSQL have 4 types different connections that let you choose one of them:

**In-Memory Connection**

```php
<?php

$db = new LibSQL(":memory:");
if (!$db) {
    throw new Exception("Database Not Connected!");
}
echo $db->mode . PHP_EOL;
$db->close();
```
Ref: [Sample Code](configurations/in-memory-connection.php) or Run In-Memory Connection:
```shell
php configurations/in-memory-connection.php
```

**Local Connection**
```php
<?php

$db = new LibSQL("database.db");
if (!$db) {
    throw new Exception("Database Not Connected!");
}
echo $db->mode . PHP_EOL;
$db->close();
```
Ref: [Sample Code](configurations/local-connection.php) or Run Local Connection:
```shell
php configurations/local-connection.php
```

**Remote Connection**
```php
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
```
Ref: [Sample Code](configurations/remote-connection.php) or Run Remote Connection:
```shell
php configurations/remote-connection.php
```

**Remote Replica Connection**

Make sure you have already remote database created before using this connection. Turso will create replica in local filesystem.

```php
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
```
Ref: [Sample Code](configurations/remote-replica-connection.php) or Run Remote Replica Connection:
```shell
php configurations/remote-replica-connection.php
```

**Things to know**

- Do not open the local database while the embedded replica is syncing. This can lead to data corruption.
- In certain contexts, such as serverless environments without a filesystem, you can’t use embedded replicas.

---

### Commons

**001 - Get libSQL Driver Version**
```php
<?php

$db = new LibSQL(":memory:");
if (!$db) {
    throw new Exception("Database Not Connected!");
}
echo $db->version() . PHP_EOL;
$db->close();
```
Ref: [Sample Code](001-version.php) or run this sample:
```shell
php 001-version.php
```

---

**002 - Execute Statement**
```php
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
```
Ref: [Sample Code](002-execute.php) or run this sample:
```shell
php 002-execute.php
```

---

**003 - Execute Batch Statements**
```php
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

$db->close();
```
Ref: [Sample Code](003-executeBatch.php) or run this sample:
```shell
php 003-executeBatch.php
```

---

**004 - Get Affected Row**
```php
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

echo $db->changes() . PHP_EOL;

$db->close();
```
Ref: [Sample Code](004-changes.php) or run this sample:
```shell
php 004-changes.php
```

---

**005 - Query Database**
```php
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

$getAllUsers = $db->query("SELECT * FROM users");
foreach ($getAllUsers['rows'] as $user) {
    echo "- Name: " . $user['name'] . " - Age: " . $user['age'] . PHP_EOL;
}

$db->close();
```
Ref: [Sample Code](005-query.php) or run this sample:
```shell
php 005-query.php
```

---

**006 - Prepare Query**
```php
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
```
Ref: [Sample Code](006-prepare.php) or run this sample:
```shell
php 006-prepare.php
```

---

**007 - Create Transaction**
```php
<?php

$db = new LibSQL(":memory:");

if (!$db) {
    throw new Exception("Database Not Connected!");
}

$dataCreation = <<<STMT
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY,
    name TEXT,
    balance REAL
);
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    from_account_id INTEGER,
    to_account_id INTEGER,
    amount REAL,
    timestamp DATETIME,
    FOREIGN KEY (from_account_id) REFERENCES accounts(id),
    FOREIGN KEY (to_account_id) REFERENCES accounts(id)
);
INSERT INTO accounts (name, balance) VALUES ('Alice', 1000.0);
INSERT INTO accounts (name, balance) VALUES ('Bob', 1000.0);
STMT;
$db->executeBatch($dataCreation);

function performTransaction(LibSQL $db, int $fromAccountId, int $toAccountId, float $amount)
{
    try {
        $tx = $db->transaction();

        $stmt = $db->prepare("SELECT balance FROM accounts WHERE id = ?");
        $senderBalance = $stmt->query([$fromAccountId]);

        if (empty($senderBalance['rows'])) {
            throw new Exception("Sender account not found!");
        }

        if ($senderBalance['rows'][0]['balance'] < $amount) {
            throw new Exception("Insufficient funds!");
        }

        $stmt = $db->prepare("UPDATE accounts SET balance = balance - ? WHERE id = ?");
        $stmt->execute([$amount, $fromAccountId]);

        $stmt = $db->prepare("UPDATE accounts SET balance = balance + ? WHERE id = ?");
        $stmt->execute([$amount, $toAccountId]);

        $stmt = $db->prepare("INSERT INTO transactions (from_account_id, to_account_id, amount, timestamp) VALUES (?, ?, ?, ?)");
        $stmt->execute([$fromAccountId, $toAccountId, $amount, date('Y-m-d H:i:s')]);

        $tx->commit();

        echo "Transaction successful!" . PHP_EOL;
    } catch (Exception $e) {
        $tx->rollBack();
        echo "Transaction failed: " . $e->getMessage() . PHP_EOL;
    }
}

echo "Simulating a successful transaction: ";
performTransaction($db, 1, 2, 100.0);

echo "Simulating an unsuccessful transaction: ";
performTransaction($db, 1, 2, 10000.0);

$db->close();
```
Ref: [Sample Code](007-transaction.php) or run this sample:
```shell
php 007-transaction.php
```

---

**008 - Close Database Connection**
```php
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

$getAllUsers = $db->query("SELECT * FROM users");
foreach ($getAllUsers['rows'] as $user) {
    echo "- Name: " . $user['name'] . " - Age: " . $user['age'] . PHP_EOL;
}
$db->close(); // <- Database is closed!

// Error Expect
$getAllUsers = $db->query("SELECT * FROM users");
foreach ($getAllUsers['rows'] as $user) {
    echo "- Name: " . $user['name'] . " - Age: " . $user['age'] . PHP_EOL;
}
```
Ref: [Sample Code](008-close.php) or run this sample:
```shell
php 008-close.php
```

---

**009 - Close Database Connection**
```php
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
```
Ref: [Sample Code](009-sync.php) or run this sample:
```shell
php 009-sync.php
```
