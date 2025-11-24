<?php
include 'koneksi.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    $sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Login Berhasil"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Email atau Password salah"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
}
$conn->close();
?>