<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->invoice_id) && !empty($data->status)) {
    $query = "UPDATE invoices SET status = :status WHERE id = :invoice_id";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":status", $data->status);
    $stmt->bindParam(":invoice_id", $data->invoice_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Invoice updated successfully."]);
    } else {
        echo json_encode(["message" => "Failed to update invoice."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
