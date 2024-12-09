<?php

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->date) && !empty($data->time)) {
    $query = "INSERT INTO appointments (user_id, date, time) VALUES (:user_id, :date, :time)";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":date", $data->date);
    $stmt->bindParam(":time", $data->time);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Appointment created successfully."]);
    } else {
        echo json_encode(["message" => "Failed to create appointment."]);
    }
} else {
    echo json_encode(["message" => "Incomplete data."]);
}

?>
