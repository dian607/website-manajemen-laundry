// 1. Cek Login
if(localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'index.html';
}

// 2. Setup Navigasi
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('main section');

    function switchPage(targetId) {
        sections.forEach(section => {
            section.classList.remove('active-section');
            section.classList.add('hidden-section');
        });
        navLinks.forEach(nav => nav.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.classList.remove('hidden-section');
            targetSection.classList.add('active-section');
        }
        
        const activeNav = document.querySelector(`.nav-item[href="#${targetId}"]`);
        if (activeNav) activeNav.classList.add('active');
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchPage(link.getAttribute('href').substring(1));
        });
    });

    switchPage('input-transaksi');
    loadCustomers();
    loadServices();
    loadTransactions();
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
});

// FUNGSI CETAK STRUK

function cetakStruk(transaksi) {
    const printWindow = window.open('', '', 'height=600,width=400');
    const htmlContent = `
        <html>
        <head>
            <title>Struk Laundry</title>
            <style>
                body { font-family: 'Courier New', monospace; padding: 20px; text-align: center; font-size: 13px; }
                .line { border-bottom: 1px dashed #000; margin: 10px 0; }
                .text-left { text-align: left; }
                .flex { display: flex; justify-content: space-between; }
                .btn { margin-top: 20px; padding: 10px 20px; cursor: pointer; background: #eee; border: 1px solid #ddd; }
                @media print { .btn { display: none; } }
            </style>
        </head>
        <body>
            <h3>Ibaw Washing</h3>
            <p>Jl. Simpang sungai duren, KM. 16<br>WA: 0853-7014-7847</p>
            <div class="line"></div>
            <div class="flex"><span>TGL:</span> <span>${new Date().toLocaleDateString()}</span></div>
            <div class="flex"><span>PELANGGAN:</span> <span>${transaksi.customerName}</span></div>
            <div class="line"></div>
            <div class="text-left" style="margin-bottom: 5px;">
                <b>${transaksi.serviceName}</b>
            </div>
            <div class="flex">
                <span>${transaksi.weight} Kg x ${transaksi.pricePerKg}</span>
                <span>${transaksi.totalCost}</span>
            </div>
            <div class="line"></div>
            <div class="flex" style="font-weight: bold; font-size: 1.2em;">
                <span>TOTAL</span>
                <span>${transaksi.totalCost}</span>
            </div>
            <div class="line"></div>
            <p>Terima Kasih!<br>Simpan struk ini sebagai bukti.</p>
            <button class="btn" onclick="window.print()">🖨️ CETAK</button>
            <button class="btn" onclick="window.close()">TUTUP</button>
        </body>
        </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// LOGIC UTAMA (CRUD & MODAL)

const customerTableBody = document.querySelector('#customerTable tbody');
const serviceTableBody = document.querySelector('#serviceTable tbody');
const transactionTableBody = document.querySelector('#transactionTable tbody');
const reportTableBody = document.querySelector('#reportTable tbody');

let customersData = [];
let servicesData = [];

// Helper Components
function createActionButton(iconClass, btnClass, onClick, title) {
    const btn = document.createElement('button');
    btn.innerHTML = `<i class="${iconClass}"></i>`; 
    btn.className = `action-btn ${btnClass}`;
    if(title) btn.title = title;
    btn.onclick = (e) => { e.preventDefault(); onClick(); };
    return btn;
}

function getStatusTag(status) {
    let colorClass = 'status-diambil';
    if(status === 'Diterima') colorClass = 'status-diterima';
    if(status === 'Diproses') colorClass = 'status-diproses';
    if(status === 'Selesai') colorClass = 'status-selesai';
    return `<span class="status-tag ${colorClass}">${status}</span>`;
}

// MODAL SYSTEM
window.closeModal = function(modalId) {
    document.getElementById(modalId).classList.add('hidden-modal');
}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden-modal');
}
 
// 1. DATA PELANGGAN

async function loadCustomers() {
    const res = await fetch('PHP/api.php?action=get_customers');
    customersData = await res.json();
    renderCustomerTable();
    fillCustomerDropdown();
}

function renderCustomerTable() {
    customerTableBody.innerHTML = '';
    customersData.forEach(c => {
        const row = customerTableBody.insertRow();
        row.insertCell().textContent = c.name;
        row.insertCell().textContent = c.phone;
        row.insertCell().textContent = c.address;
        const action = row.insertCell();
        action.appendChild(createActionButton('ph-bold ph-pencil-simple', 'edit-btn', () => editCustomer(c), "Edit"));
        action.appendChild(createActionButton('ph-bold ph-trash', 'delete-btn', () => deleteCustomer(c.id, c.name), "Hapus"));
    });
}

function editCustomer(data) {
    document.getElementById('editCustId').value = data.id;
    document.getElementById('editCustName').value = data.name;
    document.getElementById('editCustPhone').value = data.phone;
    document.getElementById('editCustAddress').value = data.address;
    openModal('modalEditCustomer');
}

document.getElementById('formEditCustomer').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editCustId').value;
    const name = document.getElementById('editCustName').value;
    const phone = document.getElementById('editCustPhone').value;
    const address = document.getElementById('editCustAddress').value;
    await fetch('PHP/api.php?action=update_customer', { method: 'POST', body: JSON.stringify({ id, name, phone, address }) });
    alert("✅ Data Pelanggan Diupdate!");
    closeModal('modalEditCustomer');
    loadCustomers(); 
});

async function deleteCustomer(id, name) {
    if(confirm(`Yakin hapus pelanggan "${name}"?`)) {
        await fetch('PHP/api.php?action=delete_customer', { method: 'POST', body: JSON.stringify({id}) });
        loadCustomers();
        loadTransactions();
    }
}

document.getElementById('customerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const address = document.getElementById('customerAddress').value;
    await fetch('PHP/api.php?action=add_customer', { method: 'POST', body: JSON.stringify({name, phone, address}) });
    alert('Pelanggan Ditambahkan');
    document.getElementById('customerForm').reset();
    loadCustomers();
});

// 2. DATA LAYANAN
async function loadServices() {
    const res = await fetch('PHP/api.php?action=get_services');
    servicesData = await res.json();
    renderServiceTable();
    fillServiceDropdown();
}

function renderServiceTable() {
    serviceTableBody.innerHTML = '';
    servicesData.forEach(s => {
        const row = serviceTableBody.insertRow();
        row.insertCell().textContent = s.name;
        row.insertCell().textContent = `Rp ${parseInt(s.price).toLocaleString()}`;
        row.insertCell().textContent = `${s.duration} Jam`;
        const action = row.insertCell();
        action.appendChild(createActionButton('ph-bold ph-pencil-simple', 'edit-btn', () => editService(s), "Edit"));
        action.appendChild(createActionButton('ph-bold ph-trash', 'delete-btn', () => deleteService(s.id, s.name), "Hapus"));
    });
}

function editService(data) {
    document.getElementById('editServId').value = data.id;
    document.getElementById('editServName').value = data.name;
    document.getElementById('editServPrice').value = data.price;
    document.getElementById('editServDuration').value = data.duration;
    openModal('modalEditService');
}

document.getElementById('formEditService').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('editServId').value;
    const name = document.getElementById('editServName').value;
    const price = document.getElementById('editServPrice').value;
    const duration = document.getElementById('editServDuration').value;
    await fetch('PHP/api.php?action=update_service', { method: 'POST', body: JSON.stringify({ id, name, price, duration }) });
    alert("✅ Data Layanan Diupdate!");
    closeModal('modalEditService');
    loadServices();
});

async function deleteService(id, name) {
    if(confirm(`Hapus layanan "${name}"?`)) {
        await fetch('PHP/api.php?action=delete_service', { method: 'POST', body: JSON.stringify({id}) });
        loadServices();
    }
}

document.getElementById('serviceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('serviceName').value;
    const price = document.getElementById('servicePrice').value;
    const duration = document.getElementById('serviceDuration').value;
    await fetch('PHP/api.php?action=add_service', { method: 'POST', body: JSON.stringify({name, price, duration}) });
    alert('Layanan Ditambahkan');
    document.getElementById('serviceForm').reset();
    loadServices();
});


// 3. TRANSAKSI & LAPORAN (LOGIC INTI)

function fillCustomerDropdown() {
    const sel = document.getElementById('selectCustomer');
    sel.innerHTML = '<option value="">-- Pilih Pelanggan --</option>';
    customersData.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

function fillServiceDropdown() {
    const sel = document.getElementById('selectService');
    sel.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    servicesData.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} (Rp ${parseInt(s.price).toLocaleString()})`;
        sel.appendChild(opt);
    });
}

