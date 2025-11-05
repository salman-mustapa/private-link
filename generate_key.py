# generate_key.py
import hashlib
import secrets
import json
import argparse
import getpass
import os
import requests

CONFIG_FILE = 'config.json'

def load_config():
    """Load configuration from file or create a new one."""
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, 'r') as f:
            return json.load(f)
    return {
        "masterCredentials": {},
        "accounts": [],
        "links": []
    }

def save_config(config):
    """Save configuration to file."""
    with open(CONFIG_FILE, 'w') as f:
        json.dump(config, f, indent=2)

def generate_salt():
    """Generate a random salt."""
    return secrets.token_hex(16)

def hash_data(data, salt, iterations=200000):
    """Derive a hash from data using PBKDF2."""
    return hashlib.pbkdf2_hmac(
        'sha256',
        data.encode('utf-8'),
        bytes.fromhex(salt),
        iterations
    ).hex()

def initialize_master_admin():
    """Interactively create the first administrator account."""
    print("--- Inisialisasi Administrator Pertama ---")
    config = load_config()
    if any(acc['role'] == 'administrator' for acc in config['accounts']):
        print("Akun administrator sudah ada.")
        return

    account_id = input("Masukkan ID Administrator (contoh: admin-01): ").strip()
    account_name = input("Masukkan Nama Akun: ").strip()
    username = input("Masukkan Username: ").strip()
    
    passphrase = getpass.getpass("Masukkan Passphrase: ")
    confirm_passphrase = getpass.getpass("Konfirmasi Passphrase: ")

    if passphrase != confirm_passphrase:
        print("Error: Passphrase tidak cocok.")
        return

    salt = generate_salt()
    passphrase_hash = hash_data(passphrase, salt)
    username_hash = hash_data(username, salt)

    new_account = {
        "id": account_id,
        "role": "administrator",
        "account_name": account_name,
        "username_hash": username_hash,
        "passphrase_hash": passphrase_hash,
        "salt": salt
    }
    
    config['accounts'].append(new_account)
    save_config(config)
    print(f"\n✅ Akun administrator '{account_name}' berhasil dibuat.")

def add_account_interactive():
    """Interactively add a new user account."""
    print("\n--- Tambah Akun Baru ---")
    config = load_config()

    # Get role
    print("Pilih role akun:")
    print("1. administrator")
    print("2. dinkes")
    print("3. puskesmas")
    role_choice = input("Masukkan pilihan (1-3): ").strip()
    role_map = {'1': 'administrator', '2': 'dinkes', '3': 'puskesmas'}
    role = role_map.get(role_choice)

    if not role:
        print("Error: Pilihan role tidak valid.")
        return

    # Get ID
    account_id = input("Masukkan ID unik untuk akun (contoh: puskesmas-01): ").strip()
    if any(acc['id'] == account_id for acc in config['accounts']):
        print(f"Error: Akun dengan ID '{account_id}' sudah ada.")
        return

    # Get name
    account_name = input("Masukkan Nama Akun: ").strip()

    # Get credentials
    username = getpass.getpass("Masukkan Username: ")
    passphrase = getpass.getpass("Masukkan Passphrase: ")
    confirm_passphrase = getpass.getpass("Konfirmasi Passphrase: ")

    if passphrase != confirm_passphrase:
        print("Error: Passphrase tidak cocok.")
        return

    salt = generate_salt()
    passphrase_hash = hash_data(passphrase, salt)
    username_hash = hash_data(username, salt)

    new_account = {
        "id": account_id,
        "role": role,
        "account_name": account_name,
        "username_hash": username_hash,
        "passphrase_hash": passphrase_hash,
        "salt": salt
    }
    
    config['accounts'].append(new_account)
    save_config(config)
    print(f"\n✅ Akun '{account_name}' dengan role '{role}' berhasil dibuat.")

