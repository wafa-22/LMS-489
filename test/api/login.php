<?php
require "db.php";
session_start();

$d = json_decode(file_get_contents("php://input"), true);

$q = $conn->prepare("
  SELECT user_id, password_hash, role
  FROM users WHERE email=?
");
$q->bind_param("s", $d["email"]);
$q->execute();
$r = $q->get_result()->fetch_assoc();

if (!$r || !password_verify($d["password"], $r["password_hash"])) {
  echo json_encode(["status"=>"error"]);
  exit;
}

$_SESSION["user_id"] = $r["user_id"];
$_SESSION["role"] = $r["role"];

echo json_encode(["status"=>"success"]);