const weightInput = document.getElementById('weight');
const selectService = document.getElementById('selectService');

function calculateTotal() {
    const sId = selectService.value;
    const w = parseFloat(weightInput.value) || 0;
    const service = servicesData.find(s => s.id == sId);
    if(service) {
        const total = w * service.price;
        document.getElementById('totalCostDisplay').textContent = `Rp ${total.toLocaleString()}`;
        document.getElementById('totalCost').value = total;
        const now = new Date();
        now.setHours(now.getHours() + parseInt(service.duration));
        document.getElementById('estimatedPickupDate').textContent = now.toLocaleString('id-ID');
    }
}
selectService.addEventListener('change', calculateTotal);
weightInput.addEventListener('input', calculateTotal);

// LOAD TRANSAKSI + GENERATE LAPORAN
async function loadTransactions() {
    const res = await fetch('PHP/api.php?action=get_transactions');
    const data = await res.json();
    
    transactionTableBody.innerHTML = '';
    reportTableBody.innerHTML = '';
    
    let totalTrx = 0;
    let totalRev = 0;
    let pending = 0;

    data.forEach(t => {
        // 1. ISI TABEL RIWAYAT
        const row = transactionTableBody.insertRow();
        row.insertCell().textContent = `TRX-${t.id}`;
        row.insertCell().textContent = t.customer_name;
        row.insertCell().textContent = t.service_name;
        row.insertCell().textContent = `Rp ${parseInt(t.total_cost).toLocaleString()}`;
        row.insertCell().textContent = new Date(t.estimated_pickup).toLocaleDateString('id-ID');
        row.insertCell().innerHTML = getStatusTag(t.status);
        
        const action = row.insertCell();
        action.style.display = "flex";
        
        // Tombol Update Status (Buka Modal)
        action.appendChild(createActionButton('ph-bold ph-arrows-clockwise', 'status-btn', () => openStatusModal(t.id, t.status), "Ubah Status"));
        // Tombol Edit Berat
        action.appendChild(createActionButton('ph-bold ph-pencil-simple', 'edit-btn', () => editTransactionData(t), "Edit Berat"));
        // Tombol Hapus
        action.appendChild(createActionButton('ph-bold ph-trash', 'delete-btn', () => deleteTransaction(t.id), "Hapus"));

        // 2. HITUNG LAPORAN (Hanya yang Selesai/Diambil)
        totalTrx++; // Semua transaksi dihitung jumlahnya
        if(t.status !== 'Diambil') pending++; // Yang belum diambil
        
        if(t.status === 'Selesai' || t.status === 'Diambil') {
            // Uang masuk hanya jika status Selesai/Diambil
            totalRev += parseFloat(t.total_cost);
            
            // Masukkan ke Tabel Laporan
            const rRow = reportTableBody.insertRow();
            rRow.insertCell().textContent = new Date(t.transaction_date).toLocaleDateString();
            rRow.insertCell().textContent = `TRX-${t.id}`;
            rRow.insertCell().textContent = t.customer_name;
            rRow.insertCell().textContent = `Rp ${parseInt(t.total_cost).toLocaleString()}`;
            rRow.insertCell().textContent = t.payment_method;
        }
    });

    document.getElementById('totalTransaksiDisplay').textContent = totalTrx;
    document.getElementById('totalPendapatanDisplay').textContent = `Rp ${totalRev.toLocaleString()}`;
    document.getElementById('belumDiambilDisplay').textContent = pending;
}

