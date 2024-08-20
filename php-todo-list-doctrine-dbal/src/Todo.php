<?php

namespace Turso\Todo\CLI;

use Doctrine\DBAL\Connection;

class Todo
{

    private Connection $db;

    public function __construct()
    {
        $this->db = createConnection();
    }

    public function loadTodos(): array
    {
        $sql = "SELECT * FROM todos";
        return $this->db->fetchAllAssociative($sql);
    }

    public function saveTodo(string $todo): void
    {
        $sql = "INSERT INTO todos (name) VALUES (?)";
        $this->db->executeStatement($sql, [$todo]);
    }

    public function updateTodo(int $id, string $todo): void
    {
        $sql = "UPDATE todos SET name = ? WHERE id = ?";
        $this->db->executeStatement($sql, [$todo, $id]);
    }

    public function removeTodo(int $id): void
    {
        $sql = "DELETE FROM todos WHERE id = ?";
        $this->db->executeStatement($sql, [$id]);
    }

    public function listTodos()
    {
        $todos = $this->loadTodos();
        echo "\n" . "TODO-List   " . str_repeat('-', WIDTH - 12) . "\n\n";
        if (!empty($todos)) {
            foreach ($todos as $todo) {
                echo sprintf("[%d] %s\n", $todo['id'], $todo['name']);
            }
        } else {
            echo "Nothing...\n";
        }
        echo "\n" . str_repeat('-', WIDTH) . "\n";
    }

    public function addTodo()
    {
        echo "Enter the new To-Do: ";
        $todo = trim(fgets(STDIN));
        $this->saveTodo($todo);
        echo "To-Do added.\n";
    }

    public function editTodo()
    {
        $this->listTodos();
        echo "Enter the number of the To-Do to edit: ";
        $index = intval(trim(fgets(STDIN)));

        $findTodo = $this->db->executeQuery("SELECT * FROM todos WHERE id = ?", [$index])->fetchAssociative();

        if (!empty($findTodo)) {
            echo "Enter the new value: ";
            $todo = trim(fgets(STDIN));
            $this->updateTodo($findTodo['id'], $todo);
            echo "To-Do updated.\n";
        } else {
            echo "Invalid index.\n";
        }
    }

    public function deleteTodo()
    {
        $this->listTodos();
        echo "Enter the number of the To-Do to delete: ";
        $index = intval(trim(fgets(STDIN)));
        $findTodo = $this->db->executeQuery("SELECT * FROM todos WHERE id = ?", [$index])->fetchAssociative();
        if (!empty($findTodo)) {
            $this->removeTodo($findTodo['id']);
            echo "To-Do deleted.\n";
        } else {
            echo "Invalid index.\n";
        }
    }
}
