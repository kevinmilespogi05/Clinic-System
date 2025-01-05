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

// Database connection
$database = new Database();
$db = $database->getConnection();

// Get raw input data
$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->username) || 
    empty($data->password) || 
    empty($data->first_name) || 
    empty($data->last_name) || 
    empty($data->contact_number) || 
    empty($data->date_of_birth) || 
    empty($data->medical_history) || 
    empty($data->card_first_name) || 
    empty($data->card_last_name) || 
    empty($data->card_number) || 
    empty($data->card_expiry) || 
    empty($data->card_security_code) || 
    empty($data->billing_address) || 
    empty($data->city) || 
    empty($data->province) || 
    empty($data->billing_postal_code)
) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "All fields are required."]);
    exit;
}

// Hash the password
$hashed_password = password_hash($data->password, PASSWORD_BCRYPT);

// SQL query to insert a new user
$query = "INSERT INTO users (
    first_name, last_name, username, password, contact_number, date_of_birth, medical_history,
    card_first_name, card_last_name, card_number, card_expiry, card_security_code,
    billing_address, city, province, billing_postal_code
) VALUES (
    :first_name, :last_name, :username, :password, :contact_number, :date_of_birth, :medical_history,
    :card_first_name, :card_last_name, :card_number, :card_expiry, :card_security_code,
    :billing_address, :city, :province, :billing_postal_code
)";

// Prepare the statement
$stmt = $db->prepare($query);

// Bind the parameters
$stmt->bindParam(":first_name", $data->first_name);
$stmt->bindParam(":last_name", $data->last_name);
$stmt->bindParam(":username", $data->username);
$stmt->bindParam(":password", $hashed_password);  // Bind the hashed password
$stmt->bindParam(":contact_number", $data->contact_number);
$stmt->bindParam(":date_of_birth", $data->date_of_birth);
$stmt->bindParam(":medical_history", $data->medical_history);
$stmt->bindParam(":card_first_name", $data->card_first_name);
$stmt->bindParam(":card_last_name", $data->card_last_name);
$stmt->bindParam(":card_number", $data->card_number);
$stmt->bindParam(":card_expiry", $data->card_expiry);
$stmt->bindParam(":card_security_code", $data->card_security_code);
$stmt->bindParam(":billing_address", $data->billing_address);
$stmt->bindParam(":city", $data->city);
$stmt->bindParam(":province", $data->province);
$stmt->bindParam(":billing_postal_code", $data->billing_postal_code);

if ($stmt->execute()) {
    http_response_code(201); // Created
    echo json_encode(["message" => "User registered successfully."]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to register user."]);
}
?>
