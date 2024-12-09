<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password) && !empty($data->medical_records)) {
    $query = "INSERT INTO users (username, password, medical_records) VALUES (:username, :password, :medical_records)";

    $stmt = $db->prepare($query);

    $stmt->bindParam(":username", $data->username);
    $stmt->bindParam(":password", password_hash($data->password, PASSWORD_BCRYPT));
    $stmt->bindParam(":medical_records", $data->medical_records);

    if ($stmt->execute()) {
        echo json_encode(["message" => "User registered successfully."]);
    } else {
        echo json_encode(["message" => "Unable to register user."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
