// js/main.js - VERSI PHP/MYSQL

const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Cek apakah sudah login sebelumnya 
if(localStorage.getItem('isLoggedIn') === 'true') {
    window.location.href = 'dashboard.html';
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    
    errorMessage.textContent = ''; 
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.disabled = true;
    loginBtn.textContent = 'Memproses...';

    // Panggil API PHP Login
    fetch('PHP/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log("Login Berhasil");
            localStorage.setItem('isLoggedIn', 'true'); // Simpan status login
            window.location.href = 'dashboard.html';
        } else {
            throw new Error(data.message);
        }
    })
    .catch((error) => {
        console.error("Login Gagal:", error);
        errorMessage.textContent = "❌ " + error.message;
    })
    .finally(() => {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    });
});