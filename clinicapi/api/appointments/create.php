<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->id) && isset($data->day) && isset($data->time) && isset($data->date)) {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        $query = "INSERT INTO appointments (user_id, date, time, status) VALUES (:user_id, :date, :time, 'pending')";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $data->id);
        $stmt->bindParam(':date', $data->date);
        $stmt->bindParam(':time', $data->time);

        if ($stmt->execute()) {
            echo json_encode(["message" => "Appointment created, pending admin approval"]);
        } else {
            echo json_encode(["error" => "Failed to create appointment"]);
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
