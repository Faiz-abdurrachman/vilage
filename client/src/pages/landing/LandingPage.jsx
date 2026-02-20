import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Home, FileText, ArrowLeftRight, Building2, Menu, X,
  MapPin, Phone, Mail, ChevronRight, BarChart2, FileCheck,
  Briefcase, Baby, Feather, Send, ArrowRight, ChevronUp, ChevronDown,
  MessageSquare, Settings, CheckCircle, Calendar, Bell, Info, AlertTriangle,
  Globe, Share2,
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

// ─── Constants ───────────────────────────────────────────────────────

const GENDER_COLORS = ['#3b82f6', '#f43f5e'];
const AGAMA_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];
const DUSUN_COLORS = ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

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
  { icon: FileCheck, title: 'SK Domisili',    desc: 'Surat keterangan bukti domisili atau tempat tinggal di wilayah desa.',               color: 'border-blue-500',    iconBg: 'bg-blue-50 text-blue-600'    },
  { icon: FileText,  title: 'SKTM',           desc: 'Surat Keterangan Tidak Mampu untuk keperluan bantuan sosial, beasiswa, dll.',         color: 'border-emerald-500', iconBg: 'bg-emerald-50 text-emerald-600' },
  { icon: Briefcase, title: 'SK Usaha',       desc: 'Surat keterangan bukti kepemilikan usaha di wilayah desa.',                          color: 'border-violet-500',  iconBg: 'bg-violet-50 text-violet-600'  },
  { icon: Baby,      title: 'SK Kelahiran',   desc: 'Pencatatan dan penerbitan surat keterangan kelahiran warga desa.',                    color: 'border-amber-500',   iconBg: 'bg-amber-50 text-amber-600'   },
  { icon: Feather,   title: 'SK Kematian',    desc: 'Pencatatan dan penerbitan surat keterangan kematian warga desa.',                     color: 'border-rose-500',    iconBg: 'bg-rose-50 text-rose-600'     },
  { icon: Send,      title: 'Surat Pengantar',desc: 'Surat pengantar dari desa untuk berbagai keperluan administrasi.',                   color: 'border-cyan-500',    iconBg: 'bg-cyan-50 text-cyan-600'     },
];

const STEPS = [
  { num: 1, icon: Building2,    title: 'Datang ke Kantor Desa',  desc: 'Kunjungi Kantor Desa pada hari dan jam kerja.',                        badge: '08:00–16:00 WITA' },
  { num: 2, icon: MessageSquare,title: 'Sampaikan Keperluan',     desc: 'Sampaikan jenis surat yang dibutuhkan kepada petugas desa.',            badge: null                },
  { num: 3, icon: Settings,      title: 'Petugas Memproses',       desc: 'Petugas akan memverifikasi data dan mencetak surat keterangan.',        badge: '1–2 hari kerja'    },
  { num: 4, icon: CheckCircle,   title: 'Surat Siap Diambil',      desc: 'Surat ditandatangani Kepala Desa dan siap untuk Anda ambil.',           badge: 'GRATIS!'           },
];

