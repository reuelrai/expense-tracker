<?php
header('Content-Type: application/json');

session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode([]);
    exit;
}

$user_id = $_SESSION['user_id'];
$result = $conn->query("SELECT * FROM expenses WHERE user_id=$user_id ORDER BY id DESC");

$expenses = [];
while ($row = $result->fetch_assoc()) {
    $expenses[] = $row;
}

echo json_encode($expenses);
$conn->close();
?>