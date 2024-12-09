<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id)) {
    $query = "SELECT * FROM appointments WHERE user_id = :user_id ORDER BY date_time ASC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->execute();

    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($appointments);
} else {
    echo json_encode(["message" => "Incomplete data."]);
}
?>
