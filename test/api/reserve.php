<?php
require "db.php";
$d=json_decode(file_get_contents("php://input"),true);
$id=$d["book_id"]??0;
$conn->query("UPDATE books SET status='reserved' WHERE id=$id");
echo json_encode(["status"=>"success"]);
