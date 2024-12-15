<?php
// Allow CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, OPTIONS"); // Allow PUT
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection
require_once '../../config/database.php';

// Connect to the database using the correct method
$database = new Database();
$db = $database->getConnection();

// Set response header to JSON
header("Content-Type: application/json");

// Check for PUT method
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get JSON input
    $data = json_decode(file_get_contents("php://input"), true);

    // Check for required fields
    if (isset($data['id']) && isset($data['status'])) {
        $id = $data['id']; // Invoice ID
        $status = $data['status']; // e.g., 'paid' or 'unpaid'

        // Update query
        $query = "UPDATE invoices SET status = :status, updated_at = NOW() WHERE id = :id";
        $stmt = $db->prepare($query);

        // Bind parameters
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':status', $status);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Payment status updated successfully."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Failed to update payment status."
            ]);
        }
    } else {
        // Missing fields
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid input. 'id' and 'status' are required."
        ]);
    }
} else {
    // Invalid request method
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method Not Allowed. Use PUT."
    ]);
}

// Validate the status field
if (!in_array($status, ['paid', 'unpaid'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid status. Accepted values are 'paid' or 'unpaid'."
    ]);
    exit();
}

?>
