<?php
require_once '../../config/database.php';
$database = new Database();
$pdo = $database->getConnection();

if ($pdo == null) {
    die(json_encode(["error" => "Database connection failed."]));
}

$data = json_decode(file_get_contents("php://input"));

if (
    !isset($data->user_id) ||
    !isset($data->appointment_id) ||
    !isset($data->amount) ||
    !isset($data->payment_method)
) {
    echo json_encode(["error" => "Missing required payment information"]);
    exit;
}

$user_id = $data->user_id;
$appointment_id = $data->appointment_id;
$amount = $data->amount;
$payment_method = $data->payment_method;

if (!is_numeric($amount) || $amount <= 0) {
    echo json_encode(["error" => "Invalid amount"]);
    exit;
}

// Simulating a successful payment status for the sake of example.
$payment_status = "paid"; // This should be set based on actual payment gateway response

try {
    $pdo->beginTransaction();

    // Step 1: Update the appointment's payment status only if payment is successful
    $appointment_query = "UPDATE appointments SET payment_status = :payment_status WHERE id = :appointment_id";
    $stmt = $pdo->prepare($appointment_query);
    $stmt->bindParam(":payment_status", $payment_status);
    $stmt->bindParam(":appointment_id", $appointment_id);

    if (!$stmt->execute()) {
        throw new Exception("Failed to update appointment payment status.");
    }

    // Step 2: Insert the payment details into the payments table
    $payment_query = "INSERT INTO payments (user_id, appointment_id, amount, payment_method, status) 
                      VALUES (:user_id, :appointment_id, :amount, :payment_method, :payment_status)";
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
    echo json_encode(["success" => "Payment processed successfully and payment status updated."]);
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}
?>
