<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

// Log the received data to check for any missing fields
error_log(print_r($data, true));

if (!empty($data->user_id) && !empty($data->description) && !empty($data->appointment_id) && !empty($data->service)) {
    // Get the bill amount from the appointments table based on the appointment ID
    $query = "SELECT bill_amount, service FROM appointments WHERE id = :appointment_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':appointment_id', $data->appointment_id);
    $stmt->execute();
    $appointment = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($appointment) {
        // Get the original bill amount and service type
        $billAmount = $appointment['bill_amount'];
        $serviceType = $appointment['service'];
        
        // Calculate the discount
        $discountPercentage = 0;
        switch ($serviceType) {
            case 'Consultation':
                $discountPercentage = 10;
                break;
            case 'Surgery':
                $discountPercentage = 20;
                break;
            case 'Therapy':
                $discountPercentage = 15;
                break;
            default:
                $discountPercentage = 0;
        }
        
        // Calculate the discounted amount
        $discountedAmount = $billAmount - ($billAmount * $discountPercentage / 100);
        
        // Insert the insurance claim
        $query = "INSERT INTO insurance_claims (user_id, appointment_id, description, service, status, discounted_amount) 
                  VALUES (:user_id, :appointment_id, :description, :service, 'pending', :discounted_amount)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $data->user_id);
        $stmt->bindParam(":appointment_id", $data->appointment_id);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":service", $data->service);
        $stmt->bindParam(":discounted_amount", $discountedAmount);
        
        if ($stmt->execute()) {
            // Get the last inserted ID (insurance claim ID)
            $last_id = $db->lastInsertId();
            
            // Insert the discounted amount into the invoices table without creating a new invoice
            $query = "INSERT INTO invoices (user_id, appointment_id, services, description, discounted_amount, created_at) 
                      VALUES (:user_id, :appointment_id, :services, :description, :discounted_amount, NOW())";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":user_id", $data->user_id);
            $stmt->bindParam(":appointment_id", $data->appointment_id);
            $stmt->bindParam(":services", $data->service);
            $stmt->bindParam(":description", $data->description);
            $stmt->bindParam(":discounted_amount", $discountedAmount);
            
            // Execute the invoice insert query (without creating a full invoice)
            if ($stmt->execute()) {
                echo json_encode(["message" => "Insurance claim submitted and discounted amount added to invoices.", "claim_id" => $last_id]);
            } else {
                echo json_encode(["message" => "Failed to add discounted amount to invoices."]);
            }
        } else {
            echo json_encode(["message" => "Failed to submit insurance claim."]);
        }
    } else {
        echo json_encode(["message" => "Appointment not found."]);
    }
} else {
    $errorMessage = 'Incomplete data.';
    if (empty($data->description)) {
        $errorMessage = 'Description is required.';
    } elseif (empty($data->service)) {
        $errorMessage = 'Service is required.';
    }
    echo json_encode(["message" => $errorMessage]);
}
?>
