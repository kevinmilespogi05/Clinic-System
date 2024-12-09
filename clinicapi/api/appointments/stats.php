<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT 
    (SELECT COUNT(*) FROM appointments WHERE status = 'booked') AS booked_count,
    (SELECT COUNT(*) FROM appointments WHERE status = 'cancelled') AS cancelled_count";

$stmt = $db->prepare($query);
$stmt->execute();

$stats = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($stats);
?>
