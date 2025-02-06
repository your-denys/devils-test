<?php
header('Content-Type: application/json');
require 'database.php';

function logRequest($data, $response)
{
    $logFile = 'request_log.txt';
    $logMessage = '[' . date('Y-m-d H:i:s') . '] - ' . json_encode([
        'request' => $data,
        'response' => $response
    ], JSON_UNESCAPED_UNICODE) . "\n";

    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

function getGeoData(string $ip): array
{
    $url = "http://ipinfo.io/{$ip}/json";
    $geoData = @file_get_contents($url);
    return $geoData ? json_decode($geoData, true) : ['error' => 'Не удалось получить данные'];
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $email = trim(string: $_POST['email']);
    $phone = trim($_POST['phone']);
    $select_service = trim($_POST['select_service']);
    $select_price = trim($_POST['select_price']);
    $comments = isset($_POST['comments']) ? trim($_POST['comments']) : null;


    if (empty($first_name) || empty($last_name)) {
        $response = ['success' => false, 'message' => 'Имя и фамилия обязательны'];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response = ['success' => false, 'message' => 'Неверный email'];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    if (!preg_match('/^\+?[0-9]{10,15}$/', $phone)) {
        $response = ['success' => false, 'message' => 'Неверный номер телефона'];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    if ($select_service === 'selecttime') {
        $response = ['success' => false, 'message' => 'Пожалуйста, выберите услугу'];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    if (empty($select_price)) {
        $response = ['success' => false, 'message' => 'Пожалуйста, выберите ценовой диапазон'];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("INSERT INTO users (first_name, last_name, email, phone) 
        VALUES (?, ?, ?, ?) 
        ON CONFLICT(email) DO UPDATE SET phone=excluded.phone RETURNING id");
        $stmt->execute([$first_name, $last_name, $email, $phone]);
        $user_id = $stmt->fetchColumn();

        $stmt = $pdo->prepare("INSERT INTO messages (user_id, service, price, comments) VALUES (?, ?, ?, ?)");
        $stmt->execute([$user_id, $select_service, $select_price, $comments]);

        $pdo->commit();
    } catch (PDOException $e) {
        $pdo->rollBack();
        $response = ['success' => false, 'message' => 'Ошибка при сохранении: ' . $e->getMessage()];
        logRequest($_POST, $response);
        echo json_encode($response);
        exit;
    }

    $response = [
        'success' => true,
        'message' => 'Спасибо за вашу заявку! Мы скоро с вами свяжемся.',
        'geo_data' => getGeoData($_SERVER['REMOTE_ADDR'])
    ];

    logRequest($_POST, $response);
    echo json_encode($response);
}

