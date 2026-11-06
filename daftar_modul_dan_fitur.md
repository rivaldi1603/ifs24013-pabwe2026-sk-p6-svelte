# Daftar Modul dan Fitur Sistem KSDAS IT Del

> **Panduan Copy-Paste ke Coda:**  
> Dokumen ini diformat menggunakan struktur *Heading*, *Tabel Markdown*, dan *Checklist* standar yang kompatibel penuh dengan **Coda.io**. Anda dapat menyalin seluruh isi file ini (atau per bagian tabel) dan menempelkannya langsung ke halaman Coda untuk otomatis menjadi **Coda Table** dan **Collapsible Sections**.

---

## 1. Ringkasan Arsitektur Menu & Modul Utama (Target Hasil Tinjauan Klien)

Berdasarkan hasil pertemuan klien, tinjauan mockup (`ksdas-itdel`), dan analisis data awal AMI TA 2025/2026, navigasi sistem yang semula terdiri dari 9–10 menu disederhanakan menjadi **6 Modul Inti** bergaya **CIS IT Del**:

| Kode Modul | Nama Modul Utama | Posisi Navigasi | Deskripsi Singkat | Target Pengguna Utama | Status di Prototype Saat Ini |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MOD-01** | **Autentikasi, Otorisasi & Integrasi CIS** | Halaman Login & Topbar | Manajemen akun pengguna, login/register selaras CIS, pembagian hak akses (RBAC), serta pengajuan akun. | Seluruh Pengguna | Perlu Pengembangan (Masih Dropdown Simulasi) |
| **MOD-02** | **Beranda (Dashboard Eksekutif & Pengingat)** | Sidebar Menu 1 | Ringkasan KPI kemitraan, filter cepat per prodi, pengingat otomatis <= 30 hari, dan ringkasan tindak lanjut. | WR3, Admin UKS, Dekan, Kaprodi, SPM | Sudah Ada (Perlu Penyesuaian UI CIS & Reminder 30 Hari) |
| **MOD-03** | **Manajemen Naskah, Relasi, Impor & Analisis** | Sidebar Menu 2 *(Gabungan Naskah + Catat + Impor + Relasi + Analisis)* | Pusat pencatatan naskah (LoI, MoU, PKS/MoA, CA, IA), ekstraksi OCR/pintar, impor massal Excel/Sheets/Notion, pohon relasi hierarki, serta analisis kemitraan langsung. | Admin (WR3, Kabiro, Bu Christin), Dekan, Kaprodi, Dosen | Sudah Ada (Perlu Penggabungan Menu, Multi-Prodi, & Relaksasi Validasi) |
| **MOD-04** | **SPMI, AMI & Akreditasi Prodi** | Sidebar Menu 3 | Kalkulasi otomatis 6 indikator standar AMI per prodi, komparasi tren antar-tahun (TS-1 vs TS), rasio MoU -> PKS (target 45%/50%), dan ekspor Excel akurat. | SPM, Auditor AMI, Admin UKS, Kaprodi, Dekan | Sebagian Ada (Perlu Implementasi Rumus 6 Indikator AMI & Multi-Tahun) |
| **MOD-05** | **Panduan, Struktur Organisasi & Pejabat** | Sidebar Menu 4 *(Gabungan Panduan + Struktur & Pejabat)* | Informasi struktur organisasi terbaru di bawah WR3, daftar 4 Fakultas & 10 Prodi (termasuk S1-BT), rantai komando penandatangan, template naskah, dan panduan sistem. | Seluruh Pengguna | Sudah Ada (Perlu Digabung & Dibuat *Extendable* / Dinamis) |
| **MOD-06** | **Notifikasi, Pesan Dosen & Riwayat (Audit Log)** | Topbar (Ikon Lonceng) & Panel Riwayat | Notifikasi kontrak kritis (<= 30 hari), notifikasi kesiapan publikasi AMI, fitur pesan/pengajuan dari Dosen ke Admin, dan *history log* aktivitas. | Admin, Dosen, SPM, Kaprodi | Sebagian Ada (Audit Log Ada; Lonceng Notifikasi & Pesan Dosen Baru) |

