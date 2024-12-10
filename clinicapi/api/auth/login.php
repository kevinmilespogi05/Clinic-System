<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    // Prepare the query to check if the username exists
    $query = "SELECT id, password, role FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Verify the password
        if (password_verify($data->password, $row['password'])) {
            // Password is correct, return login success with user id and role
            echo json_encode([
                "message" => "Login successful.",
                "user_id" => $row['id'],
                "role" => $row['role']
            ]);
        } else {
            // Password is incorrect
            echo json_encode(["message" => "Invalid username or password."]);
        }
    } else {
        // Username does not exist
        echo json_encode(["message" => "Invalid username or password."]);
    }
} else {
    // Missing username or password
    echo json_encode(["message" => "Incomplete data."]);
}
