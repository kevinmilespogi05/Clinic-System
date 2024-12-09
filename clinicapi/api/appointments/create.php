<?php
header("Access-Control-Allow-Origin: http://localhost:4200"); // Allow requests from your Angular app
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT"); // Allow specific methods
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle OPTIONS request (preflight request for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Read the input JSON payload
$data = json_decode(file_get_contents("php://input"));

// Check if data is valid
if (!$data) {
    echo json_encode(["message" => "No data received."]);
    exit;
}

// Validate required fields
if (empty($data->user_id) || empty($data->date) || empty($data->time)) {
    echo json_encode(["message" => "Incomplete data. Ensure 'user_id', 'date', and 'time' are provided."]);
    exit;
}

// Prepare the query
$query = "INSERT INTO appointments (user_id, date, time) VALUES (:user_id, :date, :time)";
$stmt = $db->prepare($query);

// Bind the parameters
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
    // Log error details to PHP error log
    error_log("Database error: " . $e->getMessage());

    // Provide a generic error message to the client
    echo json_encode(["message" => "An error occurred while processing your request."]);
}
?>
