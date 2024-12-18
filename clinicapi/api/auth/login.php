<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    $query = "SELECT id, password, role, first_name FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        if (password_verify($data->password, $row['password'])) {
            echo json_encode([
                "message" => "Login successful.",
                "user_id" => $row['id'],
                "role" => $row['role'],
                "first_name" => $row['first_name'] // Include the first name
            ]);
        } else {
            echo json_encode(["message" => "Invalid username or password."]);
        }
    } else {
        echo json_encode(["message" => "Invalid username or password."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
