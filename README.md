# Website Manajemen Transaksi Laundry - Kelompok 1

## 1. Nama Project
**Website Manajemen Transaksi Laundry**

## 2. Nama Kelompok & Anggota
**Kelompok 1**

| Nama Anggota | NIM | Jobdesk / Peran |
| :--- | :--- | :--- |
| **Dian Agus Saputra** | 701230019 | **Lead Developer:** Bertanggung jawab pada pengembangan Back-End (logika PHP), implementasi koneksi database MySQL, konfigurasi API transaksi, serta melakukan deployment website ke hosting server. |
| **M. Iqbal** | 701230046 | **System Analyst & Designer:** Bertanggung jawab merancang seluruh Design sistem dalam SRS meliputi Use Case, ERD, Class Diagram, Sequence Diagram, dan Activity Diagram. |
| **David Ardi Nugraha** | 701230013 | **Tester & Dokumentasi:** Bertanggung jawab menyusun Bab 1-3 pada dokumen SRS, melakukan User Acceptance Testing (UAT) untuk memastikan fitur berjalan sesuai kebutuhan, serta menyusun slide presentasi (PPT). |
| **Nazaruddin** | 701220274 | **Data Administrator:** Bertanggung jawab menginput data sampel pelanggan dan layanan ke dalam database untuk persiapan demonstrasi, serta menyusun Bab 5 pada dokumen SRS (kebutuhan non-fungsional). |

## 3. Deskripsi Singkat Aplikasi
Website Manajemen Transaksi Laundry adalah aplikasi berbasis web yang dirancang untuk membantu pemilik usaha laundry dalam mengelola operasional pencucian. Sistem ini mengintegrasikan pencatatan pesanan, pengelolaan data pelanggan, manajemen jenis layanan, hingga pembuatan struk dan laporan keuangan sederhana dalam satu platform digital.

## 4. Tujuan Sistem / Permasalahan yang Diselesaikan
Aplikasi ini dibangun dengan tujuan:
* **Efisiensi:** Menggantikan pencatatan manual menjadi digital untuk mengurangi risiko kehilangan data.
* **Akurasi:** Meminimalisir kesalahan perhitungan biaya transaksi dengan sistem hitung otomatis.
* **Dokumentasi:** Memastikan seluruh riwayat transaksi dan data pelanggan tersimpan rapi dan mudah dicari.
* **Pelayanan:** Mempercepat proses pelayanan dengan adanya fitur estimasi waktu selesai dan cetak struk otomatis.

## 5. Teknologi yang Digunakan
Aplikasi ini dikembangkan menggunakan arsitektur 3-tier (Presentation, Logical, Database Layer) dengan teknologi berikut:
* **Bahasa Pemrograman (Backend):** PHP (Native)
* **Basis Data:** MySQL
* **Frontend:** HTML, CSS, JavaScript (Vanilla)
* **Library Ikon:** Phosphor Icons
* **Server Environment:** Laragon

## 6. Cara Menjalankan Aplikasi

### a. Persiapan (Instalasi)
1.  Pastikan aplikasi **Laragon** sudah terinstall.
2.  Clone repository ini atau download folder project.
3.  Pindahkan folder project ke dalam direktori `www` di Laragon (biasanya di `C:/laragon/www/nama_folder_laundry`).

### b. Konfigurasi Database
1.  Buka aplikasi **Laragon** dan klik tombol **Start All**.
2.  Klik tombol **Database** untuk membuka phpMyAdmin.
3.  Buat database baru dengan nama: `laundry_db` (sesuai konfigurasi di file `koneksi.php`).
4.  Import file database SQL yang disertakan dalam repository ini, misalnya `database.sql` ke dalam database yang baru dibuat.

### c. Menjalankan Project
1.  Buka browser (Chrome/Edge).
2.  Jika fitur *Auto Virtual Hosts* Laragon aktif, akses: `http://nama_folder_laundry.test`.
3.  Atau akses menggunakan Localhost biasa: `http://localhost/nama_folder_laundry`.
4.  Halaman Login akan muncul.

## 7. Akun Demo
Gunakan kredensial berikut untuk masuk sebagai Admin:
* **Username/Email:** `admin@laundry.com`
* **Password:** `12345`
*(Catatan: Pastikan data user ini sudah ada di tabel `users` pada database yang diimport)*.

## 8. Link Deployment
* **Link Deployment:** https://projectakhirmanajemenlaundry.wuaze.com/dashboard.html

## 9. Screenshot Halaman Utama

![Dashboard Manajemen Laundry](img/dashboard-screenshot.png)
*Tampilan Dashboard Utama*

## 10. Catatan Tambahan
Beberapa hal mengenai batasan sistem ini berdasarkan SRS:
* **Platform:** Aplikasi ini berbasis Web Desktop, belum tersedia versi Mobile (Android/iOS).
* **Integrasi Hardware:** Sistem belum terintegrasi dengan Barcode Scanner atau Printer Thermal otomatis.
* **Online Booking:** Tidak ada fitur booking online oleh pelanggan; semua input dilakukan oleh Admin/Kasir.

## 11. Keterangan Tugas
Project ini ditujukan untuk memenuhi **Tugas Final Project Mata Kuliah Rekayasa Perangkat Lunak**.

* **Dosen Pengampu:** Ibu Dila Nurlaila, M.Kom
* **Program studi:** Sistem Informasi
* **Fakultas:** Sains dan Teknologi
* **Universitas:** UIN Sultan Thaha Saifuddin Jambi