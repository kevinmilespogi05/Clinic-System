<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT 
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'approved') AS approved_claims,
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'rejected') AS rejected_claims,
                (SELECT COUNT(*) FROM insurance_claims WHERE status = 'pending') AS pending_claims
              FROM dual";

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
