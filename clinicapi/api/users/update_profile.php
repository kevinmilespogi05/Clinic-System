<?php

include_once '../../config/database.php';

// Allow cross-origin requests from your Angular app
header("Access-Control-Allow-Origin: http://localhost:4200"); // Replace with your frontend URL if different
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Check if the request method is OPTIONS (pre-flight request) and respond with 200
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->name) && !empty($data->contact_number) && !empty($data->date_of_birth)) {
    $query = "UPDATE users SET 
        name = :name, 
        contact_number = :contact_number, 
        date_of_birth = :date_of_birth 
        WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":contact_number", $data->contact_number);
    $stmt->bindParam(":date_of_birth", $data->date_of_birth);
    $stmt->bindParam(":user_id", $data->user_id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Profile updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update profile."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data."]);
}
?>
