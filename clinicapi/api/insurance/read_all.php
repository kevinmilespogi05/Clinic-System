<?php
// read_all.php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Assuming you get userId and isAdmin from the query string
$userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
$isAdmin = isset($_GET['is_admin']) ? $_GET['is_admin'] : null;

if ($isAdmin == 1) {
    // Admin can see all claims
    $query = "SELECT 
        insurance_claims.id, 
        users.username, 
        insurance_claims.description, 
        insurance_claims.service, 
        insurance_claims.status, 
        appointments.payment_status AS claim_payment_status,  -- Fetch payment_status from appointments table
        appointments.bill_amount,  -- Getting bill_amount from the appointments table
        insurance_claims.discounted_amount,  -- Add discounted_amount
        insurance_claims.appointment_id, 
        insurance_claims.created_at 
    FROM insurance_claims 
    JOIN users ON insurance_claims.user_id = users.id 
    JOIN appointments ON insurance_claims.appointment_id = appointments.id  -- Join with appointments table
    ORDER BY insurance_claims.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->execute();

    $claims = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($claims);
} else {
    // Regular users can only see their own claims
    $query = "SELECT 
        insurance_claims.id, 
        users.username, 
        insurance_claims.description, 
        insurance_claims.service, 
        insurance_claims.status, 
        appointments.payment_status AS claim_payment_status,  -- Fetch payment_status from appointments table
        appointments.bill_amount,  -- Getting bill_amount from the appointments table
        insurance_claims.discounted_amount,  -- Add discounted_amount
        insurance_claims.appointment_id, 
        insurance_claims.created_at 
    FROM insurance_claims 
    JOIN users ON insurance_claims.user_id = users.id 
    JOIN appointments ON insurance_claims.appointment_id = appointments.id  -- Join with appointments table
    WHERE insurance_claims.user_id = :user_id 
    ORDER BY insurance_claims.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $userId);
    $stmt->execute();

    $claims = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($claims);
}
?>
