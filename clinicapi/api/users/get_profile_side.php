<?php
// Include database connection
require_once '../../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

$database = new Database();
$pdo = $database->getConnection();

if (isset($_GET['id'])) {
    $userId = $_GET['id'];

    try {
        // Fetching all necessary fields
        $stmt = $pdo->prepare("
            SELECT 
                id, 
                first_name, 
                last_name, 
                username, 
                contact_number, 
                date_of_birth, 
                medical_history,  
                role, 
                card_first_name, 
                card_last_name, 
                card_number, 
                card_expiry, 
                card_security_code, 
                billing_address, 
                city, 
                province, 
                billing_postal_code
            FROM users 
            WHERE id = :user_id
        ");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            echo json_encode(['success' => true, 'data' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database Error', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User ID is required.']);
}
?>
