<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id)) {
    $query = "DELETE FROM users WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "User deleted successfully."]);
    } else {
        echo json_encode(["message" => "Failed to delete user."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
