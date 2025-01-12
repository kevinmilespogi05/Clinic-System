<?php
// Set the timezone to Asia/Manila (adjust as needed)
date_default_timezone_set('Asia/Manila');

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

    if (isset($data->user_id) && isset($data->date) && isset($data->time) && isset($data->description) && isset($data->service)) {
        
        // Convert the date to the correct format (Y-m-d)
        $date = date('Y-m-d', strtotime($data->date));
        // Convert time to 24-hour format (H:i:s) for database insertion
        $time = date('H:i:s', strtotime($data->time)); // Store time as H:i:s for MySQL

        // Debug: Print the input date and time for conflict checking
        error_log("Booking Attempt: Date: $date, Time: $time");

        // Check if the appointment slot is already booked for the user on the selected date and time
        $checkConflictQuery = "SELECT COUNT(*) as count 
        FROM appointments 
        WHERE user_id = :user_id AND date = :date AND time = :time 
        AND (status = 'booked' OR status = 'approved' OR status = 'pending')";
        $checkConflictStmt = $conn->prepare($checkConflictQuery);
        $checkConflictStmt->bindParam(':user_id', $data->user_id);
        $checkConflictStmt->bindParam(':date', $date);
        $checkConflictStmt->bindParam(':time', $time);
        $checkConflictStmt->execute();
        $conflictResult = $checkConflictStmt->fetch(PDO::FETCH_ASSOC);

        // If there is a conflict, return an error message
        if ($conflictResult['count'] > 0) {
            echo json_encode(["error" => "This time slot is already booked. Please choose a different slot."]);
            exit;
        }

        // Fetch username from users table
        $userQuery = "SELECT username FROM users WHERE id = :user_id";
        $userStmt = $conn->prepare($userQuery);
        $userStmt->bindParam(':user_id', $data->user_id);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $username = $user['username'];

            // Determine the price based on the selected service
            $servicePrice = 0;
            switch ($data->service) {
                case 'Consultation':
                    $servicePrice = 150; // Low cost
                    break;
                case 'Surgery':
                    $servicePrice = 75000; // High cost
                    break;
                case 'Therapy':
                    $servicePrice = 10000; // Medium cost
                    break;
                default:
                    echo json_encode(["error" => "Invalid service type."]);
                    exit;
            }

            // Calculate the bill (assuming 1 day of service for simplicity)
            $billAmount = $servicePrice;

            // Format the time to 12-hour AM/PM format for response
            $formattedTime = date('g:i A', strtotime($time)); // Example: 11:00 AM

            // Insert the appointment into the database with a status of 'pending'
            $query = "INSERT INTO appointments (user_id, username, date, time, description, status, service, payment_status, bill_amount) 
            VALUES (:user_id, :username, :date, :time, :description, 'pending', :service, 'pending', :bill_amount)";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(':user_id', $data->user_id);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':date', $date);
            $stmt->bindParam(':time', $time); // Store the original 24-hour time in database
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':service', $data->service);
            $stmt->bindParam(':bill_amount', $billAmount);

            if ($stmt->execute()) {
                // Return response indicating successful booking, with formatted time
                echo json_encode([
                    "message" => "Appointment booked successfully. Please complete the payment to confirm.",
                    "appointment" => [
                        "id" => $conn->lastInsertId(),
                        "user_id" => $data->user_id,
                        "username" => $username,
                        "date" => $date,
                        "time" => $formattedTime, // Return formatted time in the response
                        "description" => $data->description,
                        "service" => $data->service,
                        "status" => "pending",
                        "bill_amount" => $billAmount
                    ]
                ]);
            } else {
                echo json_encode(["error" => "Failed to book appointment."]);
            }
        } else {
            echo json_encode(["error" => "User not found."]);
        }
    } else {
        echo json_encode(["error" => "Missing required fields."]);
    }
} catch (PDOException $exception) {
    echo json_encode(["error" => "Error: " . $exception->getMessage()]);
}
?>
