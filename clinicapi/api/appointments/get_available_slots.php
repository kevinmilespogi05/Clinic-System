<?php
// Include the database connection file using absolute path
include_once(__DIR__ . '/../../config/database.php');

// Create a new database connection
$database = new Database();
$db = $database->getConnection();

// Get the selected date from the GET request
if (isset($_GET['date'])) {
    $date = $_GET['date'];
} else {
    echo json_encode(["error" => "Date is required"]);
    exit;
}

// Prepare SQL query to fetch available slots for the given date
$query = "SELECT time FROM appointments WHERE date = :date AND status = 'pending'";

// Prepare the statement
$stmt = $db->prepare($query);
$stmt->bindParam(':date', $date);

// Execute the query
$stmt->execute();

// Fetch the booked times for the selected date
$bookedTimes = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Create an array of all possible time slots for the day
$allTimeSlots = [
    '08:00:00', '09:00:00', '10:00:00', '11:00:00', '12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00'
];

// Extract the booked times from the fetched data
$bookedTimes = array_map(function($slot) {
    return $slot['time'];
}, $bookedTimes);

// Find the available slots by removing the booked times from the list of all slots
$availableSlots = array_diff($allTimeSlots, $bookedTimes);

// Return the available slots in JSON format
echo json_encode(['slots' => array_values($availableSlots)]);
?>
