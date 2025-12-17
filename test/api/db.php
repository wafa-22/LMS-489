<?php
header("Content-Type: application/json; charset=UTF-8");

$conn = new mysqli("localhost", "root", "", "library_lms");
if ($conn->connect_error) {
  echo json_encode(["status"=>"error","message"=>"DB error"]);
  exit;
}
$conn->set_charset("utf8mb4");
