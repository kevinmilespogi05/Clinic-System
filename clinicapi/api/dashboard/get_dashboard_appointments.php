<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

// Get user_id from request (GET or POST)
$user_id = isset($_GET['id']) ? $_GET['id'] : null;

if ($user_id) {
    try {
        // Query to get appointments based on user_id
        $query = "SELECT id, user_id, username, DATE_FORMAT(date, '%Y-%m-%d') AS date, time, description, status 
                  FROM appointments 
                  WHERE user_id = :user_id 
                  ORDER BY date ASC, time ASC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        
        $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return appointments as JSON
        echo json_encode(["appointments" => $appointments]);
    } catch (Exception $e) {
        echo json_encode(["error" => "Unable to fetch appointments.", "details" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "User ID is required."]);
}
?>
