<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// SQL query to fetch patient data, excluding the admin role
$query = "SELECT 
            id, 
            first_name, 
            last_name, 
            username, 
            contact_number, 
            date_of_birth, 
            medical_history, 
            role, 
            billing_address, 
            city, 
            province, 
            billing_postal_code, 
            created_at,
            card_first_name,
            card_last_name,
            card_number,
            card_expiry
          FROM users 
          WHERE role != 'admin' 
          ORDER BY created_at DESC";

$stmt = $db->prepare($query);

try {
    // Execute the query
    $stmt->execute();
    
    // Fetch the result as an associative array
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if any users were found
    if ($users) {
        echo json_encode(["users" => $users]);
    } else {
        // If no users found, return a message
        echo json_encode(["message" => "No users found"]);
    }
} catch (PDOException $e) {
    // Handle any errors during query execution
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
