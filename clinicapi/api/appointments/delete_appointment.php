<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    $appointmentId = $data->id;

    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Start a transaction to ensure all operations are executed together
        $conn->beginTransaction();

        // Delete payment associated with the appointment
        $paymentQuery = "DELETE FROM payments WHERE appointment_id = :appointment_id";
        $paymentStmt = $conn->prepare($paymentQuery);
        $paymentStmt->bindParam(':appointment_id', $appointmentId, PDO::PARAM_INT);
        $paymentStmt->execute();
        // Log the number of rows affected by the payments deletion
        error_log("Rows affected by payment deletion: " . $paymentStmt->rowCount());

        // Delete related invoice
        $invoiceQuery = "DELETE FROM invoices WHERE appointment_id = :appointment_id";
        $invoiceStmt = $conn->prepare($invoiceQuery);
        $invoiceStmt->bindParam(':appointment_id', $appointmentId, PDO::PARAM_INT);
        $invoiceStmt->execute();
        // Log the number of rows affected by the invoice deletion
        error_log("Rows affected by invoice deletion: " . $invoiceStmt->rowCount());

        // Delete related insurance claim
        $insuranceClaimQuery = "DELETE FROM insurance_claims WHERE appointment_id = :appointment_id";
        $insuranceClaimStmt = $conn->prepare($insuranceClaimQuery);
        $insuranceClaimStmt->bindParam(':appointment_id', $appointmentId, PDO::PARAM_INT);
        $insuranceClaimStmt->execute();
        // Log the number of rows affected by the insurance claim deletion
        error_log("Rows affected by insurance claim deletion: " . $insuranceClaimStmt->rowCount());

        // Delete the appointment
        $appointmentQuery = "DELETE FROM appointments WHERE id = :id";
        $appointmentStmt = $conn->prepare($appointmentQuery);
        $appointmentStmt->bindParam(':id', $appointmentId, PDO::PARAM_INT);
        $appointmentStmt->execute();
        
        // Log the number of rows affected by the appointment deletion
        error_log("Rows affected by appointment deletion: " . $appointmentStmt->rowCount());

        if ($appointmentStmt->rowCount() > 0) {
            // Commit the transaction
            $conn->commit();
            echo json_encode(["message" => "Appointment and associated records (payment, invoice, insurance claim) deleted successfully"]);
        } else {
            // Rollback the transaction if no rows were affected
            $conn->rollBack();
            echo json_encode(["error" => "Appointment not found or failed to delete"]);
        }

    } catch (Exception $e) {
        // Rollback the transaction in case of error
        $conn->rollBack();
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
