<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['appointment_id']) || empty($data['appointment_id'])) {
        echo json_encode(['success' => false, 'message' => 'Appointment ID is required.']);
        exit;
    }

    $appointment_id = htmlspecialchars(strip_tags($data['appointment_id']));

    // Fetch the appointment to check its current status
    $query_check = "SELECT payment_status, refund_status FROM appointments WHERE id = :appointment_id";
    $stmt_check = $conn->prepare($query_check);
    $stmt_check->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
    $stmt_check->execute();
    $appointment = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if (!$appointment) {
        echo json_encode(['success' => false, 'message' => 'Appointment not found.']);
        exit;
    }

    if ($appointment['payment_status'] !== 'paid') {
        echo json_encode(['success' => false, 'message' => 'Refund not possible for unpaid appointments.']);
        exit;
    }

    if ($appointment['refund_status'] !== 'none') {
        echo json_encode(['success' => false, 'message' => 'Refund has already been requested or processed.']);
        exit;
    }

    // Update the refund status and appointment status
    $query = "UPDATE appointments 
              SET status = 'cancelled', payment_status = 'failed', refund_status = 'processed' 
              WHERE id = :appointment_id";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            echo json_encode([
                'success' => true,
                'message' => 'Refund processed successfully. Appointment will remain in the system until confirmed for deletion.'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Appointment update failed.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Refund processing failed.']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    // Handle the deletion after confirmation
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['appointment_id']) || empty($data['appointment_id'])) {
        echo json_encode(['success' => false, 'message' => 'Appointment ID is required.']);
        exit;
    }

    $appointment_id = htmlspecialchars(strip_tags($data['appointment_id']));

    // Delete the appointment after confirmation
    $query_delete = "DELETE FROM appointments WHERE id = :appointment_id";
    $stmt_delete = $conn->prepare($query_delete);
    $stmt_delete->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);

    if ($stmt_delete->execute()) {
        echo json_encode(['success' => true, 'message' => 'Appointment deleted successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete the appointment.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
