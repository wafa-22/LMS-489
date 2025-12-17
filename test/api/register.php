<?php
require "db.php";

$d = json_decode(file_get_contents("php://input"), true);
$hash = password_hash($d["password"], PASSWORD_DEFAULT);

$q = $conn->prepare("
  INSERT INTO users(full_name,email,password_hash)
  VALUES (?,?,?)
");
$q->bind_param("sss", $d["name"], $d["email"], $hash);
$q->execute();

echo json_encode(["status"=>"success"]);
