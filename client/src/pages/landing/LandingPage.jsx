import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Home, FileText, ArrowLeftRight, Building2, Menu, X,
  MapPin, Phone, Mail, ChevronRight, BarChart2, FileCheck,
  Briefcase, Baby, Feather, Send, ArrowRight,
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

const SERVICES = [
  {
    icon: FileCheck,
    title: 'SK Domisili',
    desc: 'Surat keterangan bukti domisili atau tempat tinggal di wilayah desa.',
    color: 'border-blue-500',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    icon: FileText,
    title: 'SKTM',
    desc: 'Surat Keterangan Tidak Mampu untuk keperluan bantuan sosial, beasiswa, dll.',
    color: 'border-emerald-500',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Briefcase,
    title: 'SK Usaha',
    desc: 'Surat keterangan bukti kepemilikan usaha di wilayah desa.',
    color: 'border-violet-500',
    iconBg: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Baby,
    title: 'SK Kelahiran',
    desc: 'Pencatatan dan penerbitan surat keterangan kelahiran warga desa.',
    color: 'border-amber-500',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Feather,
    title: 'SK Kematian',
    desc: 'Pencatatan dan penerbitan surat keterangan kematian warga desa.',
    color: 'border-rose-500',
    iconBg: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Send,
    title: 'Surat Pengantar',
    desc: 'Surat pengantar dari desa untuk berbagai keperluan administrasi.',
    color: 'border-cyan-500',
    iconBg: 'bg-cyan-50 text-cyan-600',
  },
];

const STEPS = [
  { num: 1, title: 'Datang ke Kantor Desa', desc: 'Kunjungi Kantor Desa Motoboi Kecil pada hari dan jam kerja.' },
  { num: 2, title: 'Sampaikan Keperluan', desc: 'Sampaikan jenis surat yang dibutuhkan kepada petugas.' },
  { num: 3, title: 'Petugas Memproses', desc: 'Petugas akan memproses dan mencetak surat keterangan.' },
  { num: 4, title: 'Surat Siap Diambil', desc: 'Surat ditandatangani Kepala Desa dan siap untuk Anda ambil.' },
];

const NAV_LINKS = [
  { label: 'Beranda', id: 'beranda' },
  { label: 'Profil Desa', id: 'profil' },
  { label: 'Statistik', id: 'statistik' },
  { label: 'Layanan', id: 'layanan' },
];

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

// ─── Main Component ───────────────────────────────────────────────────

