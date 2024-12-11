<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->status)) {
    $appointmentId = $data->id;
    $status = $data->status;

    try {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "UPDATE appointments SET status = :status WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $appointmentId, PDO::PARAM_INT);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Status updated successfully"]);
        } else {
            echo json_encode(["error" => "Failed to update status"]);
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
