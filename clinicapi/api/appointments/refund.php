<?php
// Include the database connection file
include_once '../../config/database.php';

// Instantiate the database connection
$database = new Database();
$conn = $database->getConnection(); // Get the PDO connection

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Get the raw POST data (JSON)
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate the 'appointment_id' parameter
    if (!isset($data['appointment_id']) || empty($data['appointment_id'])) {
        echo json_encode(['success' => false, 'message' => 'Appointment ID is required.']);
        exit;
    }

    // Sanitize the appointment_id to prevent SQL injection
    $appointment_id = htmlspecialchars(strip_tags($data['appointment_id']));

    // Prepare the SQL query to update the status of the appointment
    $query = "UPDATE appointments SET status = 'cancelled', payment_status = 'failed' WHERE id = :appointment_id";
    
    // Prepare the statement
    $stmt = $conn->prepare($query);

    // Bind the parameters
    $stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);

    // Execute the query and check if the update is successful
    if ($stmt->execute()) {
        // Check if any rows were affected, meaning the appointment ID exists
        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Refund processed successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Appointment not found or already processed.']);
        }
    } else {
        // If query fails, output the error
        echo json_encode(['success' => false, 'message' => 'Refund processing failed.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
