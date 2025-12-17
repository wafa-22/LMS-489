<?php
require "db.php";
session_start();

$d = json_decode(file_get_contents("php://input"), true);
$book_id = intval($d["book_id"] ?? 0);
$user_id = $_SESSION["user_id"] ?? 1;

$q = $conn->prepare("SELECT available_copies FROM books WHERE book_id=?");
$q->bind_param("i", $book_id);
$q->execute();
$r = $q->get_result()->fetch_assoc();

if ($r["available_copies"] <= 0) {
  echo json_encode(["status"=>"error","message"=>"No copies"]);
  exit;
}

$conn->query("UPDATE books SET available_copies = available_copies - 1 WHERE book_id=$book_id");

$today = date("Y-m-d");
$due = date("Y-m-d", strtotime("+7 days"));

$ins = $conn->prepare("
  INSERT INTO borrowings(user_id, book_id, borrow_date, due_date)
  VALUES (?,?,?,?)
");
$ins->bind_param("iiss", $user_id, $book_id, $today, $due);
$ins->execute();

echo json_encode(["status"=>"success","message"=>"Borrowed"]);
