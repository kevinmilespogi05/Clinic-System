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
        // If the user is an admin, fetch all appointments
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status 
                  FROM appointments ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
    } elseif ($role === 'user' && $id) {
        // If the user is a regular user, filter by their user_id
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status 
                  FROM appointments WHERE user_id = :id ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    } else {
        echo json_encode(["error" => "Role or User ID not provided."]);
        exit;
    }

    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["appointments" => $appointments]);
} catch (Exception $e) {
    echo json_encode(["error" => "Unable to fetch appointments.", "details" => $e->getMessage()]);
}

?>
