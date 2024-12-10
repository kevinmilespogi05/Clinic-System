<?php
// Include database connection
require_once '../../config/database.php';

// Set headers for JSON response and allow CORS (optional)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Instantiate the Database and get a connection
$database = new Database();
$pdo = $database->getConnection();

// Check if the 'user_id' parameter is provided in the request
if (isset($_GET['id'])) { // Use 'id' instead of 'user_id' for consistency with Angular query params
    $userId = $_GET['id'];

    try {
        // Prepare the SQL query to fetch the user's profile
        $stmt = $pdo->prepare("SELECT id, name, username, contact_number, date_of_birth, medical_history FROM users WHERE id = :user_id");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch the user's profile data
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Return the user's profile as a JSON response
            echo json_encode(['success' => true, 'data' => $user]);
        } else {
            // User not found
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
    } catch (Exception $e) {
        // Handle any errors
        echo json_encode(['success' => false, 'message' => 'An error occurred.', 'error' => $e->getMessage()]);
    }
} else {
    // Missing 'user_id' parameter
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
}
?>
