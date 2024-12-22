<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

try {
    if (isset($data->appointment_id) && isset($data->status)) {
        $appointment_id = $data->appointment_id;
        $status = $data->status;

        $query = "UPDATE appointments SET status = :status WHERE id = :appointment_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':appointment_id', $appointment_id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Appointment status updated successfully."]);
        } else {
            echo json_encode(["error" => "Failed to update appointment status."]);
        }
    } else {
        echo json_encode(["error" => "Invalid data."]);
    }
} catch (Exception $e) {
    echo json_encode(["error" => "Error: " . $e->getMessage()]);
}
?>
