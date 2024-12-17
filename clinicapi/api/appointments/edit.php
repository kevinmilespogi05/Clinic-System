<?php
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->time) && isset($data->date)) {
    $query = "UPDATE appointments SET time = :time, date = :date WHERE id = :id";

    $database = new Database();
    $db = $database->getConnection();
    $stmt = $db->prepare($query);
    $stmt->bindParam(':id', $data->id);
    $stmt->bindParam(':time', $data->time);
    $stmt->bindParam(':date', $data->date);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Appointment updated"]);
    } else {
        echo json_encode(["error" => "Failed to update"]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
