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

        // Start a transaction to ensure both operations are executed together
        $conn->beginTransaction();

        // Delete payment associated with the appointment
        $paymentQuery = "DELETE FROM payments WHERE appointment_id = :appointment_id";
        $paymentStmt = $conn->prepare($paymentQuery);
        $paymentStmt->bindParam(':appointment_id', $appointmentId, PDO::PARAM_INT);
        $paymentStmt->execute();
        // Log the number of rows affected by the payments deletion
        error_log("Rows affected by payment deletion: " . $paymentStmt->rowCount());

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
            echo json_encode(["message" => "Appointment and associated payment deleted successfully"]);
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
