<?php
$host = "localhost";
$user = "root";     // default XAMPP MySQL username
$pass = "";         // default password is empty
$db = "expense_tracker";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
