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

        $query = "DELETE FROM appointments WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $appointmentId, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Appointment deleted successfully"]);
        } else {
            echo json_encode(["error" => "Failed to delete appointment"]);
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}