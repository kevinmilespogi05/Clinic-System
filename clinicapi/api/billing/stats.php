<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT 
    (SELECT COUNT(*) FROM payments WHERE status = 'paid') AS paid_invoices,
    (SELECT COUNT(*) FROM payments WHERE status = 'pending') AS unpaid_invoices,
    (SELECT COUNT(*) FROM insurance_claims WHERE status = 'approved') AS approved_claims,
    (SELECT COUNT(*) FROM insurance_claims WHERE status = 'rejected') AS rejected_claims,
    (SELECT COUNT(*) FROM insurance_claims WHERE status = 'pending') AS pending_claims,
    (SELECT COUNT(*) FROM appointments) AS total_appointments,
    (SELECT COUNT(*) FROM users) AS total_patients,
    (SELECT COUNT(*) FROM appointments WHERE status = 'booked') AS booked_count,
    (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') AS cancelled_count";

$stmt = $db->prepare($query);
$stmt->execute();

$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($stats);
?>
