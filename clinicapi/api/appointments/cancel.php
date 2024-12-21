<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Added to specify JSON response

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->appointment_id) && !empty($data->reason)) {
    $query = "UPDATE appointments SET status = 'cancelled', cancellation_reason = :reason WHERE id = :appointment_id";

    $database = new Database();
    $db = $database->getConnection();
    $stmt = $db->prepare($query);
    $stmt->bindParam(":appointment_id", $data->appointment_id);
    $stmt->bindParam(":reason", $data->reason);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Appointment cancelled successfully."]);
    } else {
        $errorInfo = $stmt->errorInfo();
        echo json_encode(["message" => "Failed to cancel appointment.", "error" => $errorInfo]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
