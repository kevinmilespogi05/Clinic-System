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

    // Retrieve the posted data (payment confirmation)
    $data = json_decode(file_get_contents("php://input"));

    if (isset($data->appointment_id) && isset($data->payment_status) && $data->payment_status === 'paid') {
        
        // Check if the payment exists in the 'payments' table and is marked as 'paid'
        $paymentQuery = "SELECT * FROM payments WHERE appointment_id = :appointment_id AND status = 'paid'";
        $paymentStmt = $conn->prepare($paymentQuery);
        $paymentStmt->bindParam(':appointment_id', $data->appointment_id);
        $paymentStmt->execute();
        $paymentResult = $paymentStmt->fetch(PDO::FETCH_ASSOC);

        if ($paymentResult) {
            // If payment is confirmed, update the appointment's payment status
            $updateQuery = "UPDATE appointments SET payment_status = 'paid' WHERE id = :appointment_id";
            $updateStmt = $conn->prepare($updateQuery);
            $updateStmt->bindParam(':appointment_id', $data->appointment_id);
            
            if ($updateStmt->execute()) {
                echo json_encode(["message" => "Payment confirmed, appointment status updated to paid."]);
            } else {
                echo json_encode(["error" => "Failed to update appointment payment status."]);
            }
        } else {
            echo json_encode(["error" => "No matching payment found or payment is not marked as 'paid'."]);
        }
    } else {
        echo json_encode(["error" => "Missing or invalid data."]);
    }
} catch (PDOException $exception) {
    echo json_encode(["error" => "Error: " . $exception->getMessage()]);
}
?>
