<!-- https://test-traffic-devils.local/checkdb.php -->
<?php
require 'database.php';

try {
    $stmt = $pdo->query("SELECT * FROM users");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    $stmt = $pdo->query("SELECT * FROM messages");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC); 
    if (empty($users)) {
        echo "Нет данных в таблице users! <br>";
    } else {
        echo "Данные из таблицы users:<br>";
        foreach ($users as $user) {
            echo "ID: " . $user['id'] . 
            " | Name: " . $user['first_name'] . " " . $user['last_name'] . 
            " | Email: " . $user['email'] . 
            " | Phone: " . $user['phone'] . 
            " | Created at: " . $user["created_at"] . "<br>";
        }
    }

    if (empty($messages)) {
        echo "Нет данных в таблице messages!";
    } else {
        echo "Данные из таблицы messages:<br>";
        foreach ($messages as $message) {
            echo "ID: " . $message['id'] . 
            " | User ID: " . $message['user_id'] . 
            " | Service: " . $message['service'] . 
            " | Price: " . $message['price'] . 
            " | Comments: " . $message['comments'] . 
            " | Created at: " . $message['created_at'] . "<br>";
        }
    }
} catch (PDOException $e) {
    echo "Ошибка при получении данных: " . $e->getMessage();
}
