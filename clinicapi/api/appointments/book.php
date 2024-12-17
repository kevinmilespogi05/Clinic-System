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

    // Retrieve the posted data
    $data = json_decode(file_get_contents("php://input"));

    // Check if all required fields are provided
    if (isset($data->user_id) && isset($data->day) && isset($data->time) && isset($data->date)) {
        $query = "INSERT INTO appointments (user_id, name, date, time, description, status) 
                  VALUES (:user_id, :name, :date, :time, :description, :status)";
        
        $stmt = $conn->prepare($query);

        // Bind the data to the query
        $stmt->bindParam(':user_id', $data->user_id);
        $stmt->bindParam(':name', $data->name); // Assuming 'name' is passed from frontend or you can leave it out
        $stmt->bindParam(':date', $data->date);
        $stmt->bindParam(':time', $data->time);
        $stmt->bindParam(':description', $data->description);
        $stmt->bindParam(':status', $data->status);

        // Execute the query
        if ($stmt->execute()) {
            // Fetch the newly inserted appointment
            $appointmentId = $conn->lastInsertId();
            $appointment = [
                'id' => $appointmentId,
                'user_id' => $data->user_id,
                'name' => $data->name,
                'date' => $data->date,
                'time' => $data->time,
                'description' => $data->description,
                'status' => $data->status
            ];

            echo json_encode(['appointment' => $appointment]);
        } else {
            echo json_encode(["error" => "Failed to book appointment"]);
        }
    } else {
        echo json_encode(["error" => "Missing required fields"]);
    }
} catch (Exception $e) {
    // Handle connection or query errors
    echo json_encode(["error" => "Unable to book appointment", "details" => $e->getMessage()]);
}
