<?php
include 'koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';
$method = $_SERVER['REQUEST_METHOD'];

// 1. BAGIAN PELANGGAN (CUSTOMERS)

if ($action == 'get_customers') {
    $sql = "SELECT * FROM customers ORDER BY id DESC";
    $result = $conn->query($sql);
    $data = [];
    while($row = $result->fetch_assoc()) { $data[] = $row; }
    echo json_encode($data);
}

if ($action == 'add_customer' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $data['name'], $data['phone'], $data['address']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

if ($action == 'update_customer' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE customers SET name=?, phone=?, address=? WHERE id=?");
    $stmt->bind_param("sssi", $data['name'], $data['phone'], $data['address'], $data['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

if ($action == 'delete_customer' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $conn->query("DELETE FROM transactions WHERE customer_id=".$data['id']);
    $conn->query("DELETE FROM customers WHERE id=".$data['id']);
    echo json_encode(["status" => "success"]);
}

// 2. BAGIAN LAYANAN (SERVICES)

if ($action == 'get_services') {
    $sql = "SELECT * FROM services ORDER BY id DESC";
    $result = $conn->query($sql);
    $data = [];
    while($row = $result->fetch_assoc()) { $data[] = $row; }
    echo json_encode($data);
}

if ($action == 'add_service' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("INSERT INTO services (name, price, duration) VALUES (?, ?, ?)");
    $stmt->bind_param("sii", $data['name'], $data['price'], $data['duration']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

if ($action == 'update_service' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE services SET name=?, price=?, duration=? WHERE id=?");
    $stmt->bind_param("siii", $data['name'], $data['price'], $data['duration'], $data['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

if ($action == 'delete_service' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $conn->query("DELETE FROM services WHERE id=".$data['id']);
    echo json_encode(["status" => "success"]);
}

// 3. BAGIAN TRANSAKSI (TRANSACTIONS)

if ($action == 'get_transactions') {
    $sql = "SELECT t.*, c.name as customer_name, s.name as service_name, s.price as service_price 
            FROM transactions t 
            JOIN customers c ON t.customer_id = c.id 
            JOIN services s ON t.service_id = s.id 
            ORDER BY t.transaction_date DESC";
    $result = $conn->query($sql);
    $data = [];
    while($row = $result->fetch_assoc()) { $data[] = $row; }
    echo json_encode($data);
}

if ($action == 'add_transaction' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $pickup = date('Y-m-d H:i:s', strtotime($data['estimatedPickup'])); 
    
    $stmt = $conn->prepare("INSERT INTO transactions (customer_id, service_id, weight, total_cost, payment_method, estimated_pickup, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("iiddsss", $data['customerId'], $data['serviceId'], $data['weight'], $data['totalCost'], $data['paymentMethod'], $pickup, $data['status']);
    
    if($stmt->execute()) echo json_encode(["status" => "success", "id" => $conn->insert_id]);
    else echo json_encode(["status" => "error", "message" => $stmt->error]);
}

// UPDATE STATUS SAJA
if ($action == 'update_status' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE transactions SET status=? WHERE id=?");
    $stmt->bind_param("si", $data['status'], $data['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

// EDIT DATA TRANSAKSI (Berat & Total Harga)
if ($action == 'update_transaction_data' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("UPDATE transactions SET weight=?, total_cost=? WHERE id=?");
    $stmt->bind_param("ddi", $data['weight'], $data['totalCost'], $data['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

// HAPUS TRANSAKSI
if ($action == 'delete_transaction' && $method == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $stmt = $conn->prepare("DELETE FROM transactions WHERE id=?");
    $stmt->bind_param("i", $data['id']);
    $stmt->execute();
    echo json_encode(["status" => "success"]);
}

$conn->close();
?>