> **Catatan Penghapusan Modul:** Menu **Penyimpanan & Memori** (`storageView`) pada mockup lama **dihapus dari antarmuka pengguna** sesuai instruksi klien (*"penyimpanan hapus"*), sementara fungsi *backup/database* dikelola di sisi belakang oleh Tim SDI.

---

## 2. Tabel Master Daftar Fitur Lengkap (Siap Impor ke Tabel Coda)

Tabel di bawah ini memuat seluruh fitur beserta kategori modul, deskripsi fungsional, aturan bisnis klien, dan prioritas pengerjaan:

| ID Fitur | Modul | Nama Fitur | Deskripsi & Ketentuan Klien | Aktor / Role | Prioritas | Status Saat Ini |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FIT-01** | MOD-01: Autentikasi & Otorisasi | **Login & Registrasi Terintegrasi CIS** | Halaman masuk dan pendaftaran akun dengan penyelarasan kredensial (*username/password*) menyerupai sistem CIS IT Del. | Semua Pengguna | Tinggi | Belum Ada (Masih Simulasi) |
| **FIT-02** | MOD-01: Autentikasi & Otorisasi | **Manajemen Hak Akses Berbasis Peran (RBAC)** | Pembagian hak akses: **Admin Full** (WR3, Kabiro, Bu Christin/Staf UKS) untuk *Create/Update/Validate/Capaian*; **Prodi & Dekan** akses *Read* penuh lintas data & analisis; **Dosen** akses terbatas + kirim pesan. | Admin, Dekan, Kaprodi, SPM, Dosen | Tinggi | Perlu Penyesuaian |
| **FIT-03** | MOD-02: Beranda (Dashboard) | **Tema Antarmuka Bergaya CIS IT Del** | Tampilan warna korporat biru-putih bersih ala CIS IT Del, menampilkan logo resmi IT Del, *eye-catching*, dan bebas dari banner unduhan `.exe`. | Semua Pengguna | Tinggi | Perlu Redesign |
| **FIT-04** | MOD-02: Beranda (Dashboard) | **Kartu KPI & Ringkasan Kemitraan** | Menampilkan metrik utama: Total Naskah, Naskah Aktif, Perlu Perhatian (Akan Berakhir/Kedaluwarsa), dan Kesenjangan Tindak Lanjut. | Semua Pengguna | Tinggi | Sudah Ada |
| **FIT-05** | MOD-02: Beranda (Dashboard) | **Pengingat Otomatis 30 Hari (*Early Warning*)** | Deteksi dan peringatan otomatis untuk naskah kerja sama yang masa berlakunya tersisa <= 30 hari (Kritis) dan <= 180 hari (Waspada). | Admin, WR3, Dekan, Kaprodi | Tinggi | Perlu Penyesuaian (Tambah 30 Hari) |
| **FIT-06** | MOD-02: Beranda (Dashboard) | **Filter Cepat Checkbox Per Prodi & Generate Analisis** | Menyaring ringkasan data berdasarkan checkbox Program Studi / Fakultas yang terlibat dalam kegiatan, langsung menghasilkan analisis. | Semua Pengguna | Tinggi | Perlu Penyesuaian |
| **FIT-07** | MOD-03: Naskah, Relasi, Impor & Analisis | **Tabel Naskah dengan Pencarian di Sisi Kanan** | Tabel direktori naskah dengan fitur *sort* kolom, multi-select *checkbox*, filter tahun/jenis/status, dan **kotak pencarian (*Search*) di sebelah kanan atas**. | Semua Pengguna | Tinggi | Sudah Ada (Pindah Search ke Kanan) |
| **FIT-08** | MOD-03: Naskah, Relasi, Impor & Analisis | **Klasifikasi Lengkap Jenis Naskah & Luaran Kunjungan** | Mendukung jenis dokumen: **LoI** (*Letter of Intent*), **MoU**, **PKS / MoA**, **CA** (*Cooperation Agreement*), **IA** (*Implementation Agreement*), serta pendokumentasian **Hasil Kunjungan & Fasilitas**. | Admin | Tinggi | Perlu Penyesuaian (Tambah LoI, CA, Kunjungan) |
| **FIT-09** | MOD-03: Naskah, Relasi, Impor & Analisis | **Multi-Tagging Fakultas & Program Studi (Checkbox)** | Satu kerja sama (misal: program magang industri) dapat melibatkan **lebih dari 1 Fakultas dan lebih dari 1 Prodi** sekaligus agar penilaian AMI per prodi tercatat detail. | Admin, Kaprodi | Sangat Tinggi | Belum Ada (Masih 1 Prodi per Naskah) |
| **FIT-10** | MOD-03: Naskah, Relasi, Impor & Analisis | **Ekstraksi Dokumen Pintar & OCR Lokal** | Unggah berkas PDF, Word (`.docx`), Excel, atau gambar hasil scan; sistem mengekstrak metadata otomatis sebagai usulan beserta skor keyakinan & kutipan halaman. | Admin | Sedang | Sudah Ada |
| **FIT-11** | MOD-03: Naskah, Relasi, Impor & Analisis | **Validasi Fleksibel Minimal 5 Kolom Wajib** | Memvalidasi naskah cukup dengan **minimal 5 kolom inti** (`Jenis`, `Judul`, `Mitra`, `Tanggal`, `Fakultas/Prodi`) — kolom anggaran & penandatangan tidak memblokir data historis (<25 tahun) yang baru terisi 40–50%. | Admin (WR3, Kabiro, Bu Christin) | Sangat Tinggi | Perlu Penyesuaian (Saat Ini Wajib 9 Kolom) |
| **FIT-12** | MOD-03: Naskah, Relasi, Impor & Analisis | **Impor & Migrasi Tabel Otomatis (Sheets, Drive, Notion, Excel AMI)** | Memindahkan data dari Google Sheets, Excel OneDrive, Notion, dan format 29 kolom `Data Kerja Sama_AMI_TA2526` secara otomatis dengan deteksi duplikasi cerdas. | Admin | Sangat Tinggi | Perlu Penyesuaian Parser Excel AMI |
| **FIT-13** | MOD-03: Naskah, Relasi, Impor & Analisis | **Pohon Hierarki Relasi (*Tree View*) Terintegrasi Naskah** | Menampilkan rantai relasi Mitra -> LoI/MoU -> PKS/MoA/CA -> IA langsung di dalam modul Naskah (digabung dengan Naskah). | Semua Pengguna | Tinggi | Sudah Ada (Perlu Digabung ke Naskah) |
| **FIT-14** | MOD-03: Naskah, Relasi, Impor & Analisis | **Penanganan PKS/IA Tanpa MoU (*Standalone / Blank Parent*)** | Mengakomodasi PKS atau IA yang memang tidak memiliki MoU payung; ditampilkan dengan penanda *blank*/mandiri yang sah tanpa merusak validasi data. | Admin, SPM | Tinggi | Perlu Penyesuaian |
| **FIT-15** | MOD-03: Naskah, Relasi, Impor & Analisis | **Rincian Kemitraan & Direct Analisis dari Naskah** | Melihat rincian kemitraan dan men-generate analisis statistik & kesenjangan langsung (*direct*) dari naskah yang dipilih/difilter, serta ekspor ke `.xls`, `.csv`, dan `.doc`. | Admin, Dekan, Kaprodi, SPM | Tinggi | Sudah Ada (Perlu Diintegrasikan ke Naskah) |
| **FIT-16** | MOD-03: Naskah, Relasi, Impor & Analisis | **Atribut Publikasi & Penyelarasan Data STEM ke Prodi** | Mencatat status publikasi (Website/IG IT Del), tautan `Laman Publikasi`, serta menyelaraskan pelaporan form pusat Dikti/STEM langsung ke masing-masing prodi. | Admin, Kaprodi | Sedang | Belum Ada |
| **FIT-17** | MOD-04: SPMI, AMI & Akreditasi | **Kalkulasi 6 Standar Indikator AMI per Prodi** | Menghitung otomatis: (1) KS Internasional >= 2, (2) KS Nasional >= 6, (3) KS Lokal >= 2, (4) Mitra Pembelajaran Luar Kampus/Magang >= 17%, (5) Tren TS-1 ke TS >= 0%, (6) MoU -> PKS >= 45%/50%. | SPM, Admin, Kaprodi, Dekan | Sangat Tinggi | Belum Ada (Baru Ada Tabel IKU 6 Dasar) |
| **FIT-18** | MOD-04: SPMI, AMI & Akreditasi | **Perhitungan Keberlanjutan Multi-Tahun (TS-1 vs TS)** | Naskah yang berdurasi multi-tahun otomatis tetap dihitung aktif pada evaluasi AMI setiap tahunnya sampai tanggal kedaluwarsa, memudahkan pencicilan data akreditasi 5 tahunan. | SPM, Admin, Kaprodi | Sangat Tinggi | Perlu Pengembangan |
| **FIT-19** | MOD-04: SPMI, AMI & Akreditasi | **Generate Excel Akurat Standar AMI & Template Naskah** | Mengekspor rekapitulasi AMI ke berkas Excel (`.xlsx`/`.xls`) multi-sheet yang presisi sesuai format buku kajian AMI IT Del, serta menyediakan unduhan template naskah resmi. | SPM, Admin, Kaprodi | Tinggi | Perlu Penyesuaian Format Excel |
| **FIT-20** | MOD-05: Panduan & Struktur Pejabat | **Direktori Struktur Organisasi & Pejabat *Extendable*** | Menggabungkan halaman Panduan dengan Struktur & Pejabat; menampilkan hierarki Rektor (MoU), WR/Dekan sebagai pengganti formal (MoA/PKS), Kaprodi (IA), serta koordinasi di bawah WR3 yang dapat diperbarui (*extend*). | Semua Pengguna (Edit oleh Admin) | Sedang | Sudah Ada (Perlu Digabung & Dinamis) |
| **FIT-21** | MOD-06: Notifikasi, Pesan & History | **Fitur Pesan (*Message*) Dosen & Notifikasi Admin/AMI** | Dosen (akses terbatas) dapat mengirim pesan/pengajuan kerja sama yang memunculkan notifikasi di Admin; notifikasi kesiapan publikasi AMI; disertai pencatatan *history log* lengkap. | Dosen, Admin, SPM | Sedang | Belum Ada |

