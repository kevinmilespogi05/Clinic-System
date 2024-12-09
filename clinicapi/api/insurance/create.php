<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->description)) {
    $query = "INSERT INTO insurance_claims (user_id, description) VALUES (:user_id, :description)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":description", $data->description);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Insurance claim submitted successfully."]);
    } else {
        echo json_encode(["message" => "Failed to submit insurance claim."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
