<?php
// Allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include database configuration
include_once '../../config/database.php';

try {
    // Create a database connection
    $database = new Database(); // Assuming `Database` is the class in `database.php`
    $conn = $database->getConnection();

    // Check if 'user_id' is provided in the request
    if (isset($_GET['user_id']) && !empty($_GET['user_id'])) {
        $user_id = $_GET['user_id'];

        // Query to fetch appointments for the user
        $query = "SELECT * FROM appointments WHERE user_id = :user_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        // Fetch all appointments as an associative array
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if appointments are found
        if ($appointments) {
            // Return appointments as a JSON response
            echo json_encode(["appointments" => $appointments]);
        } else {
            // No appointments found
            echo json_encode(["appointments" => [], "message" => "No appointments found"]);
        }
    } else {
        // Return error if user_id is not provided
        echo json_encode(["error" => "User ID is required"]);
    }
} catch (Exception $e) {
    // Handle connection or query errors
    echo json_encode(["error" => "Unable to fetch appointments", "details" => $e->getMessage()]);
}