function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [profil, setProfil] = useState(null);

  // Navbar scroll effect
  useEffect(() => {
    document.title = 'SIDESA — Desa Motoboi Kecil';
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Fetch public data
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

  // Scroll animation refs
  const [profilRef, profilVisible] = useScrollAnimation();
  const [statsRef, statsVisible] = useScrollAnimation();
  const [layananRef, layananVisible] = useScrollAnimation();
  const [alurRef, alurVisible] = useScrollAnimation();

  // Count-up for hero stat cards
  const pendudukCount = useCountUp(stats?.totalPenduduk, 1200, !!stats);
  const kkCount = useCountUp(stats?.totalKK, 1200, !!stats);
  const suratCount = useCountUp(stats?.totalSuratBulanIni, 1200, !!stats);
  const mutasiCount = useCountUp(stats?.totalMutasiBulanIni, 1200, !!stats);

  const heroStats = [
    { icon: Users, label: 'Penduduk', value: pendudukCount },
    { icon: Home, label: 'Keluarga', value: kkCount },
    { icon: FileText, label: 'Surat (bulan ini)', value: suratCount },
    { icon: ArrowLeftRight, label: 'Mutasi (bulan ini)', value: mutasiCount },
  ];

  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLakiLaki || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ];

  const misiLines = profil?.misiDesa
    ? profil.misiDesa.split('\n').filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* ──── NAVBAR ──────────────────────────────────── */}
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
                   style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  SIDESA
                </p>
                <p className={`text-[10px] leading-tight transition-colors ${scrolled ? 'text-slate-500' : 'text-blue-200'}`}>
                  Desa Motoboi Kecil
                </p>
              </div>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`text-sm font-medium transition-colors hover:text-blue-400 ${
                    scrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
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
                Masuk Sistem
                <ArrowRight className="h-3.5 w-3.5" />
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

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-white/10 bg-slate-950/95 backdrop-blur-sm pb-4">
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

      {/* ──── HERO ───────────────────────────────────── */}
      <section
        id="beranda"
        className="relative min-h-screen flex flex-col justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #1e3a8a 100%)' }}
      >
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />

        {/* Decorative blobs */}
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'float 10s ease-in-out infinite 2s' }} />
        <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full opacity-10"
             style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'float 7s ease-in-out infinite 4s' }} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-200">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
              Sistem Informasi Kependudukan Desa
            </span>
          </div>

          {/* Main title */}
          <h1 className="text-center text-4xl font-bold text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1.1 }}>
            DESA MOTOBOI
            <span className="block text-blue-400"> KECIL</span>
          </h1>

          <p className="mt-4 text-center text-lg text-blue-200 font-medium">
            Kecamatan Kotamobagu Selatan · Kota Kotamobagu · Sulawesi Utara
          </p>
          <p className="mt-3 text-center text-base text-blue-100/70 max-w-xl mx-auto">
            Melayani masyarakat dengan teknologi modern untuk administrasi desa yang transparan dan efisien.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollTo('statistik')}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-blue-900 shadow-lg hover:bg-blue-50 transition-all hover:shadow-xl hover:shadow-white/10"
            >
              <BarChart2 className="h-4 w-4" />
              Lihat Statistik
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              Masuk Sistem
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Hero stat cards */}
          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4">
            {heroStats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/20 bg-white/10 p-5 text-center backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <div className="mb-3 flex justify-center">
                  <div className="rounded-xl bg-white/10 p-2.5">
                    <Icon className="h-5 w-5 text-blue-200" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {stats ? value.toLocaleString('id-ID') : '—'}
                </p>
                <p className="mt-1 text-xs text-blue-200">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-blue-300/60">
          <span className="text-xs">Gulir ke bawah</span>
          <div className="h-6 w-px bg-blue-300/30" style={{ animation: 'float 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ──── PROFIL DESA ────────────────────────────── */}
      <section id="profil" className="bg-white py-20">
        <div
          ref={profilRef}
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            profilVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section header */}
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Tentang Kami</p>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Profil Desa
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-600" />
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Info desa */}
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-8">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-6"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <MapPin className="h-4 w-4 text-blue-600" />
                Informasi Desa
              </h3>
              <div className="space-y-3">
                {[
                  ['Nama Desa', profil?.namaDesa || 'Motoboi Kecil'],
                  ['Kecamatan', profil?.kecamatan || 'Kotamobagu Selatan'],
                  ['Kabupaten/Kota', profil?.kabupatenKota || 'Kota Kotamobagu'],
                  ['Provinsi', profil?.provinsi || 'Sulawesi Utara'],
                  ['Kode Pos', profil?.kodePos || '95716'],
                  ['Telepon', profil?.telepon || '(0434) 123456'],
                  ['Alamat Kantor', profil?.alamatKantor || 'Jl. Trans Sulawesi, Motoboi Kecil'],
                ].map(([label, value]) => (
                  <div key={label} className="flex gap-4 text-sm">
                    <span className="w-32 flex-shrink-0 text-slate-500">{label}</span>
                    <span className="text-slate-800 font-medium">{value || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kepala Desa + quote */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white text-xl font-bold"
                       style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {(profil?.namaKades || 'KD').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Kepala Desa</p>
                    <p className="text-lg font-bold text-slate-900 mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
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

              {/* Kontak */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Kontak</h3>
                <div className="space-y-2">
                  {profil?.telepon && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                      {profil.telepon}
                    </div>
                  )}
                  {profil?.email && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                      {profil.email}
                    </div>
                  )}
                  {profil?.alamatKantor && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                      {profil.alamatKantor}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          {(profil?.visiDesa || profil?.misiDesa) && (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
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
          )}
        </div>
      </section>

      {/* ──── STATISTIK ──────────────────────────────── */}
      <section id="statistik" className="bg-slate-50 py-20">
        <div
          ref={statsRef}
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Data Terkini</p>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Statistik Penduduk
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-600" />
          </div>

          {/* Summary numbers */}
          <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Penduduk', value: stats?.totalPenduduk, color: 'text-blue-600' },
              { label: 'Laki-laki', value: stats?.pendudukLakiLaki, color: 'text-blue-500' },
              { label: 'Perempuan', value: stats?.pendudukPerempuan, color: 'text-rose-500' },
              { label: 'Kartu Keluarga', value: stats?.totalKK, color: 'text-emerald-600' },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <p className={`text-3xl font-bold ${item.color}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {item.value?.toLocaleString('id-ID') ?? '—'}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Charts grid */}
          {stats && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Donut — Jenis Kelamin */}
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
                    </div>
                  ))}
                </div>
              </div>

              {/* HBar — Agama */}
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

              {/* VBar — Per Dusun */}
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

              {/* VBar — Kelompok Umur */}
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
            </div>
          )}
        </div>
      </section>

      {/* ──── LAYANAN ────────────────────────────────── */}
      <section id="layanan" className="bg-white py-20">
        <div
          ref={layananRef}
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            layananVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Pelayanan</p>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Layanan Administrasi
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-600" />
            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm">
              Desa Motoboi Kecil menyediakan berbagai layanan surat keterangan untuk keperluan administrasi warga.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, i) => (
              <div
                key={service.title}
                className={`group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-t-4 ${service.color}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`mb-4 inline-flex rounded-xl p-3 ${service.iconBg}`}>
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {service.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
            <p className="text-sm text-slate-600">
              Untuk mengurus surat, silakan datang ke{' '}
              <span className="font-semibold text-slate-800">Kantor Desa Motoboi Kecil</span>
              {' '}atau hubungi kami di{' '}
              <span className="font-semibold text-blue-700">{profil?.telepon || '(0434) 123456'}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ──── ALUR ───────────────────────────────────── */}
      <section className="bg-slate-50 py-20">
        <div
          ref={alurRef}
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            alurVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Prosedur</p>
            <h2 className="text-3xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Alur Pengurusan Surat
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-blue-600" />
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:flex items-start justify-between">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex flex-1 items-start">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-600/25"
                       style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {step.num}
                  </div>
                  <div className="mt-4 text-center max-w-[160px]">
                    <p className="font-semibold text-slate-900 text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="mt-6 flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-slate-200 mx-2 min-w-8" />
                )}
              </div>
            ))}
          </div>

          {/* Mobile: vertical timeline */}
          <div className="md:hidden space-y-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    {step.num}
                  </div>
                  {i < STEPS.length - 1 && <div className="w-0.5 flex-1 bg-blue-200 mt-2" />}
                </div>
                <div className="pb-6">
                  <p className="font-semibold text-slate-900 text-sm">{step.title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── FOOTER ─────────────────────────────────── */}
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
              <p className="text-sm text-slate-400 leading-relaxed">
                Sistem Informasi Kependudukan Desa Motoboi Kecil — hadir untuk pelayanan yang lebih baik dan transparan.
              </p>
            </div>

            {/* Nav */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Navigasi</h4>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <button
                      onClick={() => scrollTo(link.id)}
                      className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="h-3 w-3" />
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => navigate('/login')}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="h-3 w-3" />
                    Login Sistem
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
                {profil?.email && (
                  <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span>{profil.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">
              © 2026 SIDESA Desa Motoboi Kecil. Hak cipta dilindungi.
            </p>
            <p className="text-xs text-slate-600">
              Kecamatan Kotamobagu Selatan · Kota Kotamobagu · Sulawesi Utara
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
