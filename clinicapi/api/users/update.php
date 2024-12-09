<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->medical_records)) {
    $query = "UPDATE users SET medical_records = :medical_records WHERE id = :user_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":medical_records", $data->medical_records);
    $stmt->bindParam(":user_id", $data->user_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "User details updated successfully."]);
    } else {
        echo json_encode(["message" => "Failed to update user details."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
