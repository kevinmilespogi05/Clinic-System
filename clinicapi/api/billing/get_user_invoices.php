<?php
include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->userId)) {
    try {
        $userId = htmlspecialchars(strip_tags($data->userId));

        // Query to get invoices with related details
        $query = "
        SELECT 
            i.id AS invoice_id, 
            i.services, 
            i.description, 
            i.discounted_amount,  -- Add the discounted amount here
            i.created_at AS invoice_date, 
            a.date AS appointment_date, 
            a.time AS appointment_time, 
            a.service, 
            a.bill_amount,
            u.first_name, 
            u.last_name, 
            u.contact_number, 
            u.billing_address, 
            u.city, 
            u.province,
            p.amount AS payment_amount, 
            p.payment_method, 
            p.status AS payment_status
        FROM invoices i
        LEFT JOIN appointments a ON i.user_id = a.user_id
        LEFT JOIN users u ON i.user_id = u.id
        LEFT JOIN payments p ON i.user_id = p.user_id
        WHERE i.user_id = :user_id
        GROUP BY i.id";  // Grouping by invoice id to ensure we get unique invoices
        
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $invoices = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $invoices[] = [
                'invoice_id' => $row['invoice_id'],
                'services' => $row['services'], 
                'description' => $row['description'],
                'discounted_amount' => $row['discounted_amount'],  // Add this
                'invoice_date' => $row['invoice_date'],
                'appointment' => [
                    'date' => $row['appointment_date'],
                    'time' => $row['appointment_time'],
                    'service' => $row['service'],
                    'bill_amount' => $row['bill_amount'],
                ],
                'user' => [
                    'first_name' => $row['first_name'],
                    'last_name' => $row['last_name'],
                    'contact_number' => $row['contact_number'],
                    'billing_address' => $row['billing_address'],
                    'city' => $row['city'],
                    'province' => $row['province'],
                ],
                'payment' => [
                    'amount' => $row['payment_amount'],
                    'method' => $row['payment_method'],
                    'status' => $row['payment_status'],
                ],
            ];            
        }

        header('Content-Type: application/json');
        echo json_encode($invoices);
    } catch (Exception $e) {
        echo json_encode(["message" => "Error fetching invoices: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "User ID is required"]);
}

$conn = null;
?>
