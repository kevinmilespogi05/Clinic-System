<?php
// Include database configuration
require_once '../../config/database.php';

// Create a new instance of the Database class
$database = new Database();

// Get the PDO connection
$pdo = $database->getConnection();

// Ensure the connection is established
if ($pdo == null) {
    die(json_encode(["error" => "Database connection failed."]));
}

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"));

// Check if the required fields are present in the data
if (
    !isset($data->user_id) ||
    !isset($data->appointment_id) ||
    !isset($data->amount) ||
    !isset($data->payment_method)
) {
    echo json_encode(["error" => "Missing required payment information"]);
    exit;
}

// Get payment details from the request
$user_id = $data->user_id;
$appointment_id = $data->appointment_id;
$amount = $data->amount;
$payment_method = $data->payment_method;

// Ensure the amount is a valid number (you can adjust this check as per your requirements)
if (!is_numeric($amount) || $amount <= 0) {
    echo json_encode(["error" => "Invalid amount"]);
    exit;
}

// Simulate payment processing (In a real-world scenario, you would integrate a payment gateway here)
$payment_status = "success"; // This would be updated after actual payment processing logic

// If payment was successful, update the appointment status
if ($payment_status === "success") {
    try {
        // Start a transaction to ensure data consistency
        $pdo->beginTransaction();

        // Update the appointment status to 'paid'
        $query = "UPDATE appointments SET status = 'paid' WHERE id = :appointment_id";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(":appointment_id", $appointment_id);

        if (!$stmt->execute()) {
            throw new Exception("Failed to update appointment status.");
        }

        // Insert payment record (optional, for tracking payments)
        $payment_query = "INSERT INTO payments (user_id, appointment_id, amount, payment_method, status) VALUES (:user_id, :appointment_id, :amount, :payment_method, :payment_status)";
        $payment_stmt = $pdo->prepare($payment_query);
        $payment_stmt->bindParam(":user_id", $user_id);
        $payment_stmt->bindParam(":appointment_id", $appointment_id);
        $payment_stmt->bindParam(":amount", $amount);
        $payment_stmt->bindParam(":payment_method", $payment_method);
        $payment_stmt->bindParam(":payment_status", $payment_status);

        if (!$payment_stmt->execute()) {
            throw new Exception("Failed to record payment details.");
        }

        // Commit the transaction
        $pdo->commit();

        // Return success response
        echo json_encode(["success" => "Payment processed successfully and appointment confirmed."]);
    } catch (Exception $e) {
        // Rollback the transaction in case of an error
        $pdo->rollBack();
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Payment failed."]);
}
?>
