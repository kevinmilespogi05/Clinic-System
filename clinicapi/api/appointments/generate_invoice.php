<?php
// Include database connection
include_once '../../config/database.php';

header('Content-Type: application/json');

// Create a new instance of the Database class
$database = new Database();
$conn = $database->getConnection(); // Use the getConnection method

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

// Retrieve the request data
$data = json_decode(file_get_contents("php://input"), true);

if (is_null($data) || !isset($data['appointment_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid request. Appointment ID is required."]);
    exit();
}

$appointment_id = $data['appointment_id'];

// Fetch appointment details
$query = "SELECT * FROM appointments WHERE id = :appointment_id";
$stmt = $conn->prepare($query);
$stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    echo json_encode(["success" => false, "message" => "Appointment not found."]);
    exit();
}

$appointment = $stmt->fetch(PDO::FETCH_ASSOC);
$user_id = $appointment['user_id'];
$description = "Service: " . $appointment['service'] . ", Description: " . $appointment['description'];
$bill_amount = $appointment['bill_amount'];

// Insert invoice into the invoices table
$insertQuery = "INSERT INTO invoices (user_id, description, status, created_at) VALUES (:user_id, :description, 'unpaid', NOW())";
$insertStmt = $conn->prepare($insertQuery);
$insertStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$insertStmt->bindParam(':description', $description, PDO::PARAM_STR);

if ($insertStmt->execute()) {
    $invoice_id = $conn->lastInsertId();
    echo json_encode(["success" => true, "message" => "Invoice generated successfully.", "invoice_id" => $invoice_id]);
} else {
    echo json_encode(["success" => false, "message" => "Failed to generate invoice."]);
}
?>
