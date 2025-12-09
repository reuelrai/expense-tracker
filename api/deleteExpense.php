<?php
header('Content-Type: application/json');

session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error']);
    exit;
}

$id = $_GET['id'] ?? 0;
$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM expenses WHERE id=? AND user_id=?");
$stmt->bind_param("ii", $id, $user_id);
$stmt->execute();
echo json_encode(['status' => 'success']);
$stmt->close();
$conn->close();
?>