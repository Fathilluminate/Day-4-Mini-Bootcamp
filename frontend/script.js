// ==========================================
// 1. KONFIGURASI & SELEKSI ELEMEN
// ==========================================

// URL Endpoint API Backend (Alamat tujuan request)
const API_URL = "https://day-4-mini-bootcamp.vercel.app/pengeluaran";

// Seleksi elemen HTML untuk dimanipulasi
const tombolTambah = document.getElementById("tombol-tambah");
const inputNama = document.getElementById("nama-pengeluaran");
const inputNominal = document.getElementById("nominal-pengeluaran");
const daftarList = document.getElementById("daftar-pengeluaran");
const tampilanTotal = document.getElementById("total-harga");

// Inisialisasi pertama kali: ambil data dari database saat halaman dibuka
loadPengeluaran();

// ==========================================
// 2. FUNGSI LOGIC (BACKEND INTERACTION)
// ==========================================

// FUNGSI READ: Mengambil data dari Backend
async function loadPengeluaran() {
  try {
    // Melakukan GET request ke backend
    const response = await fetch(API_URL);
    const data = await response.json();

    // Kirim data yang didapat ke fungsi UI untuk ditampilkan
    tampilkanPengeluaran(data);
  } catch (error) {
    console.error("Gagal memuat data pengeluaran:", error);
    alert("Koneksi ke server gagal!");
  }
}

// FUNGSI CREATE: Menambahkan data baru ke Backend
tombolTambah.addEventListener("click", async function () {
  const nama = inputNama.value;
  const nominal = parseInt(inputNominal.value);

  // Validasi input sederhana agar data tidak kosong
  if (nama === "" || isNaN(nominal)) {
    alert("Isi nama dan jumlah uang dengan benar!");
    return;
  }

  try {
    // Melakukan POST request dengan membawa data JSON
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama, nominal }),
    });

    // Refresh data agar tampilan sinkron dengan database
    loadPengeluaran();

    // Reset form input setelah berhasil tambah
    inputNama.value = "";
    inputNominal.value = "";
  } catch (error) {
    console.error("Gagal menambahkan data:", error);
  }
});

// FUNGSI DELETE: Menghapus data di Backend berdasarkan ID
async function hapusPengeluaran(id) {
  try {
    // Melakukan DELETE request ke URL spesifik (misal: /pengeluaran/1)
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    // Refresh data setelah menghapus
    loadPengeluaran();
  } catch (error) {
    console.error("Gagal menghapus data:", error);
  }
}

// ==========================================
// 3. FUNGSI UI (TAMPILAN)
// ==========================================

// Menampilkan data ke dalam elemen HTML (DOM Manipulation)
function tampilkanPengeluaran(data) {
  // Bersihkan daftar lama agar tidak duplikat saat refresh
  daftarList.innerHTML = "";
  let total = 0;

  data.forEach((item) => {
    // Buat elemen list (li) baru
    const itemBaru = document.createElement("li");
    itemBaru.innerHTML = `
        <span>${item.nama} - <b>Rp ${item.nominal.toLocaleString()}</b></span>
        <button class="btn-hapus" data-id="${item.id}">Hapus</button>
    `;

    // Pasang Event Listener Hapus pada tombol yang baru dibuat
    itemBaru.querySelector(".btn-hapus").addEventListener("click", function () {
      hapusPengeluaran(item.id);
    });

    // Masukkan elemen li ke dalam ul (daftarList)
    daftarList.appendChild(itemBaru);

    // Hitung akumulasi total harga
    total += item.nominal;
  });

  // Update angka total di layar
  tampilanTotal.innerText = total.toLocaleString();
}
