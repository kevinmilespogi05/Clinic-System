<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$query = "SELECT appointments.*, users.first_name, users.last_name 
          FROM appointments 
          JOIN users ON appointments.user_id = users.id 
          ORDER BY date DESC";

$stmt = $db->prepare($query);
$stmt->execute();

$appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(["appointments" => $appointments]);
?>
