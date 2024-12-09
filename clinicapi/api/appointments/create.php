<?php
header('Access-Control-Allow-Origin: *');


header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');

header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');


header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Handle OPTIONS request (preflight request for CORS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    
}

// Read the input JSON payload
$data = json_decode(file_get_contents("php://input"));

// Check if data is valid
if (!$data) {
    echo json_encode(["message" => "No data received."]);
    
}

// Validate required fields
if (empty($data->user_id) || empty($data->date) || empty($data->time)) {
    echo json_encode(["message" => "Incomplete data. Ensure 'user_id', 'date', and 'time' are provided."]);
   
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
