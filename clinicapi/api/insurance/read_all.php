<?php
// read_all.php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Assuming you get userId and isAdmin from the query string
$userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
$isAdmin = isset($_GET['is_admin']) ? $_GET['is_admin'] : null;

if ($isAdmin == 1) {
    // Admin can see all claims
    $query = "SELECT 
        insurance_claims.id, 
        users.username, 
        insurance_claims.description, 
        insurance_claims.status, 
        insurance_claims.created_at 
    FROM insurance_claims 
    JOIN users ON insurance_claims.user_id = users.id 
    ORDER BY insurance_claims.created_at DESC";
} else {
    // Regular user can only see their own claims
    $query = "SELECT 
        insurance_claims.id, 
        users.username, 
        insurance_claims.description, 
        insurance_claims.status, 
        insurance_claims.created_at 
    FROM insurance_claims 
    JOIN users ON insurance_claims.user_id = users.id 
    WHERE insurance_claims.user_id = :user_id
    ORDER BY insurance_claims.created_at DESC";
}

$stmt = $db->prepare($query);

// Bind user_id parameter for regular users
if ($isAdmin == 0) {
    $stmt->bindParam(":user_id", $userId);
}

$stmt->execute();

$claims = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($claims);

?>