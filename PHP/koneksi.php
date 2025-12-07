<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

$host = "sql312.infinityfree.com";
$user = "if0_40495976";
$pass = "R6FCdG09uFD3k";
$db   = "if0_40495976_laundry";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Koneksi Database Gagal: " . $conn->connect_error]));
}
?>