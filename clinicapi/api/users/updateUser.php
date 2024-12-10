<?php

include_once '../../config/database.php';  // Ensure the path is correct

// Initialize the database connection
$database = new Database();
$pdo = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id, $data->name, $data->username)) {
    $id = $data->id;
    $name = $data->name;
    $username = $data->username;

    // Prepare the update query
    $query = "UPDATE users SET name = :name, username = :username WHERE id = :id";
    $stmt = $pdo->prepare($query);
    
    $stmt->bindParam(':name', $name);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':id', $id);

    // Execute the query and return response
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update user']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid data']);
}
?>