// FUNGSI BUKA MODAL STATUS
function openStatusModal(id, currentStatus) {
    document.getElementById('statusTrxId').value = id;
    document.getElementById('selectNewStatus').value = currentStatus;
    openModal('modalStatus');
}

// HANDLE SIMPAN STATUS DARI MODAL
document.getElementById('formStatus').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('statusTrxId').value;
    const newStat = document.getElementById('selectNewStatus').value;
    
    await fetch('PHP/api.php?action=update_status', {
        method: 'POST', body: JSON.stringify({id, status: newStat})
    });
    
    alert(`✅ Status berhasil diubah menjadi: ${newStat}`);
    closeModal('modalStatus');
    loadTransactions(); // Otomatis refresh tabel dan laporan
});

// EDIT DATA TRANSAKSI
async function editTransactionData(t) {
    const newWeight = prompt(`Edit Berat Laundry (Kg) untuk TRX-${t.id}`, t.weight);
    if(newWeight === null) return; 

    const weightFloat = parseFloat(newWeight);
    const pricePerKg = parseFloat(t.service_price);
    
    if(isNaN(weightFloat) || weightFloat <= 0) { alert("Berat tidak valid"); return; }

    const newTotalCost = weightFloat * pricePerKg;
    if(confirm(`Berat Baru: ${weightFloat} Kg\nTotal Baru: Rp ${newTotalCost.toLocaleString()}\n\nSimpan?`)) {
        await fetch('PHP/api.php?action=update_transaction_data', {
            method: 'POST', body: JSON.stringify({ id: t.id, weight: weightFloat, totalCost: newTotalCost })
        });
        loadTransactions();
    }
}

// HAPUS TRANSAKSI
async function deleteTransaction(id) {
    if(confirm(`Hapus TRX-${id}?`)) {
        await fetch('PHP/api.php?action=delete_transaction', { method: 'POST', body: JSON.stringify({id}) });
        loadTransactions();
    }
}

// SUBMIT TRANSAKSI BARU
document.getElementById('transactionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        customerId: document.getElementById('selectCustomer').value,
        serviceId: document.getElementById('selectService').value,
        weight: document.getElementById('weight').value,
        totalCost: document.getElementById('totalCost').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        estimatedPickup: new Date().toISOString(),
        status: 'Diterima' 
    };
    
    const custSelect = document.getElementById('selectCustomer');
    const servSelect = document.getElementById('selectService');
    const custName = custSelect.options[custSelect.selectedIndex].text;
    const servName = servSelect.options[servSelect.selectedIndex].text.split(' (')[0];
    const servData = servicesData.find(s => s.id == payload.serviceId);
    
    await fetch('PHP/api.php?action=add_transaction', { method: 'POST', body: JSON.stringify(payload) });
    
    const strukData = {
        customerName: custName,
        serviceName: servName,
        weight: payload.weight,
        pricePerKg: servData ? parseInt(servData.price).toLocaleString() : 0,
        totalCost: document.getElementById('totalCostDisplay').textContent
    };

    cetakStruk(strukData);
    loadTransactions();
    document.getElementById('transactionForm').reset();
    document.getElementById('totalCostDisplay').textContent = "Rp 0";
});