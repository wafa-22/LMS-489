<?php
require "db.php";
$r=$conn->query("SELECT * FROM books");
$out=[];
while($row=$r->fetch_assoc()){$out[]=$row;}
echo json_encode($out);
