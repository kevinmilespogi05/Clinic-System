<?php

include_once '../../config/database.php';  // Ensure the path is correct

// Initialize the database connection
$database = new Database();
$pdo = $database->getConnection();

// Get the data from the request
$data = json_decode(file_get_contents("php://input"));

// Check if the required fields are provided
if (
    isset($data->id) &&
    isset($data->first_name) &&
    isset($data->last_name) &&
    isset($data->username) &&
    isset($data->contact_number) &&
    isset($data->date_of_birth) &&
    isset($data->medical_history) &&
    isset($data->card_first_name) &&
    isset($data->card_last_name) &&
    isset($data->card_number) &&
    isset($data->card_expiry) &&
    isset($data->card_security_code) &&
    isset($data->billing_address) &&
    isset($data->city) &&
    isset($data->province) &&
    isset($data->billing_postal_code) &&
    isset($data->role)
) {
    // Prepare the UPDATE query
    $query = "UPDATE users 
              SET 
                first_name = :first_name, 
                last_name = :last_name, 
                username = :username, 
                contact_number = :contact_number, 
                date_of_birth = :date_of_birth, 
                medical_history = :medical_history, 
                card_first_name = :card_first_name, 
                card_last_name = :card_last_name, 
                card_number = :card_number, 
                card_expiry = :card_expiry, 
                card_security_code = :card_security_code, 
                billing_address = :billing_address, 
                city = :city, 
                province = :province, 
                billing_postal_code = :billing_postal_code, 
                role = :role
              WHERE id = :id";

    $stmt = $pdo->prepare($query);

    // Bind the parameters to the query
    $stmt->bindParam(':first_name', $data->first_name);
    $stmt->bindParam(':last_name', $data->last_name);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':contact_number', $data->contact_number);
    $stmt->bindParam(':date_of_birth', $data->date_of_birth);
    $stmt->bindParam(':medical_history', $data->medical_history);
    $stmt->bindParam(':card_first_name', $data->card_first_name);
    $stmt->bindParam(':card_last_name', $data->card_last_name);
    $stmt->bindParam(':card_number', $data->card_number);
    $stmt->bindParam(':card_expiry', $data->card_expiry);
    $stmt->bindParam(':card_security_code', $data->card_security_code);
    $stmt->bindParam(':billing_address', $data->billing_address);
    $stmt->bindParam(':city', $data->city);
    $stmt->bindParam(':province', $data->province);
    $stmt->bindParam(':billing_postal_code', $data->billing_postal_code);
    $stmt->bindParam(':role', $data->role);
    $stmt->bindParam(':id', $data->id);

    // Execute the query and check if the update was successful
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
} else {
    // If data is missing, return an error
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
}

?>
