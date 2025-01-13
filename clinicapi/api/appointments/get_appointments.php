<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include_once '../../config/database.php';

$database = new Database();
$conn = $database->getConnection();

// Get parameters from query string
$role = isset($_GET['role']) ? $_GET['role'] : null;
$id = isset($_GET['id']) ? $_GET['id'] : null;
$appointmentId = isset($_GET['appointmentId']) ? $_GET['appointmentId'] : null;  // New parameter for appointmentId

try {
    // Admin role - fetch all appointments
    if ($role === 'admin') {
        $query = "SELECT 
                    appointments.id, 
                    appointments.user_id, 
                    appointments.username, 
                    DATE_FORMAT(appointments.date, '%Y-%m-%d') AS date, 
                    appointments.time, 
                    appointments.description, 
                    appointments.status, 
                    appointments.service, 
                    appointments.payment_status, 
                    appointments.refund_status, 
                    appointments.bill_amount, 
                    appointments.invoice_generated,
                    insurance_claims.discounted_amount  -- Fetch the discounted_amount from insurance_claims table
                  FROM appointments 
                  LEFT JOIN insurance_claims ON appointments.id = insurance_claims.appointment_id
                  ORDER BY appointments.date ASC, appointments.time ASC";
        $stmt = $conn->prepare($query);
    } 
    // User role - fetch appointments for a specific user
    elseif ($role === 'user' && $id) {
        if ($appointmentId) {
            // If appointmentId is provided, fetch that specific appointment
            $query = "SELECT 
                        appointments.id, 
                        appointments.user_id, 
                        appointments.username, 
                        DATE_FORMAT(appointments.date, '%Y-%m-%d') AS date, 
                        appointments.time, 
                        appointments.description, 
                        appointments.status, 
                        appointments.service, 
                        appointments.payment_status, 
                        appointments.refund_status, 
                        appointments.bill_amount, 
                        appointments.invoice_generated,
                        insurance_claims.discounted_amount  -- Fetch the discounted_amount from insurance_claims table
                      FROM appointments 
                      LEFT JOIN insurance_claims ON appointments.id = insurance_claims.appointment_id
                      WHERE appointments.user_id = :id AND appointments.id = :appointmentId
                      ORDER BY appointments.date ASC, appointments.time ASC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':appointmentId', $appointmentId, PDO::PARAM_INT);
        } else {
            // Fetch all appointments for the user if appointmentId is not provided
            $query = "SELECT 
                        appointments.id, 
                        appointments.user_id, 
                        appointments.username, 
                        DATE_FORMAT(appointments.date, '%Y-%m-%d') AS date, 
                        appointments.time, 
                        appointments.description, 
                        appointments.status, 
                        appointments.service, 
                        appointments.payment_status, 
                        appointments.refund_status, 
                        appointments.bill_amount, 
                        appointments.invoice_generated,
                        insurance_claims.discounted_amount  -- Fetch the discounted_amount from insurance_claims table
                      FROM appointments 
                      LEFT JOIN insurance_claims ON appointments.id = insurance_claims.appointment_id
                      WHERE appointments.user_id = :id 
                      ORDER BY appointments.date ASC, appointments.time ASC";
            $stmt = $conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        }
    } 
    else {
        echo json_encode(["error" => "Role or User ID not provided."]);
        exit;
    }

    $stmt->execute();
    $appointments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Admin-specific processing if needed
    if ($role === 'admin') {
        $appointments = array_map(function($appt) {
            if ($appt['payment_status'] === 'paid' && $appt['status'] !== 'approved') {
                $appt['status'] = 'pending';
            }
            return $appt;
        }, $appointments);
    }

    echo json_encode(["appointments" => $appointments]);

} catch (Exception $e) {
    echo json_encode(["error" => "Unable to fetch appointments.", "details" => $e->getMessage()]);
}
?>
