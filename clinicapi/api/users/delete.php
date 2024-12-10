<?php
include_once '../../config/database.php';

// Create a new database connection
$database = new Database();
$db = $database->getConnection();

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"));

// Check if the user_id is provided in the request
if (!empty($data->user_id)) {
    try {
        // Prepare the DELETE query to remove the user
        $query = "DELETE FROM users WHERE id = :user_id";
        $stmt = $db->prepare($query);

        // Bind the user_id to the query
        $stmt->bindParam(":user_id", $data->user_id, PDO::PARAM_INT);

        // Execute the query
        if ($stmt->execute()) {
            // Check if any rows were affected (i.e., if the user was found and deleted)
            if ($stmt->rowCount() > 0) {
                echo json_encode(["success" => true, "message" => "User deleted successfully."]);
            } else {
                echo json_encode(["success" => false, "message" => "User not found."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Failed to delete user."]);
        }
    } catch (PDOException $e) {
        // Handle errors and exceptions
        echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Incomplete data. User ID is required."]);
}
?>