---

## 3. Rincian Per Modul untuk Halaman Dokumentasi Coda

### Modul 1: Autentikasi, Otorisasi & Integrasi Akun CIS (`MOD-01`)
- **Tujuan:** Menjamin keamanan akses berdasarkan peran jabatan di IT Del dengan pengalaman pengguna yang familier seperti portal akademik CIS.
- **Fitur Utama:**
  - [ ] **Login & Register Satu Kredensial:** Penyelarasan akun dan kata sandi dengan pola autentikasi CIS IT Del.
  - [ ] **Matriks Otorisasi 3 Tingkat:**
    - **Tingkat 1 — Admin Penuh (`WR3`, `Kabiro`, `Bu Christin / Staf UKS`):** Akses penuh *Create, Read, Update, Delete, Validate, Import*, pengaturan target capaian AMI, dan manajemen struktur.
    - **Tingkat 2 — Akses Baca & Analitik Lintas Prodi (`Rektor`, `SPM`, `Dekan`, `Kaprodi`):** Dapat melihat seluruh naskah, bukti fisik, pohon relasi, dan men-generate analisis/laporan Excel semua prodi secara mandiri (sehingga Kaprodi tidak perlu lagi bertanya manual ke Biro saat menyusun borang akreditasi/AMI).
    - **Tingkat 3 — Akses Terbatas & Pengusul (`Dosen`):** Melihat daftar kerja sama umum, mengunduh template naskah, dan mengirim pesan (*message*) pengajuan/tindak lanjut kegiatan ke Admin.

