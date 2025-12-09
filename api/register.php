<?php
header('Content-Type: application/json');

session_start();
include 'db.php';

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

if (!$username || !$email || !$password) {
    echo json_encode(['status' => 'error', 'message' => 'All fields required']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username,email,password) VALUES (?,?,?)");
$stmt->bind_param("sss", $username, $email, $hash);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Email may already exist']);
}
$stmt->close();
$conn->close();
?>