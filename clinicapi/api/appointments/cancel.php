<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->appointment_id) && !empty($data->reason)) {
    $query = "UPDATE appointments SET status = 'cancelled', cancellation_reason = :reason WHERE id = :appointment_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":appointment_id", $data->appointment_id);
    $stmt->bindParam(":reason", $data->reason);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Appointment cancelled successfully."]);
    } else {
        echo json_encode(["message" => "Failed to cancel appointment."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
