<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && isset($data->day) && isset($data->time) && isset($data->date)) {
    try {
        $database = new Database();
        $conn = $database->getConnection();

        // Check for conflicting appointments
        $conflictQuery = "SELECT COUNT(*) as count FROM appointments WHERE user_id = :user_id AND date = :date AND time = :time AND status != 'cancelled'";
        $conflictStmt = $conn->prepare($conflictQuery);
        $conflictStmt->bindParam(':user_id', $data->user_id);
        $conflictStmt->bindParam(':date', $data->date);
        $conflictStmt->bindParam(':time', $data->time);
        $conflictStmt->execute();
        $conflictResult = $conflictStmt->fetch(PDO::FETCH_ASSOC);

        if ($conflictResult['count'] > 0) {
            echo json_encode(["error" => "Conflicting appointment exists"]);
        } else {
            $query = "INSERT INTO appointments (user_id, date, time, status) VALUES (:user_id, :date, :time, 'pending')";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':user_id', $data->user_id);
            $stmt->bindParam(':date', $data->date);
            $stmt->bindParam(':time', $data->time);

            if ($stmt->execute()) {
                echo json_encode(["message" => "Appointment created, pending admin approval"]);
            } else {
                echo json_encode(["error" => "Failed to create appointment"]);
            }
        }
    } catch (Exception $e) {
        echo json_encode(["error" => "Error occurred", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Invalid input"]);
}
?>
