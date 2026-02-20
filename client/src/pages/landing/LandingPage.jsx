import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Home, FileText, ArrowLeftRight, Building2, Menu, X,
  MapPin, Phone, Mail, ChevronRight, BarChart2, FileCheck,
  Briefcase, Baby, Feather, Send, ArrowRight, ChevronUp, ChevronDown,
  MessageSquare, Settings, CheckCircle, Calendar, Bell, Info, AlertTriangle,
  Globe, Share2, Search, Clock,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

// ─── Hooks ───────────────────────────────────────────────────────────

function useScrollAnimation(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

function useCountUp(target, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (!trigger || target === undefined || target === null) return;
    const to = Number(target) || 0;
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(to * ease));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [target, duration, trigger]);
  return count;
}

// ─── Utility ─────────────────────────────────────────────────────────

const formatRupiah = (num) => {
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(2)} M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(0)} Jt`;
  return `Rp ${num.toLocaleString('id-ID')}`;
};

const JENIS_LABEL = {
  SK_DOMISILI:   'SK Domisili',
  SKTM:          'SKTM',
  SK_USAHA:      'SK Usaha',
  SK_KELAHIRAN:  'SK Kelahiran',
  SK_KEMATIAN:   'SK Kematian',
  SURAT_PENGANTAR: 'Surat Pengantar',
};

// ─── Constants ───────────────────────────────────────────────────────

const GENDER_COLORS = ['#3b82f6', '#f43f5e'];
const AGAMA_COLORS  = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
const DUSUN_COLORS  = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];
const APBDES_PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];

const PARTICLES = [
  { top: '12%', left: '7%',  size: 4, delay: '0s',    dur: '7s'   },
  { top: '22%', left: '88%', size: 6, delay: '1.2s',  dur: '9s'   },
  { top: '38%', left: '18%', size: 3, delay: '2.1s',  dur: '8s'   },
  { top: '58%', left: '80%', size: 5, delay: '0.7s',  dur: '6.5s' },
  { top: '72%', left: '22%', size: 4, delay: '1.8s',  dur: '10s'  },
  { top: '82%', left: '63%', size: 3, delay: '3.2s',  dur: '7.5s' },
  { top: '18%', left: '47%', size: 5, delay: '2.8s',  dur: '8.5s' },
  { top: '50%', left: '55%', size: 6, delay: '4.1s',  dur: '9.5s' },
  { top: '8%',  left: '68%', size: 3, delay: '1.5s',  dur: '7s'   },
  { top: '88%', left: '42%', size: 4, delay: '3.8s',  dur: '8s'   },
  { top: '44%', left: '93%', size: 5, delay: '2.5s',  dur: '6s'   },
  { top: '65%', left: '35%', size: 3, delay: '4.7s',  dur: '9s'   },
];

const SERVICES = [
  { icon: FileCheck, title: 'SK Domisili',     desc: 'Surat keterangan bukti domisili atau tempat tinggal di wilayah desa.',              color: 'border-blue-500',    iconBg: 'bg-blue-50 text-blue-600'    },
  { icon: FileText,  title: 'SKTM',            desc: 'Surat Keterangan Tidak Mampu untuk keperluan bantuan sosial, beasiswa, dll.',        color: 'border-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  { icon: Briefcase, title: 'SK Usaha',        desc: 'Surat keterangan bukti kepemilikan usaha di wilayah desa.',                         color: 'border-violet-500',  iconBg: 'bg-violet-50 text-violet-600'  },
  { icon: Baby,      title: 'SK Kelahiran',    desc: 'Pencatatan dan penerbitan surat keterangan kelahiran warga desa.',                   color: 'border-amber-500',   iconBg: 'bg-amber-50 text-amber-600'   },
  { icon: Feather,   title: 'SK Kematian',     desc: 'Pencatatan dan penerbitan surat keterangan kematian warga desa.',                    color: 'border-rose-500',    iconBg: 'bg-rose-50 text-rose-600'     },
  { icon: Send,      title: 'Surat Pengantar', desc: 'Surat pengantar dari desa untuk berbagai keperluan administrasi.',                  color: 'border-cyan-500',    iconBg: 'bg-cyan-50 text-cyan-600'     },
];

const STEPS = [
  { num: 1, icon: Building2,     title: 'Datang ke Kantor Desa', desc: 'Kunjungi Kantor Desa pada hari dan jam kerja.',                      badge: '08:00–16:00 WITA' },
  { num: 2, icon: MessageSquare, title: 'Sampaikan Keperluan',    desc: 'Sampaikan jenis surat yang dibutuhkan kepada petugas desa.',          badge: null                },
  { num: 3, icon: Settings,      title: 'Petugas Memproses',      desc: 'Petugas akan memverifikasi data dan mencetak surat keterangan.',      badge: '1–2 hari kerja'    },
  { num: 4, icon: CheckCircle,   title: 'Surat Siap Diambil',     desc: 'Surat ditandatangani Kepala Desa dan siap untuk Anda ambil.',         badge: 'GRATIS!'           },
];

const NAV_LINKS = [
  { label: 'Beranda',    id: 'beranda'   },
  { label: 'Profil Desa',id: 'profil'    },
  { label: 'Statistik',  id: 'statistik' },
  { label: 'Layanan',    id: 'layanan'   },
  { label: 'Kontak',     id: 'kontak'    },
];

const PENGUMUMAN = [
  {
    kategori: 'PENTING', icon: AlertTriangle, warna: 'red',
    judul: 'Pendataan Penduduk Semester I 2026',
    isi: 'Seluruh warga dimohon memperbarui data kependudukan (KTP/KK) di Kantor Desa. Bawa dokumen asli dan fotokopi.',
    tanggal: '20 Februari 2026',
  },
  {
    kategori: 'INFO', icon: Info, warna: 'blue',
    judul: 'Jadwal Posyandu Bulan Februari 2026',
    isi: 'Posyandu balita dan lansia akan dilaksanakan pada Selasa, 25 Februari 2026 pukul 09:00 WITA di Balai Desa.',
    tanggal: '18 Februari 2026',
  },
  {
    kategori: 'UMUM', icon: Bell, warna: 'amber',
    judul: 'Batas Akhir Pelaporan Data KK Baru',
    isi: 'Bagi warga yang belum memiliki KK atau perlu pembaruan data, segera urus ke Kantor Desa sebelum 31 Maret 2026.',
    tanggal: '15 Februari 2026',
  },
];

const PENGUMUMAN_COLORS = {
  red:   { border: 'border-t-red-500',   badge: 'bg-red-50 text-red-700',     icon: 'text-red-500'   },
  blue:  { border: 'border-t-blue-500',  badge: 'bg-blue-50 text-blue-700',   icon: 'text-blue-500'  },
  amber: { border: 'border-t-amber-500', badge: 'bg-amber-50 text-amber-700', icon: 'text-amber-500' },
};

const FAQS = [
  {
    q: 'Apa saja syarat untuk mengurus Surat Keterangan Domisili?',
    a: 'Warga perlu membawa KTP asli, fotokopi Kartu Keluarga, dan mengisi formulir permohonan di Kantor Desa. Proses penerbitan memakan waktu 1–2 hari kerja.',
  },
  {
    q: 'Berapa lama proses pembuatan surat keterangan?',
    a: 'Umumnya 1–2 hari kerja setelah berkas lengkap. Untuk surat yang memerlukan verifikasi data tambahan, bisa memakan waktu 3–5 hari kerja.',
  },
  {
    q: 'Apakah ada biaya untuk pengurusan surat di desa?',
    a: 'Tidak ada biaya (GRATIS). Seluruh layanan administrasi kependudukan di Desa Motoboi Kecil tidak dipungut biaya apapun.',
  },
  {
    q: 'Bagaimana jika KTP atau Kartu Keluarga hilang?',
    a: 'Segera lapor ke Kantor Desa untuk mendapatkan Surat Keterangan Kehilangan. Surat ini diperlukan untuk mengurus penggantian KTP/KK di Disdukcapil Kota Kotamobagu.',
  },
  {
    q: 'Kapan jam operasional Kantor Desa Motoboi Kecil?',
    a: 'Kantor Desa buka Senin sampai Jumat, pukul 08:00–16:00 WITA. Sabtu, Minggu, dan hari libur nasional tutup.',
  },
  {
    q: 'Apakah bisa mengurus surat untuk anggota keluarga yang berhalangan hadir?',
    a: 'Bisa, dengan membawa surat kuasa bermaterai dari yang bersangkutan beserta fotokopi KTP pemberi dan penerima kuasa.',
  },
];

const PERSYARATAN = [
  { jenis: 'SK Domisili',     syarat: ['KTP asli', 'Fotokopi Kartu Keluarga', 'Formulir permohonan'] },
  { jenis: 'SKTM',            syarat: ['KTP asli', 'Fotokopi Kartu Keluarga', 'Surat keterangan RT/RW', 'Formulir permohonan'] },
  { jenis: 'SK Usaha',        syarat: ['KTP asli', 'Fotokopi Kartu Keluarga', 'Bukti kepemilikan usaha', 'Formulir permohonan'] },
  { jenis: 'SK Kelahiran',    syarat: ['KTP orang tua (asli)', 'Fotokopi Kartu Keluarga', 'Surat keterangan lahir RS/bidan', 'Formulir permohonan'] },
  { jenis: 'SK Kematian',     syarat: ['KTP almarhum/almarhumah', 'Fotokopi Kartu Keluarga', 'Surat keterangan RS/dokter', 'Formulir permohonan'] },
  { jenis: 'Surat Pengantar', syarat: ['KTP asli', 'Fotokopi Kartu Keluarga', 'Surat keterangan tujuan penggunaan'] },
];

const JADWAL_PELAYANAN = [
  { hari: 'Senin',          jam: '08:00 – 16:00 WITA', jenis: 'Pelayanan Umum',     buka: true  },
  { hari: 'Selasa',         jam: '08:00 – 16:00 WITA', jenis: 'Pelayanan Umum',     buka: true  },
  { hari: 'Rabu',           jam: '08:00 – 16:00 WITA', jenis: 'Pelayanan Umum',     buka: true  },
  { hari: 'Kamis',          jam: '08:00 – 12:00 WITA', jenis: 'Pelayanan Terbatas', buka: true  },
  { hari: 'Jumat',          jam: '08:00 – 11:30 WITA', jenis: 'Pelayanan Terbatas', buka: true  },
  { hari: 'Sabtu – Minggu', jam: 'TUTUP',               jenis: 'Libur',              buka: false },
];

const STRUKTUR_DESA = [
  { nama: 'Ibrahim Mokodompit', jabatan: 'Kepala Desa',              periode: '2021 – 2027', inisial: 'IM',  gradient: 'from-blue-600 to-blue-800'    },
  { nama: 'Fatmawati Mamonto',  jabatan: 'Sekretaris Desa',          periode: '2021 – 2027', inisial: 'FM',  gradient: 'from-emerald-600 to-emerald-800' },
  { nama: 'Rizky Makalalag',    jabatan: 'Kaur Umum & Perencanaan',  periode: '2022 – 2028', inisial: 'RM',  gradient: 'from-violet-600 to-violet-800'  },
  { nama: 'Hasan Mamonto',      jabatan: 'Kepala Dusun 1',           periode: '2021 – 2027', inisial: 'HM',  gradient: 'from-amber-600 to-amber-800'   },
  { nama: 'Jefri Sumual',       jabatan: 'Kepala Dusun 2',           periode: '2021 – 2027', inisial: 'JS',  gradient: 'from-cyan-600 to-cyan-800'     },
  { nama: 'Ismail Monoarfa',    jabatan: 'Kepala Dusun 3',           periode: '2023 – 2029', inisial: 'IMo', gradient: 'from-rose-600 to-rose-800'     },
  { nama: 'Arifin Pomalingo',   jabatan: 'Kepala Dusun 4',           periode: '2023 – 2029', inisial: 'AP',  gradient: 'from-indigo-600 to-indigo-800' },
];

const APBDES = {
  tahun: 2026,
  totalAnggaran: 1_250_000_000,
  realisasi:       487_500_000,
  kategori: [
    { nama: 'Infrastruktur Desa',         anggaran: 450_000_000, realisasi: 180_000_000, warna: 'bg-blue-500'    },
    { nama: 'Pendidikan & Kesehatan',     anggaran: 300_000_000, realisasi: 125_000_000, warna: 'bg-emerald-500' },
    { nama: 'Pemberdayaan Masyarakat',    anggaran: 200_000_000, realisasi:  82_500_000, warna: 'bg-amber-500'   },
    { nama: 'Bantuan Sosial',             anggaran: 175_000_000, realisasi:  60_000_000, warna: 'bg-violet-500'  },
    { nama: 'Operasional Pemerintahan',   anggaran: 125_000_000, realisasi:  40_000_000, warna: 'bg-slate-500'   },
  ],
};

// ─── Small Components ─────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg text-xs">
      {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color || entry.fill }}>
          {entry.name || entry.dataKey}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div className="text-center mb-14">
      <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">{eyebrow}</p>
      <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {title}
      </h2>
      <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-600" />
    </div>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  const [ref, visible] = useScrollAnimation();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function Modal({ open, onClose, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto modal-enter"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function APBDesBar({ percent, colorClass, delay = 0 }) {
  const [ref, visible] = useScrollAnimation(0.1);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setWidth(percent), delay);
      return () => clearTimeout(t);
    }
  }, [visible, percent, delay]);
  return (
    <div ref={ref} className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
      <div
        className={`h-full rounded-full apbdes-bar ${colorClass}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]             = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen]         = useState(false);
  const [stats, setStats]                   = useState(null);
  const [profil, setProfil]                 = useState(null);
  const [activeSection, setActiveSection]   = useState('beranda');
  const [showBackToTop, setShowBackToTop]   = useState(false);
  const [showWA, setShowWA]                 = useState(false);
  const [openFaq, setOpenFaq]               = useState(null);

  // Cek Status Surat
  const [statusInput,   setStatusInput]   = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusResult,  setStatusResult]  = useState(null);  // data | null
  const [statusError,   setStatusError]   = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Modals
  const [showPersyaratan, setShowPersyaratan] = useState(false);
  const [showJadwal, setShowJadwal]           = useState(false);

  // Contact form
  const [contactNama,     setContactNama]     = useState('');
  const [contactWA,       setContactWA]       = useState('');
  const [contactPesan,    setContactPesan]    = useState('');
  const [contactErrors,   setContactErrors]   = useState({});

  useEffect(() => {
    document.title = 'SIDESA — Desa Motoboi Kecil';
    const onScroll = () => {
      const y = window.scrollY;
      const totalH = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 50);
      setShowBackToTop(y > 500);
      setShowWA(y > 300);
      setScrollProgress(totalH > 0 ? (y / totalH) * 100 : 0);
      const ids = ['kontak', 'layanan', 'statistik', 'profil', 'beranda'];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/public/stats')
      .then(r => r.json())
      .then(r => { if (r.success) setStats(r.data); })
      .catch(() => {});
    fetch('/api/public/profil-desa')
      .then(r => r.json())
      .then(r => { if (r.success) setProfil(r.data); })
      .catch(() => {});
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Count-up
  const pendudukCount = useCountUp(stats?.totalPenduduk,       1200, !!stats);
  const kkCount       = useCountUp(stats?.totalKK,             1200, !!stats);
  const suratCount    = useCountUp(stats?.totalSuratBulanIni,  1200, !!stats);
  const mutasiCount   = useCountUp(stats?.totalMutasiBulanIni, 1200, !!stats);

  const heroStats = [
    { icon: Users,          label: 'Total Penduduk',   value: pendudukCount, iconBg: 'bg-blue-500/30',    iconColor: 'text-blue-200',    topColor: '#3b82f6' },
    { icon: Home,           label: 'Kartu Keluarga',   value: kkCount,       iconBg: 'bg-emerald-500/30', iconColor: 'text-emerald-200',  topColor: '#10b981' },
    { icon: FileText,       label: 'Surat Bulan Ini',  value: suratCount,    iconBg: 'bg-violet-500/30',  iconColor: 'text-violet-200',   topColor: '#8b5cf6' },
    { icon: ArrowLeftRight, label: 'Mutasi Bulan Ini', value: mutasiCount,   iconBg: 'bg-amber-500/30',   iconColor: 'text-amber-200',    topColor: '#f59e0b' },
  ];

  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLakiLaki  || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ];
  const totalGender = (stats?.pendudukLakiLaki || 0) + (stats?.pendudukPerempuan || 0);

  const misiLines     = profil?.misiDesa ? profil.misiDesa.split('\n').filter(Boolean) : [];
  const kadesInitials = (profil?.namaKades || 'IM').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const todayIdx      = new Date().getDay();
  const isWeekday     = todayIdx >= 1 && todayIdx <= 5;

  const apbdesPct = Math.round((APBDES.realisasi / APBDES.totalAnggaran) * 100);
  const apbdesPieData = APBDES.kategori.map((k, i) => ({
    name: k.nama, value: k.anggaran, fill: APBDES_PIE_COLORS[i],
  }));

  // Cek status surat
  const handleCekStatus = async () => {
    const nomor = statusInput.trim();
    if (!nomor) return;
    setStatusLoading(true);
    setStatusResult(null);
    setStatusError(false);
    try {
      const res  = await fetch(`/api/public/status-surat/${encodeURIComponent(nomor)}`);
      const data = await res.json();
      if (data.success) {
        setStatusResult(data.data);
      } else {
        setStatusError(true);
      }
    } catch {
      setStatusError(true);
    } finally {
      setStatusLoading(false);
      setShowStatusModal(true);
    }
  };

  // Contact form submit → WhatsApp
  const handleContactSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (contactNama.trim().length < 3)    errs.nama    = 'Nama minimal 3 karakter';
    if (!/^08\d{8,11}$/.test(contactWA.trim()))  errs.wa      = 'Format: 08xxxxxxxxxx (10–13 digit)';
    if (contactPesan.trim().length < 10)  errs.pesan   = 'Pesan minimal 10 karakter';
    if (Object.keys(errs).length) { setContactErrors(errs); return; }
    setContactErrors({});
    const msg = encodeURIComponent(
      `Halo, saya ${contactNama.trim()} (${contactWA.trim()}).\n\n${contactPesan.trim()}\n\nTerima kasih.`
    );
    window.open(`https://wa.me/6243412345?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ SCROLL PROGRESS ═════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-[width] duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ═══ NAVBAR ══════════════════════════════════════════════════════ */}
      <nav className={`fixed top-1 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button onClick={() => scrollTo('beranda')} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}
                   style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>SIDESA</p>
                <p className={`text-[10px] leading-tight transition-colors ${scrolled ? 'text-slate-500' : 'text-blue-200'}`}>
                  Desa Motoboi Kecil
                </p>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`relative text-sm font-medium transition-colors ${
                      scrolled
                        ? isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                        : isActive ? 'text-white'    : 'text-white/75 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${scrolled ? 'bg-blue-600' : 'bg-white'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className={`hidden md:inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  scrolled
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    : 'bg-white/15 text-white border border-white/30 hover:bg-white/25'
                }`}
              >
                Masuk Sistem <ArrowRight className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`md:hidden rounded-lg p-2 transition-colors ${
                  scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="md:hidden border-t border-white/10 bg-slate-950/96 backdrop-blur-sm pb-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block w-full px-4 py-3 text-left text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="px-4 pt-3">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Masuk Sistem
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ═══ HERO ════════════════════════════════════════════════════════ */}
      <section id="beranda" className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'float 10s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'float 7s ease-in-out infinite 4s' }} />
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute rounded-full bg-white pointer-events-none"
               style={{ top: p.top, left: p.left, width: `${p.size}px`, height: `${p.size}px`,
                        animation: `particleFloat ${p.dur} ease-in-out infinite`, animationDelay: p.delay }} />
        ))}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="mb-6 flex justify-center fade-in-up" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sistem Informasi Kependudukan Desa
            </span>
          </div>

          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl fade-in-up"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.1, animationDelay: '150ms' }}>
            DESA MOTOBOI
            <span className="block text-blue-400"> KECIL</span>
          </h1>

          <p className="mt-4 text-center text-lg text-blue-200 font-medium fade-in-up" style={{ animationDelay: '300ms' }}>
            Kecamatan Kotamobagu Selatan · Kota Kotamobagu · Sulawesi Utara
          </p>
          <p className="mt-3 text-center text-base text-blue-100/70 max-w-xl mx-auto fade-in-up" style={{ animationDelay: '450ms' }}>
            Melayani masyarakat dengan teknologi modern untuk administrasi desa yang transparan dan efisien.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4 fade-in-up" style={{ animationDelay: '600ms' }}>
            <button onClick={() => scrollTo('statistik')}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-all hover:shadow-xl">
              <BarChart2 className="h-4 w-4" /> Lihat Statistik
            </button>
            <button onClick={() => scrollTo('cek-status')}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all">
              <Search className="h-4 w-4" /> Cek Status Surat
            </button>
          </div>

          {/* Hero stat cards */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 fade-in-up" style={{ animationDelay: '750ms' }}>
            {heroStats.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label}
                     className="rounded-2xl border border-white/15 bg-white/10 overflow-hidden backdrop-blur-sm
                                transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
                  <div className="h-[3px]" style={{ background: item.topColor }} />
                  <div className="p-5 text-center">
                    <div className="mb-3 flex justify-center">
                      <div className={`rounded-xl p-2.5 ${item.iconBg}`}>
                        <Icon className={`h-5 w-5 ${item.iconColor}`} />
                      </div>
                    </div>
                    <p className="text-4xl font-bold text-white counter-text"
                       style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {stats ? item.value.toLocaleString('id-ID') : (
                        <span className="inline-block h-9 w-14 rounded-lg bg-white/25 animate-pulse align-middle" />
                      )}
                    </p>
                    <p className="mt-1.5 text-xs font-medium text-white/60">{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300/50">
          <span className="text-xs">Gulir ke bawah</span>
          <div className="h-6 w-px bg-blue-300/30" style={{ animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══ CEK STATUS SURAT ════════════════════════════════════════════ */}
      <section id="cek-status" className="bg-gradient-to-r from-blue-600 to-blue-700 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/20 mb-4">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Cek Status Surat
            </h2>
            <p className="mt-2 text-blue-200 text-sm">Masukkan nomor surat untuk mengecek status terkini</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={statusInput}
              onChange={e => setStatusInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCekStatus()}
              placeholder="Contoh: 001/SKD/MB/II/2026"
              className="flex-1 h-12 rounded-xl border-0 bg-white/15 px-4 text-white placeholder-blue-300 backdrop-blur-sm
                         focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
            />
            <button
              onClick={handleCekStatus}
              disabled={statusLoading || !statusInput.trim()}
              className="h-12 px-7 rounded-xl bg-white text-blue-700 font-semibold text-sm
                         hover:bg-blue-50 transition-all shadow-lg disabled:opacity-60 disabled:cursor-not-allowed
                         flex items-center gap-2 justify-center shrink-0"
            >
              {statusLoading ? (
                <span className="h-4 w-4 rounded-full border-2 border-blue-700 border-t-transparent animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Cek Status
            </button>
          </div>
        </div>
      </section>

      {/* ═══ QUICK ACTION CARDS ══════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-blue-600 mb-8">Layanan Cepat</p>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                icon: Search, title: 'Cek Status Surat', desc: 'Lacak status surat Anda secara real-time',
                iconBg: 'bg-blue-50 text-blue-600', border: 'hover:border-blue-200', onClick: () => scrollTo('cek-status'),
              },
              {
                icon: FileText, title: 'Persyaratan Surat', desc: 'Lihat syarat & dokumen yang perlu disiapkan',
                iconBg: 'bg-emerald-50 text-emerald-600', border: 'hover:border-emerald-200', onClick: () => setShowPersyaratan(true),
              },
              {
                icon: Clock, title: 'Jadwal Pelayanan', desc: 'Lihat jadwal layanan desa mingguan',
                iconBg: 'bg-amber-50 text-amber-600', border: 'hover:border-amber-200', onClick: () => setShowJadwal(true),
              },
              {
                icon: Phone, title: 'Hubungi Kami', desc: 'Kontak langsung Kantor Desa',
                iconBg: 'bg-violet-50 text-violet-600', border: 'hover:border-violet-200', onClick: () => scrollTo('kontak'),
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <Reveal key={card.title} delay={i * 80}>
                  <button
                    onClick={card.onClick}
                    className={`group w-full rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm
                                transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg ${card.border} text-left`}
                  >
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${card.iconBg} mx-auto
                                     transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm text-center"
                       style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{card.title}</p>
                    <p className="mt-1.5 text-xs text-slate-500 text-center leading-relaxed">{card.desc}</p>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PENGUMUMAN ══════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Informasi Terkini" title="Pengumuman Desa" /></Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PENGUMUMAN.map((item, i) => {
              const c = PENGUMUMAN_COLORS[item.warna];
              return (
                <Reveal key={item.judul} delay={i * 100}>
                  <div className={`rounded-xl bg-white border border-slate-100 border-t-4 ${c.border} shadow-sm
                                   hover:-translate-y-1 hover:shadow-md transition-all duration-300 overflow-hidden h-full flex flex-col`}>
                    <div className="p-6 flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <item.icon className={`h-4 w-4 shrink-0 ${c.icon}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${c.badge}`}>
                          {item.kategori}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 leading-snug"
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{item.judul}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{item.isi}</p>
                    </div>
                    <div className="px-6 pb-4 flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" /> {item.tanggal}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PROFIL DESA ═════════════════════════════════════════════════ */}
      <section id="profil" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Tentang Kami" title="Profil Desa" /></Reveal>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 h-full">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6">
                  <MapPin className="h-4 w-4 text-blue-600" /> Informasi Desa
                </h3>
                <div className="space-y-3">
                  {[
                    ['Nama Desa',      profil?.namaDesa       || 'Motoboi Kecil'],
                    ['Kecamatan',      profil?.kecamatan      || 'Kotamobagu Selatan'],
                    ['Kabupaten/Kota', profil?.kabupatenKota  || 'Kota Kotamobagu'],
                    ['Provinsi',       profil?.provinsi       || 'Sulawesi Utara'],
                    ['Kode Pos',       profil?.kodePos        || '95717'],
                    ['Telepon',        profil?.telepon        || '(0434) 123456'],
                    ['Alamat Kantor',  profil?.alamatKantor   || 'Jl. Trans Sulawesi, Motoboi Kecil'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-4 text-sm">
                      <span className="w-32 flex-shrink-0 text-slate-500">{label}</span>
                      <span className="text-slate-800 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <div className="space-y-5">
              <Reveal delay={100}>
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white text-xl font-bold"
                         style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {kadesInitials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Kepala Desa</p>
                      <p className="text-lg font-bold text-slate-900 mt-0.5"
                         style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {profil?.namaKades || 'Ibrahim Mokodompit'}
                      </p>
                      {profil?.nipKades && <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {profil.nipKades}</p>}
                    </div>
                  </div>
                  <blockquote className="mt-5 border-l-4 border-blue-400 pl-4 text-sm italic text-slate-600">
                    "Kami berkomitmen memberikan pelayanan terbaik bagi seluruh warga desa Motoboi Kecil."
                  </blockquote>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Kontak & Jam Operasional</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Desa Motoboi Kecil'}, {profil?.kodePos || '95717'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{profil?.telepon || '(0434) 123456'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      <span>{profil?.email || 'desa.motoboi@kotamobagu.go.id'}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 mb-2">Jam Operasional</p>
                      {[
                        { hari: 'Senin – Jumat', jam: '08:00 – 16:00 WITA', buka: true  },
                        { hari: 'Sabtu – Minggu', jam: 'Tutup',             buka: false },
                      ].map(({ hari, jam, buka }) => (
                        <div key={hari} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs mb-1
                              ${buka && isWeekday ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>
                          <span className="font-medium">{hari}</span>
                          <span className={buka ? 'font-semibold' : 'text-slate-400'}>{jam}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {(profil?.visiDesa || profil?.misiDesa) && (
            <Reveal delay={100} className="mt-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {profil?.visiDesa && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">Visi</h3>
                    <p className="text-slate-700 leading-relaxed">{profil.visiDesa}</p>
                  </div>
                )}
                {profil?.misiDesa && (
                  <div className="rounded-2xl border border-slate-100 bg-white p-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600 mb-3">Misi</h3>
                    <ol className="space-y-2">
                      {misiLines.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-slate-700">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">{i + 1}</span>
                          {item.replace(/^\d+\.\s*/, '')}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* ═══ SAMBUTAN KEPALA DESA ════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-8 sm:p-12 overflow-hidden">
              <span className="absolute top-2 left-4 text-[120px] leading-none font-serif text-blue-200/40 select-none pointer-events-none">"</span>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xl font-bold shadow-lg"
                     style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {kadesInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Sambutan</p>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Kepala Desa</h2>
                </div>
              </div>
              <div className="relative z-10 space-y-4 text-slate-600 leading-relaxed italic">
                <p>Assalamualaikum Warahmatullahi Wabarakatuh.</p>
                <p>Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya.
                   Dengan hadirnya Sistem Informasi Kependudukan Desa (SIDESA), kami berharap pelayanan administrasi
                   di Desa Motoboi Kecil dapat semakin cepat, transparan, dan akuntabel.</p>
                <p>Kami mengajak seluruh warga untuk memanfaatkan layanan ini demi kemajuan desa kita bersama.
                   Bersama-sama, kita wujudkan desa yang maju, mandiri, dan sejahtera.</p>
                <p>Wassalamualaikum Warahmatullahi Wabarakatuh.</p>
              </div>
              <div className="mt-8 relative z-10">
                <div className="h-px w-24 bg-blue-300 mb-4" />
                <p className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {profil?.namaKades || 'Ibrahim Mokodompit'}
                </p>
                <p className="text-sm text-blue-600">Kepala Desa Motoboi Kecil</p>
              </div>
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-10"
                   style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', transform: 'translate(30%, 30%)' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STRUKTUR PEMERINTAHAN ═══════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Organisasi" title="Struktur Pemerintahan Desa" /></Reveal>

          {/* Desktop hierarchy */}
          <div className="hidden md:flex flex-col items-center">
            {/* Kades */}
            <Reveal>
              <div className="relative w-64 rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xl font-bold shadow-md"
                     style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {STRUKTUR_DESA[0].inisial}
                </div>
                <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {STRUKTUR_DESA[0].nama}
                </p>
                <p className="text-xs font-medium text-blue-600 mt-0.5">{STRUKTUR_DESA[0].jabatan}</p>
                <p className="text-[10px] text-slate-400 mt-1">{STRUKTUR_DESA[0].periode}</p>
              </div>
            </Reveal>

            {/* Connector Kades → Row 2 */}
            <div className="w-px h-8 bg-slate-300" />

            {/* Sekdes + Kaur row */}
            <div className="relative flex items-start gap-16">
              {/* Horizontal connector */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px bg-slate-300" />
              {[STRUKTUR_DESA[1], STRUKTUR_DESA[2]].map((p, i) => (
                <Reveal key={p.nama} delay={i * 100}>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-slate-300" />
                    <div className="w-48 rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-white text-base font-bold`}
                           style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {p.inisial}
                      </div>
                      <p className="font-semibold text-slate-900 text-xs" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.nama}</p>
                      <p className="text-[11px] font-medium text-blue-600 mt-0.5">{p.jabatan}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{p.periode}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Connector Row 2 → Kadus */}
            <div className="w-px h-8 bg-slate-300" />

            {/* 4 Kadus row */}
            <div className="relative flex items-start gap-6">
              {/* Horizontal connector */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-px bg-slate-300" />
              {STRUKTUR_DESA.slice(3).map((p, i) => (
                <Reveal key={p.nama} delay={i * 80}>
                  <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-slate-300" />
                    <div className="w-32 rounded-xl border border-slate-100 bg-white p-4 text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${p.gradient} text-white text-sm font-bold`}
                           style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {p.inisial}
                      </div>
                      <p className="font-semibold text-slate-900 text-[11px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.nama}</p>
                      <p className="text-[10px] font-medium text-blue-600 mt-0.5">{p.jabatan}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.periode}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile: vertical stack */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {STRUKTUR_DESA.map((p, i) => (
              <Reveal key={p.nama} delay={i * 60}>
                <div className={`flex items-center gap-4 rounded-2xl border bg-white p-5 shadow-sm
                  ${i === 0 ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-white' : 'border-slate-100'}`}>
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${p.gradient} text-white text-lg font-bold shadow`}
                       style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {p.inisial}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.nama}</p>
                    <p className="text-xs font-medium text-blue-600">{p.jabatan}</p>
                    <p className="text-xs text-slate-400">{p.periode}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATISTIK ═══════════════════════════════════════════════════ */}
      <section id="statistik" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Data Terkini" title="Statistik Penduduk" /></Reveal>

          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Penduduk', value: stats?.totalPenduduk,     color: 'text-blue-600'    },
              { label: 'Laki-laki',      value: stats?.pendudukLakiLaki,  color: 'text-blue-500'    },
              { label: 'Perempuan',      value: stats?.pendudukPerempuan, color: 'text-rose-500'    },
              { label: 'Kartu Keluarga', value: stats?.totalKK,           color: 'text-emerald-600' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 80}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                  {stats ? (
                    <p className={`text-3xl font-bold ${item.color}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {(item.value || 0).toLocaleString('id-ID')}
                    </p>
                  ) : (
                    <div className="h-9 w-16 mx-auto rounded-lg bg-slate-100 animate-pulse" />
                  )}
                  <p className="mt-1 text-xs text-slate-500">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {stats && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Komposisi Jenis Kelamin</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                           paddingAngle={4} dataKey="value" animationBegin={0} animationDuration={1200}>
                        {genderData.map((_, i) => <Cell key={i} fill={GENDER_COLORS[i]} strokeWidth={0} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {genderData.map((d, i) => (
                      <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: GENDER_COLORS[i] }} />
                        {d.name} — <span className="font-semibold">{d.value}</span>
                        {totalGender > 0 && <span className="text-slate-400">({((d.value / totalGender) * 100).toFixed(0)}%)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Penduduk per Dusun</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.perDusun || []} margin={{ top: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="dusun" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="jumlah" name="Penduduk" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200}>
                        {(stats.perDusun || []).map((_, i) => <Cell key={i} fill={DUSUN_COLORS[i % DUSUN_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Reveal>

              <Reveal delay={150}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Komposisi Agama</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={(stats.perAgama || []).slice().sort((a, b) => b.jumlah - a.jumlah)} layout="vertical" margin={{ left: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis dataKey="agama" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={60} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="jumlah" name="Penduduk" radius={[0, 4, 4, 0]} animationBegin={0} animationDuration={1200}>
                        {(stats.perAgama || []).map((_, i) => <Cell key={i} fill={AGAMA_COLORS[i % AGAMA_COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4">Kelompok Umur</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.perKelompokUmur || []} margin={{ top: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="kelompok" tick={{ fontSize: 8.5, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="lakiLaki"  name="Laki-laki" fill="#3b82f6" radius={[4,4,0,0]} animationBegin={0} animationDuration={1200} />
                      <Bar dataKey="perempuan" name="Perempuan" fill="#f472b6" radius={[4,4,0,0]} animationBegin={0} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Reveal>
            </div>
          )}

          {!stats && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-4 w-40 rounded bg-slate-100 animate-pulse mb-4" />
                  <div className="h-[220px] rounded-xl bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ TRANSPARANSI APBDes ═════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Keuangan Desa" title={`Transparansi APBDes ${APBDES.tahun}`} /></Reveal>

          {/* Summary card */}
          <Reveal>
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Anggaran</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1"
                     style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {formatRupiah(APBDES.totalAnggaran)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Realisasi</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1"
                     style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {formatRupiah(APBDES.realisasi)}
                  </p>
                  <p className="text-sm text-slate-400">{apbdesPct}% terserap</p>
                </div>
              </div>
              {/* Total progress bar */}
              <APBDesBar percent={apbdesPct} colorClass="bg-gradient-to-r from-blue-500 to-blue-600" />
              <p className="text-xs text-slate-400 mt-2 text-right">
                {apbdesPct}% dari total anggaran telah direalisasikan
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Donut chart */}
            <Reveal>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-full">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Komposisi Anggaran</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={apbdesPieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                         paddingAngle={3} dataKey="value" animationBegin={0} animationDuration={1200}>
                      {apbdesPieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatRupiah(v)} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <div className="mt-2 space-y-1.5">
                  {APBDES.kategori.map((k, i) => (
                    <div key={k.nama} className="flex items-center justify-between text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: APBDES_PIE_COLORS[i] }} />
                        <span>{k.nama}</span>
                      </div>
                      <span className="font-semibold">{formatRupiah(k.anggaran)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Per-kategori progress */}
            <Reveal delay={100}>
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm h-full">
                <h3 className="text-sm font-semibold text-slate-700 mb-5">Realisasi per Kategori</h3>
                <div className="space-y-5">
                  {APBDES.kategori.map((k, i) => {
                    const pct = Math.round((k.realisasi / k.anggaran) * 100);
                    return (
                      <div key={k.nama}>
                        <div className="flex items-center justify-between text-sm mb-1.5">
                          <span className="font-medium text-slate-700">{k.nama}</span>
                          <span className="text-xs text-slate-400">{pct}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                          <span>{formatRupiah(k.anggaran)}</span>
                          <span className="text-blue-600 font-medium">{formatRupiah(k.realisasi)} terserap</span>
                        </div>
                        <APBDesBar percent={pct} colorClass={k.warna} delay={i * 100} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={100} className="mt-6">
            <p className="text-center text-xs text-slate-400">
              ℹ️ Data berdasarkan Laporan APBDes Semester I Tahun {APBDES.tahun}. Angka bersifat indikatif.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ LAYANAN ═════════════════════════════════════════════════════ */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Pelayanan" title="Layanan Administrasi" /></Reveal>
          <Reveal>
            <p className="text-center text-slate-500 max-w-xl mx-auto text-sm -mt-8 mb-12">
              Desa Motoboi Kecil menyediakan berbagai layanan surat keterangan untuk keperluan administrasi warga.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <Reveal key={service.title} delay={i * 80}>
                <div className={`group rounded-xl border border-slate-100 bg-white p-6 shadow-sm
                                  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-t-4 ${service.color} h-full`}>
                  <div className={`mb-4 inline-flex rounded-xl p-3 transition-transform duration-300 group-hover:scale-110 ${service.iconBg}`}>
                    <service.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {service.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} className="mt-10">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
              <p className="text-sm text-slate-600">
                Untuk mengurus surat, silakan datang ke{' '}
                <span className="font-semibold text-slate-800">Kantor Desa Motoboi Kecil</span>
                {' '}atau hubungi kami di{' '}
                <span className="font-semibold text-blue-700">{profil?.telepon || '(0434) 123456'}</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ ALUR PENGURUSAN ══════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Prosedur" title="Alur Pengurusan Surat" /></Reveal>

          <div className="hidden md:flex items-start justify-between">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-1 items-start">
                <Reveal delay={i * 120} className="flex flex-col items-center flex-1">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                                   bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-center max-w-[160px]">
                    <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
                    {step.badge && (
                      <span className="mt-2 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {step.badge}
                      </span>
                    )}
                  </div>
                </Reveal>
                {i < STEPS.length - 1 && (
                  <div className="mt-7 flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-slate-200 mx-3 min-w-6" />
                )}
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                                     bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
                      <step.icon className="h-5 w-5" />
                    </div>
                    {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-blue-200 mt-2 min-h-[24px]" />}
                  </div>
                  <div className="pb-6">
                    <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                    {step.badge && (
                      <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {step.badge}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Bantuan" title="Pertanyaan Umum" /></Reveal>
          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <Reveal key={i} delay={i * 50}>
                  <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className="font-medium text-slate-900 text-sm leading-snug">{faq.q}</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div style={{ maxHeight: isOpen ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
                      <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PETA + KONTAK ═══════════════════════════════════════════════ */}
      <section id="kontak" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal><SectionHeader eyebrow="Kunjungi Kami" title="Lokasi & Kontak" /></Reveal>

          <Reveal>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="flex flex-col lg:flex-row">
                {/* Map */}
                <div className="lg:w-3/5 h-72 lg:h-[480px]">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=124.26%2C0.69%2C124.34%2C0.75&layer=mapnik&marker=0.7188%2C124.2995"
                    style={{ border: 0, width: '100%', height: '100%' }}
                    allowFullScreen loading="lazy"
                    title="Peta Lokasi Desa Motoboi Kecil"
                  />
                </div>

                {/* Info + Form */}
                <div className="lg:w-2/5 bg-white p-8 flex flex-col justify-between overflow-y-auto">
                  {/* Info */}
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      📍 Kantor Desa Motoboi Kecil
                    </h3>
                    <div className="space-y-3 text-sm text-slate-600 mb-5">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Desa Motoboi Kecil'}</p>
                          <p>Kec. Kotamobagu Selatan, {profil?.kodePos || '95717'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>{profil?.telepon || '(0434) 123456'}</span>
                      </div>
                    </div>

                    <div className="mb-6">
                      {[
                        { hari: 'Senin – Jumat', jam: '08:00 – 16:00 WITA', buka: true  },
                        { hari: 'Sabtu',         jam: 'Tutup',               buka: false },
                        { hari: 'Minggu',        jam: 'Tutup',               buka: false },
                      ].map(({ hari, jam, buka }) => (
                        <div key={hari} className={`flex items-center justify-between text-xs rounded-lg px-3 py-1.5 mb-1
                              ${buka && isWeekday ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'}`}>
                          <span className="font-medium">{hari}</span>
                          <span>{jam}</span>
                        </div>
                      ))}
                    </div>

                    <a href="https://maps.google.com/?q=0.7188,124.2995" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white
                                  hover:bg-blue-700 transition-colors mb-8">
                      <Globe className="h-4 w-4" /> Buka di Google Maps
                    </a>
                  </div>

                  {/* Contact form */}
                  <div className="border-t border-slate-100 pt-6">
                    <h4 className="font-semibold text-slate-900 text-sm mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      📬 Kirim Pesan via WhatsApp
                    </h4>
                    <form onSubmit={handleContactSubmit} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          placeholder="Nama Lengkap *"
                          value={contactNama}
                          onChange={e => setContactNama(e.target.value)}
                          className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors
                            ${contactErrors.nama ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                        />
                        {contactErrors.nama && <p className="text-xs text-red-500 mt-1">{contactErrors.nama}</p>}
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="No. WhatsApp * (08xxxxxxxxxx)"
                          value={contactWA}
                          onChange={e => setContactWA(e.target.value)}
                          className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors
                            ${contactErrors.wa ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                        />
                        {contactErrors.wa && <p className="text-xs text-red-500 mt-1">{contactErrors.wa}</p>}
                      </div>
                      <div>
                        <textarea
                          placeholder="Pesan *"
                          value={contactPesan}
                          onChange={e => setContactPesan(e.target.value)}
                          rows={3}
                          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors resize-none
                            ${contactErrors.pesan ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'}`}
                        />
                        {contactErrors.pesan && <p className="text-xs text-red-500 mt-1">{contactErrors.pesan}</p>}
                      </div>
                      <button
                        type="submit"
                        className="w-full h-10 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors
                                   flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        Kirim via WhatsApp
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="bg-slate-900 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>SIDESA</p>
                  <p className="text-[10px] text-slate-500">Desa Motoboi Kecil</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                Sistem Informasi Kependudukan Desa Motoboi Kecil — hadir untuk pelayanan yang lebih baik dan transparan.
              </p>
              <div className="flex items-center gap-2">
                {[{ icon: Share2, label: 'Facebook' }, { icon: Globe, label: 'Website' }, { icon: Mail, label: 'Email' }].map(({ icon: Icon, label }) => (
                  <a key={label} href="#" title={label}
                     className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button onClick={() => scrollTo(link.id)}
                            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                      <ChevronRight className="h-3 w-3" /> {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button onClick={() => navigate('/login')}
                          className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3" /> Login Sistem
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Kontak</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Motoboi Kecil'}, {profil?.kodePos || '95717'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Phone className="h-4 w-4 shrink-0" />
                  <span>{profil?.telepon || '(0434) 123456'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>{profil?.email || 'desa.motoboi@kotamobagu.go.id'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© 2026 SIDESA Desa Motoboi Kecil. Hak cipta dilindungi.</p>
            <p className="text-xs text-slate-600">Dibuat dengan ❤️ untuk Desa Motoboi Kecil</p>
          </div>
        </div>
      </footer>

      {/* ═══ WHATSAPP FLOATING BUTTON ════════════════════════════════════ */}
      {showWA && (
        <a
          href={`https://wa.me/6243412345?text=${encodeURIComponent('Halo, saya ingin bertanya tentang layanan di Desa Motoboi Kecil.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 left-8 z-50 group"
          aria-label="Chat WhatsApp"
        >
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-25" />
          <div className="relative w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl
                           flex items-center justify-center transition-all duration-300 hover:scale-110">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          </div>
          <div className="absolute left-16 bottom-2 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-slate-700 font-medium
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Chat via WhatsApp
          </div>
        </a>
      )}

      {/* ═══ BACK TO TOP ══════════════════════════════════════════════════ */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full
                     bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300"
          title="Kembali ke atas"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}

      {/* ═══ MODAL: CEK STATUS SURAT ════════════════════════════════════ */}
      <Modal open={showStatusModal} onClose={() => { setShowStatusModal(false); setStatusInput(''); }}>
        <div className="p-8">
          {statusResult ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mb-3">
                  <CheckCircle className="h-7 w-7 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Surat Ditemukan
                </h3>
              </div>
              <div className="space-y-3 mb-6">
                {[
                  ['Nomor Surat',    statusResult.nomorSurat],
                  ['Jenis',          JENIS_LABEL[statusResult.jenisSurat] || statusResult.jenisSurat],
                  ['Pemohon',        statusResult.penduduk?.namaLengkap || '-'],
                  ['Tanggal Ajuan',  new Date(statusResult.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })],
                  ['Tgl Disetujui',  statusResult.approvedAt ? new Date(statusResult.approvedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 text-sm">
                    <span className="w-32 shrink-0 text-slate-500">{label}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
                <div className="flex gap-4 text-sm">
                  <span className="w-32 shrink-0 text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Disetujui
                  </span>
                </div>
              </div>
              {/* Timeline */}
              <div className="rounded-xl bg-slate-50 p-4 mb-6">
                <p className="text-xs font-semibold text-slate-500 mb-3">Timeline</p>
                <div className="flex items-center gap-2">
                  {['Dibuat', 'Diproses', 'Disetujui'].map((step, i, arr) => (
                    <div key={step} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold
                          ${i < 2 ? 'bg-blue-600 text-white' : 'bg-emerald-500 text-white'}`}>
                          {i < 2 ? i + 1 : '✓'}
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">{step}</p>
                      </div>
                      {i < arr.length - 1 && <div className="flex-1 h-0.5 bg-blue-300 -mt-4" />}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100 mb-3">
                  <X className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Tidak Ditemukan
                </h3>
              </div>
              <div className="text-center mb-6">
                <p className="text-sm text-slate-600">
                  Surat dengan nomor tersebut tidak ditemukan atau belum disetujui.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  Pastikan nomor surat benar atau hubungi Kantor Desa untuk informasi lebih lanjut.
                </p>
              </div>
            </>
          )}
          <button
            onClick={() => { setShowStatusModal(false); setStatusInput(''); }}
            className="w-full h-10 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>

      {/* ═══ MODAL: PERSYARATAN SURAT ═══════════════════════════════════ */}
      <Modal open={showPersyaratan} onClose={() => setShowPersyaratan(false)}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Persyaratan Surat
            </h3>
            <button onClick={() => setShowPersyaratan(false)} className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="space-y-5">
            {PERSYARATAN.map((item) => (
              <div key={item.jenis} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900 text-sm mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {item.jenis}
                </p>
                <ul className="space-y-1">
                  {item.syarat.map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowPersyaratan(false)}
            className="mt-6 w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Mengerti
          </button>
        </div>
      </Modal>

      {/* ═══ MODAL: JADWAL PELAYANAN ════════════════════════════════════ */}
      <Modal open={showJadwal} onClose={() => setShowJadwal(false)}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Jadwal Pelayanan
            </h3>
            <button onClick={() => setShowJadwal(false)} className="rounded-lg p-1.5 hover:bg-slate-100 transition-colors">
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>
          <div className="space-y-2">
            {JADWAL_PELAYANAN.map((j) => (
              <div key={j.hari}
                   className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm
                     ${j.buka && isWeekday && ['Senin','Selasa','Rabu','Kamis','Jumat'].includes(j.hari) ? 'bg-emerald-50 border border-emerald-100' : 'bg-slate-50'}`}>
                <div>
                  <span className="font-medium text-slate-900">{j.hari}</span>
                  {j.buka && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{j.jenis}</span>
                  )}
                </div>
                <span className={`font-semibold text-xs ${j.buka ? 'text-emerald-700' : 'text-red-500'}`}>{j.jam}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-xs text-blue-700">
            Datang lebih awal untuk mendapatkan pelayanan yang optimal.
          </div>
          <button
            onClick={() => setShowJadwal(false)}
            className="mt-5 w-full h-10 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Tutup
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default LandingPage;
