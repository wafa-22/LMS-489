<?php
require "db.php";

$title = trim($_POST["title"] ?? "");
$author = trim($_POST["author"] ?? "");
$isbn = trim($_POST["isbn"] ?? "");
$year = intval($_POST["publication_year"] ?? 0);
$category = trim($_POST["category"] ?? "");
$total = intval($_POST["total_copies"] ?? 1);

if ($title=="" || $author=="" || $isbn=="" || $category=="") {
  echo json_encode(["status"=>"error","message"=>"Missing data"]);
  exit;
}

$q = $conn->prepare("SELECT category_id FROM categories WHERE name=?");
$q->bind_param("s", $category);
$q->execute();
$r = $q->get_result();

if ($r->num_rows == 1) {
  $catId = $r->fetch_assoc()["category_id"];
} else {
  $ins = $conn->prepare("INSERT INTO categories(name) VALUES(?)");
  $ins->bind_param("s", $category);
  $ins->execute();
  $catId = $conn->insert_id;
}

$img = null;
if (!empty($_FILES["image"]["name"])) {
  $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
  $img = "book_" . time() . "." . $ext;
  move_uploaded_file($_FILES["image"]["tmp_name"], "../images/$img");
}

$avail = $total;

$stmt = $conn->prepare("
  INSERT INTO books
  (title, author, isbn, publication_year, category_id, total_copies, available_copies, image)
  VALUES (?,?,?,?,?,?,?,?)
");
$stmt->bind_param("sssiiiis", $title, $author, $isbn, $year, $catId, $total, $avail, $img);
$stmt->execute();

echo json_encode(["status"=>"success"]);
