<?php
header("Access-Control-Allow-Origin: *"); // Allow requests from all origins, or replace * with http://localhost:4200 for specific origin
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Read the input JSON payload
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["message" => "No data received."]);
    exit;
}

// Validate input data
if (empty($data->user_id) || empty($data->date) || empty($data->time)) {
    echo json_encode(["message" => "Incomplete data. Ensure 'user_id', 'date', and 'time' are provided."]);
    exit;
}

// Prepare the query
$query = "INSERT INTO appointments (user_id, date, time) VALUES (:user_id, :date, :time)";
$stmt = $db->prepare($query);

$stmt->bindParam(":user_id", $data->user_id);
$stmt->bindParam(":date", $data->date);
$stmt->bindParam(":time", $data->time);

try {
    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(["message" => "Appointment created successfully."]);
    } else {
        echo json_encode(["message" => "Failed to create appointment due to a database error."]);
    }
} catch (PDOException $e) {
    echo json_encode(["message" => "Database error: " . $e->getMessage()]);
}
?>
