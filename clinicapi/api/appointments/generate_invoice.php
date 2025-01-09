<?php
// Include database connection
include_once '../../config/database.php';

header('Content-Type: application/json');

$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit();
}

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

// Check if an invoice already exists for this appointment
$checkInvoiceQuery = "SELECT id FROM invoices WHERE user_id = :user_id AND description = :description LIMIT 1";
$checkInvoiceStmt = $conn->prepare($checkInvoiceQuery);
$checkInvoiceStmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
$checkInvoiceStmt->bindParam(':description', $description, PDO::PARAM_STR);
$checkInvoiceStmt->execute();

if ($checkInvoiceStmt->rowCount() > 0) {
    echo json_encode(["success" => false, "message" => "Invoice already exists for this appointment."]);
    exit();
}

// Insert a new invoice if no existing invoice is found
$insertQuery = "INSERT INTO invoices (user_id, description, created_at) VALUES (:user_id, :description, NOW())";
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
