<?php

include_once '../../config/database.php';  // Ensure the path is correct

// Initialize the database connection
$database = new Database();
$pdo = $database->getConnection();

// Query to fetch users (excluding 'admin' role, as per previous logic)
$query = "SELECT id, name, username, contact_number, date_of_birth FROM users WHERE username != 'admin'";

$stmt = $pdo->prepare($query);
$stmt->execute();

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

if ($users) {
    // Return users in JSON format
    echo json_encode(['success' => true, 'data' => $users]);
} else {
    // No users found
    echo json_encode(['success' => false, 'message' => 'No users found']);
}

?>
