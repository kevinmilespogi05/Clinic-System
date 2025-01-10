<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    // Check if 'status' column exists
    $columnCheckQuery = "SHOW COLUMNS FROM appointments LIKE 'status'";
    $columnCheckStmt = $db->prepare($columnCheckQuery);
    $columnCheckStmt->execute();
    $statusColumnExists = $columnCheckStmt->rowCount() > 0;

    // Build the query dynamically based on whether 'status' exists
    if ($statusColumnExists) {
        $query = "SELECT 
            (SELECT COUNT(*) FROM appointments WHERE status = 'booked') AS booked_count,
            (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') AS cancelled_count,
            (SELECT COUNT(*) FROM appointments WHERE payment_status = 'paid') AS paid_invoices,
            (SELECT COUNT(*) FROM appointments WHERE payment_status = 'pending') AS unpaid_invoices,
            COUNT(*) AS total_appointments,
            (SELECT COUNT(DISTINCT u.id) 
             FROM users u 
             WHERE u.role = 'user') AS total_patients
            FROM appointments";
    } else {
        $query = "SELECT 
            COUNT(*) AS total_appointments,
            (SELECT COUNT(DISTINCT u.id) 
             FROM users u 
             WHERE u.role = 'user') AS total_patients
            FROM appointments";
    }

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