### Modul 2: Beranda / Dashboard Eksekutif (`MOD-02`)
- **Tujuan:** Memberikan gambaran instan kondisi kerja sama institusi dan peringatan dini masa berlaku kontrak.
- **Fitur Utama:**
  - [ ] **Filter Multi-Prodi (Checkbox) & Tahun:** Memfilter metrik beranda per program studi atau fakultas yang terlibat.
  - [ ] **Widget Pengingat Kedaluwarsa 30 Hari Otomatis:** Menampilkan daftar kontrak yang akan habis dalam <= 30 hari (prioritas merah) dan 31–180 hari (prioritas kuning).
  - [ ] **Tombol Pintas Generate Analisis:** Menghasilkan ringkasan eksekutif langsung dari saringan aktif di Beranda.

### Modul 3: Manajemen Naskah, Relasi, Impor & Analisis Terpadu (`MOD-03`)
- **Tujuan:** Menyatukan seluruh siklus hidup dokumen kerja sama (pencatatan, pencarian, pohon relasi, impor migrasi, dan analisis rincian) dalam satu ruang kerja terpusat.
- **Fitur Utama:**
  - [ ] **Workspace Tabel Naskah:**
    - Kotak pencarian cepat (*Search bar*) ditempatkan di **sebelah kanan atas**.
    - Filter berdasarkan Tahun (atau rentang multi-tahun), Jenis Naskah (`LoI`, `MoU`, `PKS/MoA`, `CA`, `IA`, `Kunjungan/Fasilitas`), Fakultas, Prodi, Asal Mitra (`Internasional`, `Nasional`, `Wilayah/Lokal`), dan Status.
    - Checkbox seleksi baris (*multi-select*) untuk unduh massal atau analisis terpilih.
  - [ ] **Form Pencatatan & Validasi Naskah:**
    - Mendukung **Multi-Prodi & Multi-Fakultas (Checkbox)** untuk satu dokumen kerja sama (contoh: 1 PKS magang untuk mahasiswa D3-TI, D4-TRPL, dan S1-IF sekaligus).
    - **Aturan Validasi 5 Kolom Inti:** Dokumen dapat divalidasi jika minimal 5 kolom utama terisi (`Jenis`, `Judul`, `Mitra`, `Tanggal`, `Fakultas/Prodi`), kecuali anggaran yang bersifat opsional—mendukung input data historis hingga < 25 tahun ke belakang yang kelengkapannya baru 40–50%.
    - Mendukung pencatatan **Hasil Kunjungan Mitra**, bantuan **Fasilitas**, flag **Kerja Sama Magang**, dan **Tautan Publikasi** (Website/IG IT Del).
  - [ ] **Tab/Panel Pohon Relasi (*Hierarchical Tree*) & PKS Mandiri:**
    - Visualisasi hierarki LoI -> MoU -> PKS (MoA) / CA -> IA yang digabung langsung di halaman Naskah.
    - Menampilkan slot induk dalam bentuk *blank* terstruktur bagi PKS atau IA yang berdiri sendiri tanpa MoU.
  - [ ] **Panel Impor Tabel & Migrasi Data:**
    - Impor satu klik dari file `.xlsx` / `.csv` atau *copy-paste* dari Google Sheets, Google Drive, dan Notion.
    - Mendukung struktur matriks 29 kolom `Data Kerja Sama_AMI_TA2526_revIV.xlsx` dan penanganan nomor dokumen pendek berulang lintas tahun serta tanggal format Tahun Ajaran (`TA 2526-1`).
  - [ ] **Panel Direct Analisis (Rincian Kemitraan):**
    - Menampilkan rincian kemitraan, grafik sebaran jenis/status, dan evaluasi celah tindak lanjut langsung dari halaman Naskah.

