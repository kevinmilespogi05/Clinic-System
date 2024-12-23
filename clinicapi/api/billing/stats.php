<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT 
    (SELECT COUNT(*) FROM invoices WHERE status = 'paid') AS paid_count,
    (SELECT COUNT(*) FROM invoices WHERE status = 'unpaid') AS unpaid_count";

$stmt = $db->prepare($query);
$stmt->execute();

$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($stats);
?>
