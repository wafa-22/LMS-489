<?php
require "db.php";
session_start();

$d = json_decode(file_get_contents("php://input"), true);
$book_id = intval($d["book_id"] ?? 0);
$user_id = $_SESSION["user_id"] ?? 1;

$chk = $conn->prepare("
  SELECT reservation_id FROM reservations
  WHERE user_id=? AND book_id=? AND status='active'
");
$chk->bind_param("ii", $user_id, $book_id);
$chk->execute();
if ($chk->get_result()->num_rows > 0) {
  echo json_encode(["status"=>"error","message"=>"Already reserved"]);
  exit;
}

$today = date("Y-m-d");
$ins = $conn->prepare("
  INSERT INTO reservations(user_id, book_id, reservation_date)
  VALUES (?,?,?)
");
$ins->bind_param("iis", $user_id, $book_id, $today);
$ins->execute();

echo json_encode(["status"=>"success","message"=>"Reserved"]);
