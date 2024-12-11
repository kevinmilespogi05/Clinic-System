<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (isset($data->user_id) && !empty($data->user_id)) {
    try {
        // Prepare the query to fetch invoices based on the user ID
        $query = "SELECT * FROM invoices WHERE user_id = :user_id ORDER BY created_at DESC";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":user_id", $data->user_id, PDO::PARAM_INT);  // Ensure user_id is treated as an integer
        $stmt->execute();

        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Check if invoices are found
        if ($invoices) {
            // Return invoices data as JSON response
            echo json_encode($invoices);
        } else {
            // Return a message if no invoices found for the user
            echo json_encode(["message" => "No invoices found for this user."]);
        }
    } catch (Exception $e) {
        // Handle any error that might occur during the query execution
        echo json_encode(["message" => "Error fetching invoices: " . $e->getMessage()]);
    }
} else {
    // Error response if user_id is missing or invalid
    echo json_encode(["message" => "Incomplete data. User ID is required."]);
}
?>
