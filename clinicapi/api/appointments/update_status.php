<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

try {
    if (isset($data->appointment_id) && isset($data->payment_status)) {
        $appointment_id = $data->appointment_id;
        $payment_status = $data->payment_status;

        // Update payment status in the appointments table
        $query = "UPDATE appointments SET payment_status = :payment_status WHERE id = :appointment_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':payment_status', $payment_status);
        $stmt->bindParam(':appointment_id', $appointment_id);

        if ($stmt->execute()) {
            // If payment status is 'Paid', generate invoice
            if ($payment_status === 'paid') {
                $invoice_query = "SELECT * FROM appointments WHERE id = :appointment_id";
                $stmt_invoice = $conn->prepare($invoice_query);
                $stmt_invoice->bindParam(':appointment_id', $appointment_id);
                $stmt_invoice->execute();
                $appointment = $stmt_invoice->fetch(PDO::FETCH_ASSOC);

                // Insert a new invoice record
                $invoice_query = "INSERT INTO invoices (user_id, appointment_id, services, description) 
                                  VALUES (:user_id, :appointment_id, :services, :description)";
                $stmt_invoice = $conn->prepare($invoice_query);
                $stmt_invoice->bindParam(':user_id', $appointment['user_id']);
                $stmt_invoice->bindParam(':appointment_id', $appointment['id']);
                $stmt_invoice->bindParam(':services', $appointment['service']);
                $stmt_invoice->bindParam(':description', $appointment['description']);
                $stmt_invoice->execute();

                // Update the appointment to mark invoice as generated
                $update_invoice_query = "UPDATE appointments SET invoice_generated = 1 WHERE id = :appointment_id";
                $stmt_update_invoice = $conn->prepare($update_invoice_query);
                $stmt_update_invoice->bindParam(':appointment_id', $appointment_id);
                $stmt_update_invoice->execute();
            }

            echo json_encode(["message" => "Payment status updated successfully."]);
        } else {
            echo json_encode(["error" => "Failed to update payment status."]);
        }
    } else {
        echo json_encode(["error" => "Invalid data."]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Error: " . $e->getMessage()]);
}
?>
