<?php
include_once '../../config/database.php';

// Allow cross-origin requests from your Angular app
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Check if necessary data is provided
if (!empty($data->user_id) && !empty($data->first_name) && !empty($data->last_name) && !empty($data->contact_number) && !empty($data->date_of_birth)) {
    $query = "UPDATE users SET 
        first_name = :first_name, 
        last_name = :last_name, 
        contact_number = :contact_number, 
        date_of_birth = :date_of_birth,
        medical_history = :medical_history,
        card_first_name = :card_first_name,
        card_last_name = :card_last_name,
        card_number = :card_number,
        card_expiry = :card_expiry,
        card_security_code = :card_security_code,
        billing_address = :billing_address,
        billing_city = :billing_city,
        billing_state = :billing_state,
        billing_postal_code = :billing_postal_code
        WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":first_name", $data->first_name);
    $stmt->bindParam(":last_name", $data->last_name);
    $stmt->bindParam(":contact_number", $data->contact_number);
    $stmt->bindParam(":date_of_birth", $data->date_of_birth);
    $stmt->bindParam(":medical_history", $data->medical_history);
    $stmt->bindParam(":card_first_name", $data->card_first_name);
    $stmt->bindParam(":card_last_name", $data->card_last_name);
    $stmt->bindParam(":card_number", $data->card_number);
    $stmt->bindParam(":card_expiry", $data->card_expiry);
    $stmt->bindParam(":card_security_code", $data->card_security_code);
    $stmt->bindParam(":billing_address", $data->billing_address);
    $stmt->bindParam(":billing_city", $data->billing_city);
    $stmt->bindParam(":billing_state", $data->billing_state);
    $stmt->bindParam(":billing_postal_code", $data->billing_postal_code);
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
