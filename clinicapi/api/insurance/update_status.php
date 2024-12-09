<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->claim_id) && !empty($data->status)) {
    $query = "UPDATE insurance_claims SET status = :status WHERE id = :claim_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":claim_id", $data->claim_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Claim status updated successfully."]);
    } else {
        echo json_encode(["message" => "Failed to update claim status."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
