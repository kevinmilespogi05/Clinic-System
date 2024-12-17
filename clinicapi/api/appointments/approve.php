<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->status)) {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "UPDATE appointments SET status = :status WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);
        $stmt->bindParam(':status', $data->status);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Appointment updated"]);
        } else {
            echo json_encode(["error" => "Failed to update appointment"]);
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