def add_link_interactive():
    """Interactively add a new link and assign it to accounts."""
    print("\n--- Tambah Link Baru ---")
    config = load_config()
    
    title = input("Masukkan Judul Link: ").strip()
    url = input("Masukkan URL: ").strip()
    notes = input("Masukkan Catatan (opsional): ").strip()
    category = input("Masukkan Kategori Link (contoh: Aplikasi, Panduan, Laporan): ").strip() or "Umum" # Default ke "Umum"

    # Show available accounts to assign to
    print("\n--- Daftar Akun Tersedia ---")
    for acc in config['accounts']:
        print(f"ID: {acc['id']}, Nama: {acc['account_name']}, Role: {acc['role']}")
    
    assigned_ids_input = input("\nMasukkan ID akun yang bisa mengakses link ini, pisahkan dengan koma (contoh: puskesmas-01, puskesmas-02): ").strip()
    assigned_ids = [id.strip() for id in assigned_ids_input.split(',') if id.strip()]
    
    # Validate assigned IDs
    valid_ids = {acc['id'] for acc in config['accounts']}
    if not all(id_ in valid_ids for id_ in assigned_ids):
        print("Error: Salah satu atau beberapa ID akun tidak valid.")
        return

    # Try to fetch metadata (placeholder for future enhancement)
    image_url = None

    new_link = {
        "id": f"link-{len(config['links']) + 1:03d}",
        "title": title,
        "url": url,
        "notes": notes,
        "category": category, # TAMBAHKAN KATEGORI
        "assigned_ids": assigned_ids,
        "image_url": image_url
    }

    config['links'].append(new_link)
    save_config(config)
    print(f"\n✅ Link '{title}' dengan kategori '{category}' berhasil ditambahkan untuk akun: {', '.join(assigned_ids)}.")

def change_passphrase_interactive():
    """Interactively change passphrase for an account."""
    print("\n--- Ubah Passphrase Akun ---")
    config = load_config()
    
    if not config['accounts']:
        print("Tidak ada akun yang tersedia.")
        return

    print("Pilih akun yang akan diubah passphrase-nya:")
    for i, acc in enumerate(config['accounts']):
        print(f"{i + 1}. {acc['account_name']} (ID: {acc['id']}, Role: {acc['role']})")
    
    try:
        choice = int(input("Masukkan nomor akun: ").strip()) - 1
        if not (0 <= choice < len(config['accounts'])):
            print("Error: Pilihan tidak valid.")
            return
        account = config['accounts'][choice]
    except (ValueError, IndexError):
        print("Error: Input tidak valid.")
        return

    print(f"Anda akan mengubah passphrase untuk akun: {account['account_name']} ({account['id']})")
    new_passphrase = getpass.getpass("Masukkan Passphrase Baru: ")
    confirm_passphrase = getpass.getpass("Konfirmasi Passphrase Baru: ")

    if new_passphrase != confirm_passphrase:
        print("Error: Passphrase tidak cocok.")
        return

    # Re-hash with a new salt for security
    new_salt = generate_salt()
    account['passphrase_hash'] = hash_data(new_passphrase, new_salt)
    account['salt'] = new_salt
    
    save_config(config)
    print("\n✅ Passphrase berhasil diubah.")

def show_data():
    """Display all data in a human-readable format."""
    config = load_config()
    print("\n" + "="*50)
    print(" DATA AKUN ".center(50, "="))
    print("="*50)
    for acc in config['accounts']:
        print(f"ID          : {acc['id']}")
        print(f"Role        : {acc['role']}")
        print(f"Nama Akun   : {acc['account_name']}")
        print(f"Username    : {acc['username_hash'][:10]}... (hashed)")
        print(f"Passphrase  : {acc['passphrase_hash'][:10]}... (hashed)")
        print("-" * 50)

    print("\n" + "="*50)
    print(" DATA LINK ".center(50, "="))
    print("="*50)
    for link in config['links']:
        print(f"ID Link     : {link['id']}")
        print(f"Judul       : {link['title']}")
        print(f"URL         : {link['url']}")
        print(f"Kategori    : {link['category']}")
        print(f"Catatan     : {link['notes']}")
        print(f"Dapat Diakses Oleh ID: {', '.join(link['assigned_ids'])}")
        print("-" * 50)
    print("\n")


def main():
    parser = argparse.ArgumentParser(description='Manajemen Data Private Link Vault')
    
    # Use a mutually exclusive group to ensure only one command is run at a time
    group = parser.add_mutually_exclusive_group(required=True)
    
    group.add_argument('--account', action='store_true', help='Tambah akun pengguna baru (mode interaktif)')
    group.add_argument('--link', action='store_true', help='Tambah link baru (mode interaktif)')
    group.add_argument('--change-passphrase', action='store_true', help='Ubah passphrase akun (mode interaktif)')
    group.add_argument('--show-data', action='store_true', help='Tampilkan semua data (tidak di-hash)')
    group.add_argument('--init', action='store_true', help='Inisialisasi administrator pertama kali')

    args = parser.parse_args()
    
    # If config.json doesn't exist, force initialization
    if not os.path.exists(CONFIG_FILE) and not args.init:
        print("config.json tidak ditemukan. Silakan jalankan 'python generate_key.py --init' terlebih dahulu.")
        return

    if args.account:
        add_account_interactive()
    elif args.link:
        add_link_interactive()
    elif args.change_passphrase:
        change_passphrase_interactive()
    elif args.show_data:
        show_data()
    elif args.init:
        initialize_master_admin()

if __name__ == "__main__":
    main()