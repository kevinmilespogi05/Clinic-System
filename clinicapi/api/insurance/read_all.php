<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT 
    insurance_claims.id, 
    users.username, 
    insurance_claims.description, 
    insurance_claims.status, 
    insurance_claims.created_at 
FROM insurance_claims 
JOIN users ON insurance_claims.user_id = users.id 
ORDER BY insurance_claims.created_at DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$claims = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($claims);
?>