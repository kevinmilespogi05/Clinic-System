<?php

header("Access-Control-Allow-Origin: http://localhost:4200"); // Allow requests only from Angular
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


include_once '../../config/database.php';

$database = new Database();
$pdo = $database->getConnection();

try {
    $query = "SELECT * FROM users"; // Replace 'users' with your table name
    $stmt = $pdo->prepare($query);
    $stmt->execute();

    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $users
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
