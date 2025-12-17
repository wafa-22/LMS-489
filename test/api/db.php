<?php
$host="localhost";
$user="root";
$password="Root@1234#";
$dbname="library_lms";

$conn=new mysqli($host,$user,$password,$dbname);
if($conn->connect_error){die("DB Error");}
$conn->set_charset("utf8mb4");
