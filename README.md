# SIDESA — Sistem Informasi Kependudukan Desa

Aplikasi web untuk pengelolaan data kependudukan Desa Motoboi Besar, Kecamatan Kotamobagu Selatan, Kota Kotamobagu, Sulawesi Utara.

## Fitur Utama

- **Dashboard** — Statistik kependudukan, grafik demografi, tren mutasi
- **Data Penduduk** — CRUD lengkap, pencarian, filter, export Excel
- **Kartu Keluarga** — Manajemen KK dan anggota keluarga
- **Mutasi Penduduk** — Kelahiran, kematian, pindah masuk/keluar
- **Surat Keterangan** — Pembuatan, pengajuan, persetujuan, dan unduh PDF (SKD, SKCK, SKU, SKL, SKM, SKTM)
- **Manajemen Pengguna** — CRUD user dengan 4 role (Admin, Kades, Sekdes, Operator)
- **Pengaturan** — Konfigurasi profil dan data desa

## Tech Stack

| Layer      | Teknologi                                             |
|-----------|-------------------------------------------------------|
| Frontend   | React 19, Vite 7, TailwindCSS 4, shadcn/ui, Recharts |
| Backend    | Node.js 20, Express.js 5, Prisma 5                   |
| Database   | PostgreSQL                                            |
| Auth       | JWT (jsonwebtoken)                                    |

## Struktur Proyek

```
sidesa/
├── client/          # Frontend React
│   ├── src/
│   │   ├── components/    # UI & shared components
│   │   ├── context/       # AuthContext
│   │   ├── hooks/         # React Query hooks
│   │   ├── lib/           # axios, utils
│   │   └── pages/         # Halaman aplikasi
│   └── package.json
└── server/          # Backend Express
    ├── prisma/        # Schema & seed
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── routes/
    │   ├── middlewares/
    │   └── validations/
    └── package.json
```

## Cara Setup

### Prasyarat
- Node.js 20+
- PostgreSQL (berjalan di port 5432)
- npm atau yarn

### 1. Clone & Install

```bash
# Install server dependencies
cd sidesa/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Konfigurasi Database

Buat database PostgreSQL:
```sql
CREATE DATABASE sidesa;
```

Salin dan sesuaikan file environment:
```bash
cd sidesa/server
cp .env.example .env
```

Edit `server/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sidesa
JWT_SECRET=sidesa-secret-key-2026-very-secure-motoboi-besar
JWT_EXPIRES_IN=24h
PORT=5000
NODE_ENV=development
```

### 3. Setup Database & Seed

```bash
cd sidesa/server
npx prisma db push
npx prisma db seed
```

Seed akan membuat:
- 4 akun pengguna (admin, kades, sekdes, operator)
- 12 Kartu Keluarga
- 45 data penduduk
- 8 catatan mutasi
- 6 permohonan surat

### 4. Jalankan Aplikasi

**Backend (port 5000):**
```bash
cd sidesa/server
npm run dev
```

**Frontend (port 5173):**
```bash
cd sidesa/client
npm run dev
```

Buka browser: `http://localhost:5173`

## Akun Default

| Username | Password  | Role      |
|----------|-----------|-----------|
| admin    | admin123  | Admin     |
| kades    | kades123  | Kades     |
| sekdes   | sekdes123 | Sekdes    |
| operator | operator123 | Operator |

## Hak Akses

| Fitur                  | Admin | Kades | Sekdes | Operator |
|------------------------|-------|-------|--------|----------|
| Lihat Data             | ✓     | ✓     | ✓      | ✓        |
| Tambah/Edit Penduduk   | ✓     | -     | ✓      | ✓        |
| Kelola KK              | ✓     | -     | ✓      | ✓        |
| Catat Mutasi           | ✓     | -     | ✓      | ✓        |
| Buat Surat             | ✓     | -     | ✓      | ✓        |
| Setujui Surat          | ✓     | ✓     | -      | -        |
| Export Data            | ✓     | -     | ✓      | -        |
| Unduh PDF Surat        | ✓     | ✓     | ✓      | ✓        |
| Kelola User            | ✓     | -     | -      | -        |
| Pengaturan Desa        | ✓     | -     | -      | -        |

## Format Nomor Surat

```
[urutan]/[kode surat]/[kode desa]/[bulan romawi]/[tahun]
Contoh: 001/SKD/MB/II/2026
```
