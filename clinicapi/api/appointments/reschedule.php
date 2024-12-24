<?php
// reschedule.php

include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $appointment_id = $_POST['appointment_id'];
    $new_slot = $_POST['new_slot']; // New slot details (date and time)

    // Reschedule logic (this could be updating the appointment time and status)
    $sql = "UPDATE appointments SET date = '$new_slot[date]', time = '$new_slot[time]' WHERE id = $appointment_id";

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['success' => true, 'message' => 'Appointment rescheduled successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Rescheduling failed.']);
    }
}
?>
