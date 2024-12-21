<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id)) {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Update appointment status to 'cancelled'
        $query = "UPDATE appointments SET status = 'cancelled' WHERE id = :id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $data->id);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Appointment declined"]);
        } else {
            echo json_encode(["error" => "Failed to decline appointment"]);
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
