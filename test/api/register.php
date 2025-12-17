<?php
require "db.php";
$d=json_decode(file_get_contents("php://input"),true);
$name=$d["name"]??"";
$email=$d["email"]??"";
$pass=$d["password"]??"";

if(!$name||!$email||!$pass){
 echo json_encode(["status"=>"error","message"=>"All fields required"]); exit;
}

$hash=password_hash($pass,PASSWORD_DEFAULT);
$q=$conn->prepare("INSERT INTO users(name,email,password) VALUES(?,?,?)");
$q->bind_param("sss",$name,$email,$hash);
$q->execute();
echo json_encode(["status"=>"success"]);
