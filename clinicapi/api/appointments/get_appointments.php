<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

// Assume the user's role is passed as part of the request (you can change this logic based on your implementation).
$role = isset($_GET['role']) ? $_GET['role'] : null;
$id = isset($_GET['id']) ? $_GET['id'] : null;

try {
    if ($role === 'admin') {
        // Fetch all appointments for the admin, filtering by status and payment status
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status, service, payment_status 
                  FROM appointments 
                  ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
    } elseif ($role === 'user' && $id) {
        // If the user is a regular user, filter by their user_id
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status, service, payment_status 
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

    // Filter appointments for admin or user based on payment and approval status
    if ($role === 'admin') {
        $appointments = array_map(function($appt) {
            // You can adjust the logic based on how you want to categorize appointments for the admin
            if ($appt['payment_status'] === 'paid' && $appt['status'] !== 'approved') {
                // If payment is made but not approved, keep it as pending
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
