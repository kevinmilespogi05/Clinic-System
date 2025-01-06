<?php
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username)) {
    $query = "SELECT * FROM users WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);

    if ($stmt->execute()) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            echo json_encode(["message" => "User not found"]);
        }
    } else {
        echo json_encode(["message" => "Failed to retrieve user"]);
    }
} else {
    echo json_encode(["message" => "Username is required"]);
}
?>
