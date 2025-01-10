<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT id, type, amount, date, status FROM transactions ORDER BY date DESC";
$stmt = $db->prepare($query);
$stmt->execute();

$transactions = [];
if ($stmt->rowCount() > 0) {
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $transactions[] = $row;
    }
}

// Set the response header to JSON
header('Content-Type: application/json');
echo json_encode($transactions);

// Close the connection
$conn = null;
?>