<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT * FROM insurance_claims 
          ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$insuranceClaims = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["insuranceClaims" => $insuranceClaims]);
?>
