<?php
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

// Log the received data for debugging
error_log("Received data: " . print_r($data, true));

if (isset($data->invoice_id) && isset($data->description)) {
    $invoice_id = $data->invoice_id;
    $description = $data->description;

    // Update description in the invoices table
    // Change 'invoice_id' to 'id' to match your table's column name
    $query = "UPDATE invoices SET description = :description WHERE id = :invoice_id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':invoice_id', $invoice_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Invoice description updated successfully"]);
    } else {
        echo json_encode(["message" => "Failed to update invoice description"]);
    }
} else {
    echo json_encode(["message" => "Invalid input data"]);
}
?>
