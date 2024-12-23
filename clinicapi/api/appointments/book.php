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

    if (isset($data->user_id) && isset($data->day) && isset($data->time) && isset($data->date) && isset($data->description) && isset($data->service)) {
        
        $date = date('Y-m-d', strtotime($data->date));
        
        // Check for conflicting appointments (already booked, approved, or pending)
        $conflictQuery = "SELECT COUNT(*) as count 
        FROM appointments 
        WHERE date = :date AND time = :time AND (status = 'booked' OR status = 'approved' OR status = 'pending')";
        $conflictStmt = $conn->prepare($conflictQuery);
        $conflictStmt->bindParam(':date', $date);
        $conflictStmt->bindParam(':time', $data->time);
        $conflictStmt->execute();
        $conflictResult = $conflictStmt->fetch(PDO::FETCH_ASSOC);

        if ($conflictResult['count'] > 0) {
            echo json_encode(["error" => "The selected slot is already booked, approved, or pending."]);
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
                    $servicePrice = 50; // Low cost
                    break;
                case 'Surgery':
                    $servicePrice = 150; // Medium cost
                    break;
                case 'Therapy':
                    $servicePrice = 75; // Medium cost
                    break;
                default:
                    echo json_encode(["error" => "Invalid service type."]);
                    exit;
            }

            // Calculate the bill (assuming 1 day of service for simplicity)
            $billAmount = $servicePrice;

            // Insert the appointment into the database with a status of 'pending'
            $query = "INSERT INTO appointments (user_id, username, date, time, description, status, service, payment_status, bill_amount) 
            VALUES (:user_id, :username, :date, :time, :description, 'pending', :service, 'pending', :bill_amount)";
            $stmt = $conn->prepare($query);
            
            $stmt->bindParam(':user_id', $data->user_id);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':date', $date);
            $stmt->bindParam(':time', $data->time);
            $stmt->bindParam(':description', $data->description);
            $stmt->bindParam(':service', $data->service);
            $stmt->bindParam(':bill_amount', $billAmount);

            if ($stmt->execute()) {
                // Return response indicating successful booking
                echo json_encode(["message" => "Appointment booked successfully. Please complete the payment to confirm."]);
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
