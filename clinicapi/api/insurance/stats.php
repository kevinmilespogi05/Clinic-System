<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Query to fetch paid/unpaid invoices and accepted/rejected insurance claims counts
    $query = "SELECT 
                (SELECT COUNT(*) FROM invoices WHERE status = 'paid') AS paid_invoices,
                (SELECT COUNT(*) FROM invoices WHERE status = 'unpaid') AS unpaid_invoices,
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'approved') AS approved_claims,
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'rejected') AS rejected_claims,
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'pending') AS pending_claims
              FROM dual"; // Using 'dual' as a dummy table for SELECT without needing an actual table

    $stmt = $db->prepare($query);
    $stmt->execute();
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => $stats
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch stats",
        "error" => $e->getMessage()
    ]);
}
?>
