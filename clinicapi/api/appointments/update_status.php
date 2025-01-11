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

        $query = "UPDATE appointments SET payment_status = :payment_status WHERE id = :appointment_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':payment_status', $payment_status);
        $stmt->bindParam(':appointment_id', $appointment_id);

        if ($stmt->execute()) {
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
