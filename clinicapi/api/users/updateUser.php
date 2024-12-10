<?php

include_once '../../config/database.php';  // Ensure the path is correct

// Initialize the database connection
$database = new Database();
$pdo = $database->getConnection();

// Get the data from the request (you should be sending this via POST or PUT)
$data = json_decode(file_get_contents("php://input"));

// Check if the data is provided
if (isset($data->id) && isset($data->name) && isset($data->username) && isset($data->contact_number) && isset($data->date_of_birth)) {
    
    // Prepare the UPDATE query
    $query = "UPDATE users SET name = :name, username = :username, contact_number = :contact_number, date_of_birth = :date_of_birth WHERE id = :id";

    $stmt = $pdo->prepare($query);

    // Bind the parameters to the query
    $stmt->bindParam(':name', $data->name);
    $stmt->bindParam(':username', $data->username);
    $stmt->bindParam(':contact_number', $data->contact_number);
    $stmt->bindParam(':date_of_birth', $data->date_of_birth);
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
