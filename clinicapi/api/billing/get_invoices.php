<?php
// Include your database connection file
include_once '../../config/database.php';

// Create a new Database object and get the connection
$database = new Database();
$conn = $database->getConnection();  // Use the PDO connection

// Fetch invoices for a specific user (optional filter by user_id)
$sql = "SELECT id, user_id, description, status, created_at FROM invoices";
$stmt = $conn->prepare($sql);  // Use PDO's prepare method
$stmt->execute();  // Execute the query

$invoices = [];
if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $invoices[] = $row;
    }
}

// Set the response header to JSON
header('Content-Type: application/json');
echo json_encode($invoices);

// Close the connection
$conn = null;
?>
