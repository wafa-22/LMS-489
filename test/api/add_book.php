<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"] ?? "";
$author = $data["author"] ?? "";
$category = $data["category"] ?? "";
$year = $data["year"] ?? "";
$image = $data["image"] ?? "";

if (!$title || !$author) {
    echo json_encode(["status"=>"error","message"=>"Missing fields"]);
    exit;
}

$stmt = $conn->prepare(
  "INSERT INTO books(title, author, publication_year, image) VALUES (?,?,?,?)"
);
$stmt->bind_param("ssis", $title, $author, $year, $image);
$stmt->execute();

echo json_encode(["status"=>"success"]);
