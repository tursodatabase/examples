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
