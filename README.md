<div align="center">

# 🏛 SIDESA

### Sistem Informasi Kependudukan Desa

**Aplikasi manajemen data kependudukan desa berbasis web modern**

Desa Motoboi Besar • Kecamatan Kotamobagu Selatan • Kota Kotamobagu • Sulawesi Utara

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Demo Langsung](#demo) • [Instalasi](#-instalasi--menjalankan-lokal) • [Deployment](#-deployment) • [Dokumentasi](#-api-endpoints)

</div>

---

##  Tentang

**SIDESA** (Sistem Informasi Kependudukan Desa) adalah aplikasi web full-stack untuk mengelola data kependudukan desa secara digital. Sistem ini mencakup manajemen penduduk, kartu keluarga, mutasi penduduk, penerbitan surat keterangan, serta dashboard statistik demografi desa.

Dibangun dengan arsitektur modern menggunakan React.js, Express.js, dan PostgreSQL, SIDESA menyediakan antarmuka yang intuitif untuk perangkat desa dalam melayani administrasi kependudukan secara efisien.

###  Latar Belakang

Proyek ini dikembangkan sebagai tugas mata kuliah yang mensimulasikan kebutuhan nyata administrasi desa di Indonesia, menggunakan data realistis Desa Motoboi Besar, Kota Kotamobagu, Sulawesi Utara.

---

##  Fitur Utama

###  Landing Page Publik
- Hero section dengan statistik real-time
- Profil desa & sambutan kepala desa
- Statistik demografi interaktif (charts)
- Transparansi APBDes 2026
- Cek status surat publik
- Layanan administrasi & alur pengurusan
- FAQ, peta lokasi, dan form kontak WhatsApp

###  Dashboard Admin
- Statistik ringkasan (total penduduk, KK, mutasi, surat)
- 6 chart demografi interaktif (Recharts)
- Data real-time dari database

###  Manajemen Penduduk
- CRUD data penduduk lengkap (45+ field)
- Pencarian dan filter multi-kriteria
- Export data ke Excel
- Validasi NIK 16 digit
- Soft delete (status-based)

###  Kartu Keluarga
- CRUD Kartu Keluarga
- Manajemen anggota keluarga
- Penetapan kepala keluarga
- Relasi penduduk ↔ KK

###  Mutasi Penduduk
- Pencatatan kelahiran → auto-create penduduk
- Pencatatan kematian → auto-update status
- Pencatatan pindah masuk/keluar
- Semua operasi dalam database transaction

###  Surat Keterangan
- 6 jenis surat: SK Domisili, SKTM, SK Usaha, SK Kelahiran, SK Kematian, Surat Pengantar
- Workflow approval: Draft → Menunggu → Disetujui/Ditolak
- Auto-generate nomor surat (format: 001/SKD/MB/II/2026)
- Generate PDF surat resmi dengan kop surat
- Hanya Kepala Desa yang bisa menyetujui

###  Autentikasi & Otorisasi
- JWT-based authentication
- Role-Based Access Control (RBAC)
- 4 role: Admin, Kepala Desa, Sekretaris Desa, Operator
- Permission matrix per fitur

###  UI/UX
- Responsive design (desktop, tablet, mobile)
- Modern government-style UI
- Animasi smooth & micro-interactions
- Chart & diagram premium (gradient, animated)
- Loading skeleton & empty states

---

##  Tech Stack

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React 19, Vite, TailwindCSS 4, React Router 6 |
| **State Management** | TanStack React Query |
| **Charts** | Recharts |
| **UI Components** | shadcn/ui + Radix UI + Lucide Icons |
| **Backend** | Express.js 5, Node.js |
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL 16 |
| **Auth** | JWT (jsonwebtoken) + bcrypt |
| **PDF** | PDFKit |
| **Excel** | ExcelJS |
| **Deployment** | Vercel (frontend) + Railway (backend + DB) |

---

##  Struktur Folder

```
sidesa/
├── client/                  # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   │   ├── layout/      # AppLayout, Sidebar, Header
│   │   │   ├── shared/      # DataTable, StatCard, FormField
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── context/         # AuthContext
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Axios instance, chart config, utils
│   │   ├── pages/
│   │   │   ├── dashboard/   # DashboardPage
│   │   │   ├── penduduk/    # List, Form, Detail
│   │   │   ├── kartu-keluarga/
│   │   │   ├── mutasi/
│   │   │   ├── surat/
│   │   │   ├── users/
│   │   │   ├── pengaturan/
│   │   │   ├── profil/
│   │   │   └── public/      # LandingPage + sections
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vercel.json
│   └── package.json
│
├── server/                  # Backend Express
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.js          # Seed data
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth, RBAC, validation, error handler
│   │   ├── validations/     # Zod schemas
│   │   ├── utils/           # Helpers
│   │   └── app.js           # Express app entry
│   ├── railway.json
│   └── package.json
│
├── .gitignore
└── README.md
```

---

##  Instalasi & Menjalankan Lokal

### Prasyarat

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (running)
- **npm** ≥ 9
- **Git**

### 1. Clone Repository

```bash
git clone https://github.com/username/sidesa.git
cd sidesa
```

### 2. Setup Backend

```bash
cd server
npm install
```

Buat file `.env`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/sidesa
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5174
```

Setup database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

Jalankan server:
```bash
npm run dev
```

Server berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
cd ../client
npm install
```

Buat file `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Jalankan:
```bash
npm run dev
```

Frontend berjalan di `http://localhost:5174`

### 4. Akun Demo

| Username | Password | Role | Hak Akses |
|----------|----------|------|-----------|
| `admin` | `admin123` | Administrator | Full access |
| `kades` | `kades123` | Kepala Desa | Approve surat |
| `sekdes` | `sekdes123` | Sekretaris Desa | Kelola data |
| `operator1` | `operator123` | Operator | Input data |

---

##  Deployment

### Arsitektur Deployment

```
┌─────────────┐     HTTPS     ┌──────────────┐     Internal    ┌────────────┐
│             │  ──────────▶  │              │  ────────────▶  │            │
│   Vercel    │               │   Railway    │                 │ PostgreSQL │
│  (Frontend) │  ◀──────────  │  (Backend)   │  ◀────────────  │ (Railway)  │
│             │    JSON API   │              │    SQL Query    │            │
└─────────────┘               └──────────────┘                 └────────────┘
```

### Deploy Backend ke Railway

1. Buka [railway.app](https://railway.app) dan login dengan GitHub
2. Klik **"New Project"** → **"Deploy from GitHub Repo"**
3. Pilih repository SIDESA
4. Set **Root Directory**: `server`
5. Tambahkan PostgreSQL: klik **"+ New"** → **"Database"** → **"PostgreSQL"**
   - Railway otomatis generate `DATABASE_URL`
6. Set environment variables di tab **Variables**:
   ```
   JWT_SECRET=generate-random-string-32-chars
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```
7. Railway auto-deploy. Catat URL backend (contoh: `https://sidesa-api.up.railway.app`)
8. Seed data sekali saja: buka **Settings** → **Custom Start Command**:
   ```
   npx prisma migrate deploy && npx prisma db seed && npm start
   ```
   Deploy ulang, lalu ubah kembali ke `npm start`

### Deploy Frontend ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan GitHub
2. Klik **"Add New Project"** → Import repository SIDESA
3. Konfigurasi:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Set environment variable:
   ```
   VITE_API_URL=https://your-api.railway.app/api
   ```
5. Klik **Deploy**. Catat URL frontend (contoh: `https://sidesa.vercel.app`)

### Post-Deploy

1. Update `CLIENT_URL` di Railway dengan URL Vercel
2. Re-deploy Railway agar CORS update
3. Test: buka URL Vercel → landing page → login → dashboard

---

##  Database Schema

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│    User      │     │   KartuKeluarga  │     │   Penduduk   │
├──────────────┤     ├──────────────────┤     ├──────────────┤
│ id           │     │ id               │────▶│ id           │
│ username     │     │ noKk             │     │ nik          │
│ password     │     │ kepalaKeluargaId │     │ namaLengkap  │
│ namaLengkap  │     │ dusun            │     │ kkId         │
│ role         │     │ rt / rw          │     │ jenisKelamin │
│ isActive     │     └──────────────────┘     │ agama        │
└──────┬───────┘                              │ pekerjaan    │
       │                                      │ pendidikan   │
       │         ┌──────────────┐             │ status       │
       │         │    Mutasi    │             └──────┬───────┘
       │         ├──────────────┤                    │
       ├────────▶│ jenisMutasi  │◀───────────────────┤
       │         │ pendudukId   │                    │
       │         │ dicatatOleh  │                    │
       │         └──────────────┘                    │
       │                                             │
       │         ┌──────────────┐                    │
       │         │    Surat     │                    │
       │         ├──────────────┤                    │
       ├────────▶│ nomorSurat   │◀───────────────────┘
                 │ jenisSurat   │
                 │ dataTambahan │
                 │ status       │
                 │ approvedById │
                 └──────────────┘

┌──────────────┐
│  DesaProfil  │
├──────────────┤
│ namaDesa     │
│ kepalaDesa   │
│ kecamatan    │
│ kabupaten    │
│ provinsi     │
│ kodeDesa     │
└──────────────┘
```

---

##  API Endpoints

### Public (Tanpa Auth)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/health` | Health check |
| GET | `/api/public/stats` | Statistik publik |
| GET | `/api/public/profil-desa` | Profil desa |
| GET | `/api/public/status-surat/:nomor` | Cek status surat |

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Ganti password |

### Penduduk (Protected)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/penduduk` | List + search + filter + pagination |
| GET | `/api/penduduk/export/excel` | Export Excel |
| GET | `/api/penduduk/:id` | Detail |
| POST | `/api/penduduk` | Create |
| PUT | `/api/penduduk/:id` | Update |
| DELETE | `/api/penduduk/:id` | Soft delete |

### Kartu Keluarga (Protected)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kartu-keluarga` | List |
| GET | `/api/kartu-keluarga/:id` | Detail + anggota |
| POST | `/api/kartu-keluarga` | Create |
| PUT | `/api/kartu-keluarga/:id` | Update |
| DELETE | `/api/kartu-keluarga/:id` | Delete |

### Mutasi (Protected)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/mutasi` | List |
| POST | `/api/mutasi` | Create (with side effects) |

### Surat (Protected)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/surat` | List |
| GET | `/api/surat/:id` | Detail |
| POST | `/api/surat` | Create (status DRAFT) |
| PUT | `/api/surat/:id` | Update |
| PATCH | `/api/surat/:id/submit` | Submit for approval |
| PATCH | `/api/surat/:id/approve` | Approve (Kades only) |
| PATCH | `/api/surat/:id/reject` | Reject (Kades only) |
| GET | `/api/surat/:id/pdf` | Download PDF |
| GET | `/api/surat/export/excel` | Export Excel |

### Dashboard (Protected)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/dashboard/stats` | Statistik ringkasan |
| GET | `/api/dashboard/demografi` | Data demografi |

### Users (Admin Only)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/users` | List users |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| PUT | `/api/users/:id/toggle-active` | Toggle active |

---

##  Role & Permission Matrix

| Fitur | Admin | Kades | Sekdes | Operator |
|-------|:-----:|:-----:|:------:|:--------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Lihat Penduduk | ✅ | ✅ | ✅ | ✅ |
| Tambah/Edit Penduduk | ✅ | ❌ | ✅ | ✅ |
| Hapus Penduduk | ✅ | ❌ | ✅ | ❌ |
| Export Excel | ✅ | ✅ | ✅ | ✅ |
| Kelola KK | ✅ | ❌ | ✅ | ✅ |
| Catat Mutasi | ✅ | ❌ | ✅ | ✅ |
| Buat Surat | ✅ | ❌ | ✅ | ✅ |
| Approve/Reject Surat | ✅ | ✅ | ❌ | ❌ |
| Download PDF Surat | ✅ | ✅ | ✅ | ✅ |
| Kelola Users | ✅ | ❌ | ❌ | ❌ |
| Pengaturan Desa | ✅ | ❌ | ❌ | ❌ |

---

##  Data Contoh

Sistem dilengkapi dengan seed data realistis:

- **Desa**: Motoboi Besar, Kotamobagu Selatan, Sulawesi Utara
- **Kepala Desa**: Ibrahim Mokodompit
- **12 Kartu Keluarga** tersebar di 4 dusun
- **~45 Penduduk** dengan nama khas Sulawesi Utara/Bolaang Mongondow
- **8 Mutasi** (kelahiran, kematian, pindah masuk/keluar)
- **6 Surat** dalam berbagai status workflow
- **4 User** dengan role berbeda

---

##  Development

### Perintah Berguna

```bash
# Backend
cd server
npm run dev                    # Jalankan development server
npx prisma studio             # Buka Prisma database GUI
npx prisma migrate dev         # Buat migration baru
npx prisma migrate reset       # Reset database + re-seed
npx prisma db seed             # Jalankan seed data

# Frontend
cd client
npm run dev                    # Jalankan development server
npm run build                  # Build untuk production
npm run preview                # Preview production build lokal
```

### Environment Variables

| Variable | Dimana | Deskripsi |
|----------|--------|-----------|
| `DATABASE_URL` | server | PostgreSQL connection string |
| `JWT_SECRET` | server | Secret key untuk JWT |
| `JWT_EXPIRES_IN` | server | Token expiry (default: 7d) |
| `PORT` | server | Port server (default: 5000) |
| `NODE_ENV` | server | production / development |
| `CLIENT_URL` | server | Frontend URL (untuk CORS) |
| `VITE_API_URL` | client | Backend API base URL |


---

##  Credits

- **Framework**: React, Express, PostgreSQL, Prisma
- **UI**: TailwindCSS, shadcn/ui, Radix UI, Lucide Icons
- **Charts**: Recharts
- **PDF**: PDFKit
- **Excel**: ExcelJS
- **Deployment**: Vercel, Railway

---

<div align="center">


</div>
