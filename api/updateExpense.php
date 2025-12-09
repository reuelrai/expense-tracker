<?php
header('Content-Type: application/json');

include 'db.php';

$id = $_POST['id'] ?? null;
$title = $_POST['title'] ?? null;
$amount = $_POST['amount'] ?? null;
$category = $_POST['category'] ?? null;

if (!$id || !$title || !$amount) { http_response_code(400); echo json_encode(['error'=>'Missing fields']); exit; }

$stmt = $conn->prepare("UPDATE expenses SET title = ?, amount = ?, category = ? WHERE id = ?");
$stmt->bind_param("sdsi", $title, $amount, $category, $id);
$stmt->execute();
echo json_encode(['success' => true]);
$stmt->close();
$conn->close();
?>