### Modul 4: SPMI, AMI & Akreditasi Program Studi (`MOD-04`)
- **Tujuan:** Mengotomatiskan pencicilan data Audit Mutu Internal (AMI) tahunan dan akreditasi 5 tahunan per prodi agar selaras dengan pelaporan STEM/Dikti.
- **Fitur Utama:**
  - [ ] **Kalkulator Otomatis 6 Kriteria Standar AMI IT Del:**
    1. *Kerja Sama Internasional (TS)* — Target >= 2 per prodi.
    2. *Kerja Sama Nasional (TS)* — Target >= 6 per prodi.
    3. *Kerja Sama Wilayah/Lokal (TS)* — Target >= 2 per prodi.
    4. *Persentase Mitra Pendukung Pembelajaran Luar Kampus (Magang)* — Target >= 17%.
    5. *Persentase Tren Kerja Sama Antar-Tahun (TS-1 ke TS)* — Target meningkat (>= 0%) tiap tahun.
    6. *Persentase MoU Ditindaklanjuti PKS/IA* — Target >= 45% / >= 50% (dapat diatur oleh Admin).
  - [ ] **Logika Masa Berlaku Lintas Tahun:** Naskah yang masih aktif otomatis terhitung pada populasi tahun berjalan (TS) maupun tahun sebelumnya (TS-1) sesuai rentang `Tanggal Mulai` s.d. `Tanggal Berakhir` sampai kadaluarsa.
  - [ ] **Ekspor Excel AMI Presisi & Template Naskah:** Menghasilkan file Excel berformat identik dengan tabel ringkasan dan 6 sheet kajian mitra AMI, ditambah fitur unduh template draf MoU/PKS/IA standar IT Del.

