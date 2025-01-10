<?php
include_once '../../config/database.php';

try {
    $database = new Database();
    $conn = $database->getConnection();

    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->user_id) && isset($data->date)) {
        $user_id = $data->user_id;
        $date = date('Y-m-d', strtotime($data->date));

        // Check if the appointment slot is already booked
        $checkConflictQuery = "SELECT COUNT(*) as count 
        FROM appointments 
        WHERE user_id = :user_id AND DATE(date) = :date 
        AND (status = 'booked' OR status = 'approved' OR status = 'pending')";
        $checkConflictStmt = $conn->prepare($checkConflictQuery);
        $checkConflictStmt->bindParam(':user_id', $user_id);
        $checkConflictStmt->bindParam(':date', $date);
        $checkConflictStmt->execute();
        $conflictResult = $checkConflictStmt->fetch(PDO::FETCH_ASSOC);

        if ($conflictResult['count'] > 0) {
            echo json_encode(["error" => "You have already booked an appointment on this day."]);
        } else {
            echo json_encode(["message" => "No conflicts, you can book the appointment."]);
        }
    } else {
        echo json_encode(["error" => "Missing required fields."]);
    }
} catch (PDOException $exception) {
    echo json_encode(["error" => "Error: " . $exception->getMessage()]);
}
?>
