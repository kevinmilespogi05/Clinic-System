<?php
// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    http_response_code(200); // OK
    exit; // End the script here for OPTIONS requests
}

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

include_once "../../config/database.php";
include_once "../../models/User.php";

$database = new Database();
$db = $database->getConnection();

$user = new User($db);

// Get raw input data
$data = json_decode(file_get_contents("php://input"));

// Validate input data
if (!empty($data->username) && !empty($data->password) && !empty($data->name) && !empty($data->contact_number) && !empty($data->date_of_birth)) {
    // Sanitize and assign values
    $user->username = htmlspecialchars(strip_tags($data->username));
    $user->password = password_hash(htmlspecialchars(strip_tags($data->password)), PASSWORD_DEFAULT);  // Hashing the password
    $user->name = htmlspecialchars(strip_tags($data->name));
    $user->contact_number = htmlspecialchars(strip_tags($data->contact_number));
    $user->date_of_birth = htmlspecialchars(strip_tags($data->date_of_birth));

    // Attempt to register the user
    if ($user->register()) {
        http_response_code(201); // Created
        echo json_encode(["success" => true, "message" => "User registered successfully!"]);
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(["success" => false, "message" => "User registration failed!"]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "All fields are required."]);
}
?>
