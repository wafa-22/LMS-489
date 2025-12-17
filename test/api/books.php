<?php
require "db.php";

$id = intval($_GET["id"] ?? 0);

if ($id > 0) {
  $q = $conn->prepare("
    SELECT b.*, c.name AS category
    FROM books b
    LEFT JOIN categories c ON b.category_id = c.category_id
    WHERE b.book_id = ?
  ");
  $q->bind_param("i", $id);
  $q->execute();
  echo json_encode($q->get_result()->fetch_assoc());
  exit;
}

$res = $conn->query("
  SELECT b.book_id, b.title, b.author, b.image
  FROM books b
  ORDER BY b.book_id DESC
");

$data = [];
while ($r = $res->fetch_assoc()) $data[] = $r;
echo json_encode($data);
