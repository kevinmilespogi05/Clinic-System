<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM payments ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["payments" => $payments]);
?>
