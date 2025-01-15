<?php
date_default_timezone_set('Asia/Manila'); // Set timezone to Philippines

include_once '../../config/database.php';

// Instantiate the Database class to get the PDO connection
$database = new Database();
$conn = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Read raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Ensure data is coming in correctly
    if (isset($data['appointment_id']) && isset($data['new_slot'])) {
        $appointment_id = $data['appointment_id']; // Secure the ID input
        $new_slot = $data['new_slot']; // Directly access the new_slot data
        
        if ($new_slot && isset($new_slot['date']) && isset($new_slot['time'])) {
            $new_date = $new_slot['date'];
            $new_time = $new_slot['time'];

            // Get the existing appointment details to create a new appointment
            $query = "SELECT * FROM appointments WHERE id = :appointment_id";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
            $stmt->execute();
            
            // Check if the appointment exists
            if ($stmt->rowCount() > 0) {
                $existing_appointment = $stmt->fetch(PDO::FETCH_ASSOC);
                
                // Ensure the new date is valid (next week or next month)
                $current_date = new DateTime();
                $existing_appointment_date = new DateTime($existing_appointment['date']);
                $new_appointment_date = new DateTime($new_date);
                
                // Check if the new date is at least a week after the original appointment date
                $interval = $existing_appointment_date->diff($new_appointment_date);
                if ($interval->days < 7) {
                    echo json_encode(['success' => false, 'message' => 'You can only reschedule your appointment to a date at least 7 days after the original appointment.']);
                    exit;
                }
                
                // Start a transaction
                $conn->beginTransaction();

                // Create a new appointment
                $user_id = $existing_appointment['user_id'];
                $username = $existing_appointment['username'];
                $service = $existing_appointment['service'];
                $description = $existing_appointment['description'];
                $status = 'booked'; // Assuming status is 'booked' after reschedule
                $payment_status = $existing_appointment['payment_status'];
                $bill_amount = $existing_appointment['bill_amount'];
                $refund_status = $existing_appointment['refund_status'];
                $insurance_provider = $existing_appointment['insurance_provider'];
                $policy_number = $existing_appointment['policy_number'];
                $invoice_generated = $existing_appointment['invoice_generated'];

                // Insert the new appointment
                $sql_new_appointment = "INSERT INTO appointments 
                    (user_id, username, date, time, description, service, status, payment_status, bill_amount, refund_status, insurance_provider, policy_number, invoice_generated) 
                    VALUES (:user_id, :username, :new_date, :new_time, :description, :service, :status, :payment_status, :bill_amount, :refund_status, :insurance_provider, :policy_number, :invoice_generated)";
                $stmt_new = $conn->prepare($sql_new_appointment);
                $stmt_new->bindParam(':user_id', $user_id);
                $stmt_new->bindParam(':username', $username);
                $stmt_new->bindParam(':new_date', $new_date);
                $stmt_new->bindParam(':new_time', $new_time);
                $stmt_new->bindParam(':description', $description);
                $stmt_new->bindParam(':service', $service);
                $stmt_new->bindParam(':status', $status);
                $stmt_new->bindParam(':payment_status', $payment_status);
                $stmt_new->bindParam(':bill_amount', $bill_amount);
                $stmt_new->bindParam(':refund_status', $refund_status);
                $stmt_new->bindParam(':insurance_provider', $insurance_provider);
                $stmt_new->bindParam(':policy_number', $policy_number);
                $stmt_new->bindParam(':invoice_generated', $invoice_generated);

                if ($stmt_new->execute()) {
                    // Remove the old appointment
                    $sql_remove_old_appointment = "DELETE FROM appointments WHERE id = :appointment_id";
                    $stmt_remove = $conn->prepare($sql_remove_old_appointment);
                    $stmt_remove->bindParam(':appointment_id', $appointment_id, PDO::PARAM_INT);
                    $stmt_remove->execute();

                    // Commit the transaction
                    $conn->commit();
                    echo json_encode(['success' => true, 'message' => 'Appointment rescheduled successfully.']);
                } else {
                    // Rollback the transaction if insertion fails
                    $conn->rollBack();
                    echo json_encode(['success' => false, 'message' => 'An error occurred while rescheduling the appointment.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Appointment not found.']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid reschedule data.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing appointment ID or new slot data.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
