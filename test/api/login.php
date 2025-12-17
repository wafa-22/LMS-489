<?php
require "db.php";
session_start();
$d=json_decode(file_get_contents("php://input"),true);
$email=$d["email"]??"";
$pass=$d["password"]??"";

if(!$email||!$pass){
 echo json_encode(["status"=>"error","message"=>"Email and password required"]); exit;
}

$q=$conn->prepare("SELECT * FROM users WHERE email=?");
$q->bind_param("s",$email);
$q->execute();
$r=$q->get_result();

if($r->num_rows==1){
 $u=$r->fetch_assoc();
 if(password_verify($pass,$u["password"])){
   $_SESSION["user_id"]=$u["id"];
   echo json_encode(["status"=>"success"]);
 }else echo json_encode(["status"=>"error","message"=>"Wrong password"]);
}else echo json_encode(["status"=>"error","message"=>"User not found"]);
