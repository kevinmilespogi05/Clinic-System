<?php
include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->userId)) {
    try {
        $userId = htmlspecialchars(strip_tags($data->userId));

        // Query to get invoices by user ID
        $query = "SELECT id, description, status, created_at FROM invoices WHERE user_id = :user_id";

        $stmt = $conn->prepare($query);
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();

        $invoices = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $invoices[] = [
                'id' => $row['id'],
                'description' => $row['description'],
                'status' => $row['status'],
                'created_at' => $row['created_at'],
            ];
        }

        header('Content-Type: application/json');
        echo json_encode($invoices);
    } catch (Exception $e) {
        echo json_encode(["message" => "Error fetching invoices: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["message" => "User ID is required"]);
}

$conn = null;
?>
