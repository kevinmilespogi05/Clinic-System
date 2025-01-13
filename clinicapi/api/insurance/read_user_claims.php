<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if ($userId) {
    $query = "SELECT 
                insurance_claims.id, 
                insurance_claims.description, 
                insurance_claims.status, 
                insurance_claims.service,
                insurance_claims.discounted_amount  -- Add discounted_amount field
              FROM insurance_claims 
              WHERE insurance_claims.user_id = :user_id
              ORDER BY insurance_claims.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':user_id', $userId);
    $stmt->execute();

    $claims = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'claims' => $claims]);
} else {
    echo json_encode(['success' => false, 'message' => 'User ID is required']);
}
?>
