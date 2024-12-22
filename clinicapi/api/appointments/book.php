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
    if (isset($data->user_id) && isset($data->day) && isset($data->time) && isset($data->date) && isset($data->description)) {
        
        // Ensure the date is in the correct format (YYYY-MM-DD)
        $date = date('Y-m-d', strtotime($data->date));  // Converts the input date into the correct format
        
        // Check if the slot is already booked, approved, or pending
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

        // Fetch username from users table based on user_id
        $userQuery = "SELECT username FROM users WHERE id = :user_id";
        $userStmt = $conn->prepare($userQuery);
        $userStmt->bindParam(':user_id', $data->user_id);
        $userStmt->execute();
        $user = $userStmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $username = $user['username'];

            // Insert appointment into the database with status 'pending'
            $query = "INSERT INTO appointments (user_id, username, date, time, description, status) 
            VALUES (:user_id, :username, :date, :time, :description, 'pending')";  // Set 'pending' as status by default
            $stmt = $conn->prepare($query);
            
            // Bind the data to the query
            $stmt->bindParam(':user_id', $data->user_id);
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':date', $date);  // Use the formatted date here
            $stmt->bindParam(':time', $data->time);
            $stmt->bindParam(':description', $data->description);

            // Execute the query
            if ($stmt->execute()) {
                echo json_encode(["message" => "Appointment booked successfully."]);
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
