# Private Link Vault - Multi-User Role-Based System

Sistem manajemen link pribadi yang aman, berbasis peran (role), dan dikelola sepenuhnya melalui skrip Python. Data akun dan link disimpan dalam satu file `config.json` yang di-deploy bersama situs.

**⚠️ PENTING: Karena data sensitif disimpan di `config.json`, pastikan repositori GitHub Anda **BERSIFAT PRIVATE**.**

## Fitur Utama

- **Manajemen Offline:** Semua penambahan akun, link, dan perubahan dilakukan melalui terminal dengan skrip Python.
- **Berbasis Peran (Role-Based Access Control):**
    - **Administrator:** Akses penuh, dapat membuat akun dan melihat semua link.
    - **Level (Dinkes):** Dapat melihat semua link yang ditujukan untuk Puskesmas.
    - **Level Puskesmas:** Hanya dapat melihat link yang ditugaskan secara spesifik untuk akun mereka.
- **Keamanan:** Passphrase di-hash menggunakan PBKDF2 dengan salt yang unik untuk setiap akun.
- **Frontend Read-Only:** Antarmuka web yang bersih dan modern hanya untuk menampilkan link, tanpa kemampuan mengubah data.
- **Link Bersama:** Satu link dapat ditugaskan ke beberapa akun sekaligus.
- **Responsif & Modern:** Desain elegan dengan efek glassmorphism, animasi halus, dan mode gelap.

## Alur Kerja

1.  **Admin** menjalankan skrip Python di komputer lokal mereka untuk:
    -   Membuat akun baru (`--account`).
    -   Menambahkan link dan menugaskannya ke akun (`--link`).
    -   Mengubah passphrase pengguna (`--change-passphrase`).
2.  **Admin** meng-commit file `config.json` yang telah diperbarui ke repositori Git.
3.  **GitHub Actions** otomatis men-deploy perubahan ke GitHub Pages.
4.  **Pengguna** (Puskesmas/Dinkes) masuk ke situs web dengan username dan passphrase mereka untuk melihat link yang telah ditugaskan.

## Cara Penggunaan

### 1. Setup Awal (Hanya sekali)

Buka terminal di direktori proyek dan jalankan:

```bash
python3 generate_key.py --init