const NAV_LINKS = [
  { label: 'Beranda',    id: 'beranda'   },
  { label: 'Profil Desa',id: 'profil'    },
  { label: 'Statistik',  id: 'statistik' },
  { label: 'Layanan',    id: 'layanan'   },
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

// ─── Main Component ───────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [profil, setProfil] = useState(null);
  const [activeSection, setActiveSection] = useState('beranda');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    document.title = 'SIDESA — Desa Motoboi Kecil';
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      setShowBackToTop(y > 500);
      // active section detection
      const ids = ['layanan', 'statistik', 'profil', 'beranda'];
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
      .then((r) => r.json())
      .then((r) => { if (r.success) setStats(r.data); })
      .catch(() => {});
    fetch('/api/public/profil-desa')
      .then((r) => r.json())
      .then((r) => { if (r.success) setProfil(r.data); })
      .catch(() => {});
  }, []);

  const scrollTo = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Count-up hooks
  const pendudukCount  = useCountUp(stats?.totalPenduduk,      1200, !!stats);
  const kkCount        = useCountUp(stats?.totalKK,            1200, !!stats);
  const suratCount     = useCountUp(stats?.totalSuratBulanIni, 1200, !!stats);
  const mutasiCount    = useCountUp(stats?.totalMutasiBulanIni,1200, !!stats);

  const heroStats = [
    { icon: Users,          label: 'Total Penduduk',   value: pendudukCount, iconBg: 'bg-blue-500/30',    iconColor: 'text-blue-200',    topColor: '#3b82f6' },
    { icon: Home,           label: 'Kartu Keluarga',   value: kkCount,       iconBg: 'bg-emerald-500/30', iconColor: 'text-emerald-200',  topColor: '#10b981' },
    { icon: FileText,       label: 'Surat Bulan Ini',  value: suratCount,    iconBg: 'bg-violet-500/30',  iconColor: 'text-violet-200',   topColor: '#8b5cf6' },
    { icon: ArrowLeftRight, label: 'Mutasi Bulan Ini', value: mutasiCount,   iconBg: 'bg-amber-500/30',   iconColor: 'text-amber-200',    topColor: '#f59e0b' },
  ];

  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLakiLaki || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ];
  const totalGender = (stats?.pendudukLakiLaki || 0) + (stats?.pendudukPerempuan || 0);

  const misiLines = profil?.misiDesa ? profil.misiDesa.split('\n').filter(Boolean) : [];
  const kadesInitials = (profil?.namaKades || 'IM').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  // Day-of-week for jam operasional highlight
  const todayIdx = new Date().getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const isWeekday = todayIdx >= 1 && todayIdx <= 5;

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ NAVBAR ══════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
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

            {/* Desktop nav links */}
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
                        : isActive ? 'text-white' : 'text-white/75 hover:text-white'
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

            {/* CTA + Hamburger */}
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

          {/* Mobile dropdown */}
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
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />

        {/* Floating blobs */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'float 10s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full opacity-10 blur-3xl"
             style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'float 7s ease-in-out infinite 4s' }} />

        {/* Particles */}
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white pointer-events-none"
            style={{
              top: p.top, left: p.left,
              width: `${p.size}px`, height: `${p.size}px`,
              animation: `particleFloat ${p.dur} ease-in-out infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Badge */}
          <div className="mb-6 flex justify-center fade-in-up" style={{ animationDelay: '0ms' }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sistem Informasi Kependudukan Desa
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl fade-in-up"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.1, animationDelay: '150ms' }}>
            DESA MOTOBOI
            <span className="block text-blue-400"> KECIL</span>
          </h1>

          <p className="mt-4 text-center text-lg text-blue-200 font-medium fade-in-up"
             style={{ animationDelay: '300ms' }}>
            Kecamatan Kotamobagu Selatan · Kota Kotamobagu · Sulawesi Utara
          </p>
          <p className="mt-3 text-center text-base text-blue-100/70 max-w-xl mx-auto fade-in-up"
             style={{ animationDelay: '450ms' }}>
            Melayani masyarakat dengan teknologi modern untuk administrasi desa yang transparan dan efisien.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 fade-in-up" style={{ animationDelay: '600ms' }}>
            <button
              onClick={() => scrollTo('statistik')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-all hover:shadow-xl"
            >
              <BarChart2 className="h-4 w-4" /> Lihat Statistik
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              Masuk Sistem <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Hero stat cards */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 fade-in-up" style={{ animationDelay: '750ms' }}>
            {heroStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-white/10 overflow-hidden backdrop-blur-sm
                             transition-all duration-300 hover:bg-white/15 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"
                >
                  {/* Colored accent top bar */}
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

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300/50">
          <span className="text-xs">Gulir ke bawah</span>
          <div className="h-6 w-px bg-blue-300/30" style={{ animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ═══ PENGUMUMAN ══════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Informasi Terkini" title="Pengumuman Desa" />
          </Reveal>
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
                          style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                        {item.judul}
                      </h3>
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
          <Reveal>
            <SectionHeader eyebrow="Tentang Kami" title="Profil Desa" />
          </Reveal>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Info desa */}
            <Reveal>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8 h-full">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6"
                    style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  <MapPin className="h-4 w-4 text-blue-600" /> Informasi Desa
                </h3>
                <div className="space-y-3">
                  {[
                    ['Nama Desa',      profil?.namaDesa       || 'Motoboi Kecil'],
                    ['Kecamatan',      profil?.kecamatan      || 'Kotamobagu Selatan'],
                    ['Kabupaten/Kota', profil?.kabupatenKota  || 'Kota Kotamobagu'],
                    ['Provinsi',       profil?.provinsi       || 'Sulawesi Utara'],
                    ['Kode Pos',       profil?.kodePos        || '95716'],
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

            {/* Kepala Desa + Kontak */}
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
                      {profil?.nipKades && (
                        <p className="text-xs text-slate-500 font-mono mt-0.5">NIP. {profil.nipKades}</p>
                      )}
                    </div>
                  </div>
                  <blockquote className="mt-5 border-l-4 border-blue-400 pl-4 text-sm italic text-slate-600">
                    "Kami berkomitmen memberikan pelayanan terbaik bagi seluruh warga desa Motoboi Kecil."
                  </blockquote>
                </div>
              </Reveal>

              {/* Kontak — selalu tampil */}
              <Reveal delay={200}>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Kontak & Jam Operasional
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Desa Motoboi Kecil'}, {profil?.kodePos || '95716'}</span>
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
                      <div className="space-y-1">
                        {[
                          { hari: 'Senin – Jumat', jam: '08:00 – 16:00 WITA', buka: true },
                          { hari: 'Sabtu – Minggu', jam: 'Tutup', buka: false },
                        ].map(({ hari, jam, buka }) => (
                          <div key={hari} className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs
                                ${buka && isWeekday ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'}`}>
                            <span className="font-medium">{hari}</span>
                            <span className={buka ? 'font-semibold' : 'text-slate-400'}>{jam}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Visi & Misi */}
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
              {/* Giant quote mark */}
              <span className="absolute top-2 left-4 text-[120px] leading-none font-serif text-blue-200/40 select-none pointer-events-none">"</span>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xl font-bold shadow-lg"
                     style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {kadesInitials}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Sambutan</p>
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Kepala Desa
                  </h2>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 space-y-4 text-slate-600 leading-relaxed italic">
                <p>Assalamualaikum Warahmatullahi Wabarakatuh.</p>
                <p>
                  Puji syukur kita panjatkan ke hadirat Tuhan Yang Maha Esa atas segala rahmat dan karunia-Nya.
                  Dengan hadirnya Sistem Informasi Kependudukan Desa (SIDESA), kami berharap pelayanan administrasi
                  di Desa Motoboi Kecil dapat semakin cepat, transparan, dan akuntabel.
                </p>
                <p>
                  Kami mengajak seluruh warga untuk memanfaatkan layanan ini demi kemajuan desa kita bersama.
                  Bersama-sama, kita wujudkan desa yang maju, mandiri, dan sejahtera.
                </p>
                <p>Wassalamualaikum Warahmatullahi Wabarakatuh.</p>
              </div>

              {/* Signature */}
              <div className="mt-8 relative z-10">
                <div className="h-px w-24 bg-blue-300 mb-4" />
                <p className="font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {profil?.namaKades || 'Ibrahim Mokodompit'}
                </p>
                <p className="text-sm text-blue-600">Kepala Desa Motoboi Kecil</p>
              </div>

              {/* Decorative circle bottom-right */}
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-10"
                   style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', transform: 'translate(30%, 30%)' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STATISTIK ═══════════════════════════════════════════════════ */}
      <section id="statistik" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Data Terkini" title="Statistik Penduduk" />
          </Reveal>

          {/* Summary cards */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Penduduk', value: stats?.totalPenduduk,      color: 'text-blue-600'    },
              { label: 'Laki-laki',      value: stats?.pendudukLakiLaki,   color: 'text-blue-500'    },
              { label: 'Perempuan',      value: stats?.pendudukPerempuan,  color: 'text-rose-500'    },
              { label: 'Kartu Keluarga', value: stats?.totalKK,            color: 'text-emerald-600' },
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

          {/* Charts */}
          {stats && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Reveal>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Komposisi Jenis Kelamin
                  </h3>
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
                  <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Penduduk per Dusun
                  </h3>
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
                  <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Komposisi Agama
                  </h3>
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
                  <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    Kelompok Umur
                  </h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={stats.perKelompokUmur || []} margin={{ top: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="kelompok" tick={{ fontSize: 8.5, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="lakiLaki" name="Laki-laki" fill="#3b82f6" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200} />
                      <Bar dataKey="perempuan" name="Perempuan" fill="#f472b6" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Reveal>
            </div>
          )}

          {/* Loading skeleton for charts */}
          {!stats && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="h-4 w-40 rounded bg-slate-100 animate-pulse mb-4" />
                  <div className="h-[220px] rounded-xl bg-slate-100 animate-pulse" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ LAYANAN ═════════════════════════════════════════════════════ */}
      <section id="layanan" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Pelayanan" title="Layanan Administrasi" />
          </Reveal>
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
          <Reveal>
            <SectionHeader eyebrow="Prosedur" title="Alur Pengurusan Surat" />
          </Reveal>

          {/* Desktop: horizontal */}
          <div className="hidden md:flex items-start justify-between">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-1 items-start">
                <Reveal delay={i * 120} className="flex flex-col items-center flex-1">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl
                                   bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/30">
                    <step.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-center max-w-[160px]">
                    <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {step.title}
                    </p>
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

          {/* Mobile: vertical */}
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
          <Reveal>
            <SectionHeader eyebrow="Bantuan" title="Pertanyaan Umum" />
          </Reveal>

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
                    <div style={{
                      maxHeight: isOpen ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease',
                    }}>
                      <p className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ PETA LOKASI ══════════════════════════════════════════════════ */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeader eyebrow="Kunjungi Kami" title="Lokasi Kantor Desa" />
          </Reveal>

          <Reveal>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <div className="flex flex-col lg:flex-row">
                {/* Map */}
                <div className="lg:w-3/5 h-72 lg:h-[420px]">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=124.28%2C0.68%2C124.35%2C0.74&layer=mapnik&marker=0.7167%2C124.3167"
                    style={{ border: 0, width: '100%', height: '100%' }}
                    allowFullScreen
                    loading="lazy"
                    title="Peta Lokasi Desa Motoboi Kecil"
                  />
                </div>

                {/* Info */}
                <div className="lg:w-2/5 bg-white p-8 flex flex-col justify-center">
                  <h3 className="font-bold text-slate-900 text-lg mb-6"
                      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    📍 Kantor Desa Motoboi Kecil
                  </h3>

                  <div className="space-y-4 text-sm text-slate-600">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Desa Motoboi Kecil'}</p>
                        <p>Kec. Kotamobagu Selatan</p>
                        <p>Kota Kotamobagu, Sulawesi Utara {profil?.kodePos || '95716'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>{profil?.telepon || '(0434) 123456'}</span>
                    </div>
                  </div>

                  {/* Jam operasional */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Jam Operasional</p>
                    <div className="space-y-2">
                      {[
                        { hari: 'Senin – Jumat', jam: '08:00 – 16:00 WITA', buka: true  },
                        { hari: 'Sabtu',          jam: 'Tutup',               buka: false },
                        { hari: 'Minggu',          jam: 'Tutup',               buka: false },
                      ].map(({ hari, jam, buka }) => (
                        <div key={hari} className={`flex items-center justify-between text-sm rounded-lg px-3 py-1.5
                              ${buka && isWeekday ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'}`}>
                          <span className="font-medium">{hari}</span>
                          <span>{jam}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="https://maps.google.com/?q=0.7167,124.3167"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white
                               hover:bg-blue-700 transition-colors self-start"
                  >
                    <Globe className="h-4 w-4" />
                    Buka di Google Maps
                  </a>
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
            {/* Brand */}
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
              {/* Social links */}
              <div className="flex items-center gap-2">
                {[
                  { icon: Share2, label: 'Facebook' },
                  { icon: Globe,  label: 'Website'  },
                  { icon: Mail,   label: 'Email'     },
                ].map(({ icon: Icon, label }) => (
                  <a key={label} href="#" title={label}
                     className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-all">
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Nav */}
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

            {/* Kontak */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Kontak</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 text-sm text-slate-400">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{profil?.alamatKantor || 'Jl. Trans Sulawesi, Motoboi Kecil'}, {profil?.kodePos || '95716'}</span>
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
            <p className="text-xs text-slate-600">
              Dibuat dengan ❤️ untuk Desa Motoboi Kecil
            </p>
          </div>
        </div>
      </footer>

      {/* ═══ BACK TO TOP ══════════════════════════════════════════════════ */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full
                     bg-blue-600 text-white shadow-lg hover:bg-blue-700 hover:scale-110
                     transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
          title="Kembali ke atas"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}

export default LandingPage;
