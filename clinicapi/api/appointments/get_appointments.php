<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$role = isset($_GET['role']) ? $_GET['role'] : null;
$id = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($role === 'admin') {
        // Fetch all appointments for admin
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status, service, payment_status, refund_status 
                  FROM appointments 
                  ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
    } elseif ($role === 'user' && $id) {
        // Fetch appointments for a specific user
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status, service, payment_status, refund_status 
                  FROM appointments 
                  WHERE user_id = :id 
                  ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    } else {
        echo json_encode(["error" => "Role or User ID not provided."]);
        exit;
    }

    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Admin-specific processing if needed
    if ($role === 'admin') {
        $appointments = array_map(function($appt) {
            if ($appt['payment_status'] === 'paid' && $appt['status'] !== 'approved') {
                $appt['status'] = 'pending';
            }
            return $appt;
        }, $appointments);
    }

    echo json_encode(["appointments" => $appointments]);

} catch (Exception $e) {
    echo json_encode(["error" => "Unable to fetch appointments.", "details" => $e->getMessage()]);
}
?>
