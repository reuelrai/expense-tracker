<?php
header('Content-Type: application/json');

session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];
$title = trim($_POST['title'] ?? '');
$amount = floatval($_POST['amount'] ?? 0);
$category = trim($_POST['category'] ?? '');


$stmt = $conn->prepare("INSERT INTO expenses (user_id,title,amount,category) VALUES (?,?,?,?)");
$stmt->bind_param("isds", $user_id, $title, $amount, $category);
if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error']);
}
$stmt->close();
$conn->close();
?>