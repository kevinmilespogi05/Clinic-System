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
    exit();
}

// Validate required fields
if (empty($data->id) || empty($data->date) || empty($data->time)) {
    echo json_encode(["message" => "Incomplete data. Ensure 'id', 'date', and 'time' are provided."]);
    exit();
}

// Prepare a query to fetch the user name from the users table
$query = "SELECT name FROM users WHERE id = :id";
$stmt = $db->prepare($query);
$stmt->bindParam(":id", $data->id);
$stmt->execute();

// Fetch the user name
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user) {
    echo json_encode(["message" => "User not found."]);
    exit();
}

$userName = $user['name'];

// Prepare the query to insert into appointments table
$query = "INSERT INTO appointments (user_id, date, time, description, name) 
          VALUES (:id, :date, :time, :description, :name)";
$stmt = $db->prepare($query);

// Bind the parameters
$stmt->bindParam(":id", $data->id);
$stmt->bindParam(":date", $data->date);
$stmt->bindParam(":time", $data->time);
$stmt->bindParam(":description", $data->description);
$stmt->bindParam(":name", $userName); // Bind name parameter

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
