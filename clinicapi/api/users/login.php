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
if (!empty($data->username) && !empty($data->password)) {
    // Sanitize inputs
    $user->username = htmlspecialchars(strip_tags($data->username));
    $user->password = htmlspecialchars(strip_tags($data->password));

    // Attempt to login the user
    if ($user->login()) {
        http_response_code(200); // OK
        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "user" => [
                "id" => $user->id,
                "username" => $user->username,
                "name" => $user->name,
                "contact_number" => $user->contact_number,
                "date_of_birth" => $user->date_of_birth
            ]
        ]);
    } else {
        // If login fails
        http_response_code(401); // Unauthorized
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    }
} else {
    http_response_code(400); // Bad Request
    echo json_encode(["success" => false, "message" => "Username and password are required."]);
}
?>
