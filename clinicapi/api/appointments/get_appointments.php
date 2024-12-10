<?php

// Allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Include database configuration
include_once '../../config/database.php';

try {
    // Create a database connection
    $database = new Database();
    $conn = $database->getConnection();

    // Check if id (user's id) is provided
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    // Prepare the query to fetch appointments
    if ($id) {
        $query = "SELECT id, user_id, name, date, time, description, status FROM appointments WHERE user_id = :id ORDER BY date DESC, time DESC";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    } else {
        $query = "SELECT id, user_id, name, date, time, description, status FROM appointments ORDER BY date DESC, time DESC";
        $stmt = $conn->prepare($query);
    }

    $stmt->execute();

    // Fetch all appointments as an associative array
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the appointments as JSON
    if ($appointments) {
        echo json_encode(["appointments" => $appointments]);
    } else {
        echo json_encode(["appointments" => [], "message" => "No appointments found"]);
    }
} catch (Exception $e) {
    // Handle connection or query errors
    echo json_encode(["error" => "Unable to fetch appointments", "details" => $e->getMessage()]);
}