### Modul 5: Panduan, Struktur Organisasi & Pejabat (`MOD-05`)
- **Tujuan:** Menyajikan rujukan tata kelola wewenang penandatanganan dan panduan operasional dalam satu halaman yang dapat diperbarui.
- **Fitur Utama:**
  - [ ] **Bagan Struktur & Pejabat yang *Extendable*:**
    - Menampilkan struktur terkini: **Rektor** (penandatangan MoU), **Wakil Rektor / Dekan** (pengganti formal Rektor untuk MoA/PKS), **Kaprodi** (penandatangan IA), serta koordinasi biro di bawah **WR3**.
    - Mencakup **4 Fakultas** (`FITE`, `FTI`, `FB`, `FV`) dan **10 Program Studi** (`D3-TI`, `D3-TK`, `D4-TRPL`, `S1-IF`, `S1-SI`, `S1-TE`, `S1-MR`, `S1-TM`, `S1-TB/BP`, dan `S1-BT`).
    - Admin dapat menambah/memperbarui (*extend*) nama pejabat dan unit tanpa mengubah kode sumber.
  - [ ] **Panduan Penggunaan Per Peran & Unduhan Template:** Panduan ringkas untuk Admin UKS, WR3, SPM, Dekan/Kaprodi, Dosen, dan Tim SDI.

### Modul 6: Notifikasi, Pesan Dosen & Riwayat Aktivitas (`MOD-06`)
- **Tujuan:** Memfasilitasi komunikasi internal terkait tindak lanjut kemitraan dan menjaga ketertelusuran data (*audit trail*).
- **Fitur Utama:**
  - [ ] **Pusat Notifikasi (Admin & AMI):**
    - Pengingat otomatis 30 hari sebelum kontrak berakhir.
    - Notifikasi publikasi dan kesiapan rekapitulasi data untuk siklus AMI.
  - [ ] **Kotak Pesan / Pengajuan Dosen (*Messaging*):** Dosen dapat mengirimkan pesan catatan kunjungan mitra atau usulan draf kerja sama baru yang langsung masuk ke notifikasi Admin.
  - [ ] **Pencatatan Riwayat (*History / Audit Log*):** Mencatat waktu, nama pengguna, dan rincian setiap penambahan, pengeditan, impor, maupun validasi naskah.

---

## 4. Matriks Hak Akses Pengguna (RBAC Matrix untuk Coda)

| Peran Pengguna (Role) | Lihat Semua Naskah & Analisis Prodi | Tambah / Edit / Impor Naskah | Validasi & Atur Target Capaian AMI | Kelola Struktur & Pejabat | Kirim Pesan Usulan / Catatan | Terima Notifikasi Admin & History |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin — Wakil Rektor III (WR3)** | Ya (Full) | Ya | Ya (Full) | Ya | Ya | Ya |
| **Admin — Kepala Biro (Kabiro)** | Ya (Full) | Ya | Ya (Full) | Ya | Ya | Ya |
| **Admin — Staf UKS (Bu Christin)** | Ya (Full) | Ya | Ya (Full) | Ya | Ya | Ya |
| **Satuan Penjaminan Mutu (SPM / AMI)** | Ya (Full) | Tidak | Verifikasi Mutu & Ekspor AMI | Tidak | Ya | Ya (Notifikasi AMI) |
| **Dekan Fakultas (4 Fakultas)** | Ya (Semua Prodi) | Tidak | Lihat Capaian | Tidak | Ya | Pengingat Kontrak |
| **Ketua Program Studi (10 Prodi)** | Ya (Semua Prodi) | Tidak | Lihat Capaian | Tidak | Ya | Pengingat Kontrak |
| **Dosen IT Del** | Terbatas (Naskah Publik/Aktif) | Tidak | Tidak | Tidak | **Ya (Fitur Message ke Admin)** | Riwayat Pesan Sendiri |
| **Tim SDI (Pengelola Infrastruktur)** | Pemeliharaan Sistem | Konfigurasi DB/SSO | — | — | — | Log Sistem & Audit |

