import { useEffect } from 'react';
import { Users, Home, ArrowLeftRight, FileText } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList,
  AreaChart, Area,
} from 'recharts';
import { useDashboardStats, useDemografi, useMutasiBulanan } from '@/hooks/useDashboard';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/shared/StatCard';
import {
  GENDER_COLORS, AGAMA_COLORS, DUSUN_COLORS, PENDIDIKAN_COLORS,
  UMUR_LAKI, UMUR_WANITA, MUTASI_COLORS,
  GRID_STYLE, AXIS_STYLE, AXIS_Y_STYLE, LEGEND_STYLE, ANIMATION_CONFIG, TOOLTIP_STYLE,
  buildTooltipContent, BarValueLabel, HBarValueLabel,
} from '@/lib/chartConfig';

// ── Shared Components ─────────────────────────────────────────

const CustomTooltip = buildTooltipContent();

function ChartCard({ title, subtitle, children, isLoading, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          {title}
        </h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          <div className="h-44 animate-pulse rounded-xl bg-slate-100" />
          <div className="flex gap-3 justify-center">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}

// Donut center label overlay
function DonutCenter({ label, value, color }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <span className="text-2xl font-bold" style={{ color, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {(value || 0).toLocaleString('id-ID')}
      </span>
      <span className="text-[10px] font-medium text-slate-400 mt-0.5">{label}</span>
    </div>
  );
}

// ── Gradient Defs ─────────────────────────────────────────────
function ChartGradients() {
  return (
    <defs>
      {/* Area chart gradients */}
      <linearGradient id="gLahir" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={MUTASI_COLORS.lahir} stopOpacity={0.2} />
        <stop offset="100%" stopColor={MUTASI_COLORS.lahir} stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gMasuk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={MUTASI_COLORS.pindahMasuk} stopOpacity={0.2} />
        <stop offset="100%" stopColor={MUTASI_COLORS.pindahMasuk} stopOpacity={0} />
      </linearGradient>
      <linearGradient id="gKeluar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={MUTASI_COLORS.pindahKeluar} stopOpacity={0.15} />
        <stop offset="100%" stopColor={MUTASI_COLORS.pindahKeluar} stopOpacity={0} />
      </linearGradient>
      {/* Bar gradients */}
      <linearGradient id="gBlue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
      </linearGradient>
      <linearGradient id="gEmerald" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
        <stop offset="100%" stopColor="#059669" stopOpacity={1} />
      </linearGradient>
      <linearGradient id="gLaki" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={UMUR_LAKI} stopOpacity={1} />
        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={1} />
      </linearGradient>
      <linearGradient id="gWanita" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={UMUR_WANITA} stopOpacity={1} />
        <stop offset="100%" stopColor="#db2777" stopOpacity={1} />
      </linearGradient>
    </defs>
  );
}

// ── Dashboard Page ────────────────────────────────────────────
function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: demografi, isLoading: demografiLoading } = useDemografi();
  const { data: mutasiBulanan, isLoading: mutasiLoading } = useMutasiBulanan();

  useEffect(() => {
    document.title = 'Dashboard | SIDESA';
  }, []);

  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLakiLaki || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ];
  const totalGender = genderData.reduce((s, d) => s + d.value, 0);

  const now = new Date();
  const timeStr = now.toLocaleString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  // Sorted agama data
  const agamaData = (demografi?.perAgama || []).slice().sort((a, b) => b.jumlah - a.jumlah);

  return (
    <div className="space-y-6 page-enter">

      {/* ── Welcome Banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-5 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Selamat datang, {user?.namaLengkap?.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              Ringkasan data kependudukan Desa Motoboi Kecil
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Terakhir diperbarui</p>
            <p className="text-sm font-medium text-white">{timeStr}</p>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Penduduk" value={stats?.totalPenduduk} icon={Users}
          description="Penduduk aktif terdaftar"
          sub={`${stats?.pendudukLakiLaki ?? 0} L · ${stats?.pendudukPerempuan ?? 0} P`}
          color="blue" isLoading={statsLoading} />
        <StatCard title="Kartu Keluarga" value={stats?.totalKK} icon={Home}
          description="Keluarga terdaftar" color="green" isLoading={statsLoading} />
        <StatCard title="Mutasi Bulan Ini" value={stats?.totalMutasiBulanIni} icon={ArrowLeftRight}
          description="Perubahan penduduk" color="orange" isLoading={statsLoading} />
        <StatCard title="Surat Bulan Ini" value={stats?.totalSuratBulanIni} icon={FileText}
          description="Permohonan surat" color="purple" isLoading={statsLoading} />
      </div>

      {/* ── Mini Status Cards ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Laki-laki',     value: stats?.pendudukLakiLaki,      color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Perempuan',     value: stats?.pendudukPerempuan,     color: 'text-rose-500',   bg: 'bg-rose-50' },
          { label: 'Telah Meninggal',value: stats?.totalPendudukMeninggal,color: 'text-slate-500', bg: 'bg-slate-50' },
          { label: 'Pindah',        value: stats?.totalPendudukPindah,   color: 'text-violet-600', bg: 'bg-violet-50' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex-1 min-w-0">
              <p className={`text-2xl font-bold counter-text ${item.color}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {(item.value ?? 0).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{item.label}</p>
            </div>
            <div className={`h-10 w-10 shrink-0 rounded-xl ${item.bg} flex items-center justify-center`}>
              <Users className={`h-5 w-5 ${item.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 1: Donut Gender + Agama ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Donut Gender */}
        <ChartCard title="Komposisi Jenis Kelamin" subtitle="Berdasarkan data penduduk aktif" isLoading={demografiLoading}>
          <div className="relative" style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <ChartGradients />
                <Pie
                  data={genderData}
                  cx="50%" cy="50%"
                  innerRadius={68} outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  {...ANIMATION_CONFIG}
                >
                  {genderData.map((_, i) => (
                    <Cell key={i} fill={GENDER_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              </PieChart>
            </ResponsiveContainer>
            <DonutCenter label="Total" value={totalGender} color="#1d4ed8" />
          </div>
          {/* Custom legend */}
          <div className="flex justify-center gap-6 mt-3">
            {genderData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: GENDER_COLORS[i] }} />
                <span className="text-slate-500">{d.name}</span>
                <span className="font-bold text-slate-800">
                  {d.value.toLocaleString('id-ID')}
                  <span className="font-normal text-slate-400 ml-1">
                    ({totalGender ? ((d.value / totalGender) * 100).toFixed(1) : 0}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Agama horizontal bar */}
        <ChartCard title="Komposisi Agama" subtitle="Distribusi agama penduduk" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={agamaData} layout="vertical" margin={{ left: 8, right: 40, top: 4 }}>
              <ChartGradients />
              <CartesianGrid {...GRID_STYLE} horizontal={false} />
              <XAxis type="number" {...AXIS_STYLE} />
              <YAxis dataKey="agama" type="category" width={65} {...AXIS_Y_STYLE} />
              <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              <Bar dataKey="jumlah" name="Penduduk" radius={[0, 4, 4, 0]} {...ANIMATION_CONFIG}>
                {agamaData.map((_, i) => (
                  <Cell key={i} fill={AGAMA_COLORS[i % AGAMA_COLORS.length]} />
                ))}
                <LabelList dataKey="jumlah" content={<HBarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 2: Dusun + Kelompok Umur ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Dusun vertical bar */}
        <ChartCard title="Penduduk per Dusun" subtitle="Jumlah penduduk aktif per wilayah" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={demografi?.perDusun || []} margin={{ top: 18, right: 8, bottom: 4 }}>
              <ChartGradients />
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="dusun" {...AXIS_STYLE} />
              <YAxis {...AXIS_Y_STYLE} />
              <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              <Bar dataKey="jumlah" name="Penduduk" radius={[6, 6, 0, 0]} {...ANIMATION_CONFIG}>
                {(demografi?.perDusun || []).map((_, i) => (
                  <Cell key={i} fill={DUSUN_COLORS[i % DUSUN_COLORS.length]} />
                ))}
                <LabelList dataKey="jumlah" content={<BarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Kelompok Umur grouped bar */}
        <ChartCard title="Kelompok Umur" subtitle="Distribusi usia berdasarkan jenis kelamin" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={demografi?.perKelompokUmur || []} margin={{ top: 18, right: 8, bottom: 4 }} barGap={2}>
              <ChartGradients />
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="kelompok" {...AXIS_STYLE} tick={{ ...AXIS_STYLE.tick, fontSize: 9 }} />
              <YAxis {...AXIS_Y_STYLE} />
              <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              <Legend {...LEGEND_STYLE} />
              <Bar dataKey="lakiLaki" name="Laki-laki" fill="url(#gLaki)" radius={[4, 4, 0, 0]} {...ANIMATION_CONFIG}>
                <LabelList dataKey="lakiLaki" content={<BarValueLabel />} />
              </Bar>
              <Bar dataKey="perempuan" name="Perempuan" fill="url(#gWanita)" radius={[4, 4, 0, 0]} {...ANIMATION_CONFIG}>
                <LabelList dataKey="perempuan" content={<BarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Row 3: Pendidikan + Mutasi Tren ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Pendidikan vertical bar */}
        <ChartCard title="Tingkat Pendidikan" subtitle="Distribusi jenjang pendidikan" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={demografi?.perPendidikan || []} margin={{ top: 18, right: 8, bottom: 4 }}>
              <ChartGradients />
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis dataKey="pendidikan" {...AXIS_STYLE} />
              <YAxis {...AXIS_Y_STYLE} />
              <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              <Bar dataKey="jumlah" name="Penduduk" radius={[6, 6, 0, 0]} {...ANIMATION_CONFIG}>
                {(demografi?.perPendidikan || []).map((_, i) => (
                  <Cell key={i} fill={PENDIDIKAN_COLORS[i % PENDIDIKAN_COLORS.length]} />
                ))}
                <LabelList dataKey="jumlah" content={<BarValueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Mutasi Tren Area */}
        <ChartCard title="Tren Mutasi 12 Bulan" subtitle="Pergerakan penduduk per bulan" isLoading={mutasiLoading}>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={mutasiBulanan || []} margin={{ top: 4, right: 8, bottom: 4 }}>
              <defs>
                <linearGradient id="gLahir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MUTASI_COLORS.lahir} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={MUTASI_COLORS.lahir} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MUTASI_COLORS.pindahMasuk} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={MUTASI_COLORS.pindahMasuk} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gKeluar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={MUTASI_COLORS.pindahKeluar} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={MUTASI_COLORS.pindahKeluar} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis dataKey="bulan" {...AXIS_STYLE} tick={{ ...AXIS_STYLE.tick, fontSize: 9 }} />
              <YAxis {...AXIS_Y_STYLE} />
              <Tooltip content={<CustomTooltip />} {...TOOLTIP_STYLE} />
              <Legend {...LEGEND_STYLE} />
              <Area type="monotone" dataKey="lahir" name="Lahir"
                stroke={MUTASI_COLORS.lahir} strokeWidth={2.5} fill="url(#gLahir)"
                dot={{ r: 3, fill: MUTASI_COLORS.lahir, strokeWidth: 0 }}
                activeDot={{ r: 5 }} {...ANIMATION_CONFIG} />
              <Area type="monotone" dataKey="meninggal" name="Meninggal"
                stroke={MUTASI_COLORS.meninggal} strokeWidth={2} fill="none"
                dot={{ r: 3, fill: MUTASI_COLORS.meninggal, strokeWidth: 0 }}
                activeDot={{ r: 5 }} {...ANIMATION_CONFIG} />
              <Area type="monotone" dataKey="pindahMasuk" name="Masuk"
                stroke={MUTASI_COLORS.pindahMasuk} strokeWidth={2.5} fill="url(#gMasuk)"
                dot={{ r: 3, fill: MUTASI_COLORS.pindahMasuk, strokeWidth: 0 }}
                activeDot={{ r: 5 }} {...ANIMATION_CONFIG} />
              <Area type="monotone" dataKey="pindahKeluar" name="Keluar"
                stroke={MUTASI_COLORS.pindahKeluar} strokeWidth={2} fill="url(#gKeluar)"
                dot={{ r: 3, fill: MUTASI_COLORS.pindahKeluar, strokeWidth: 0 }}
                activeDot={{ r: 5 }} {...ANIMATION_CONFIG} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Top Pekerjaan ── */}
      {demografi?.perPekerjaan && demografi.perPekerjaan.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-800" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              10 Pekerjaan Terbanyak
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">Distribusi pekerjaan penduduk aktif</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">No</th>
                  <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Pekerjaan</th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Jumlah</th>
                  <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {demografi.perPekerjaan.map((item, i) => {
                  const total = stats?.totalPenduduk || 1;
                  const pct = ((item.jumlah / total) * 100).toFixed(1);
                  const barColors = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f43f5e','#f59e0b','#10b981','#14b8a6','#0ea5e9','#64748b'];
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 text-slate-400 text-xs">{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-700">{item.pekerjaan}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{item.jumlah.toLocaleString('id-ID')}</td>
                      <td className="py-2.5 text-right hidden sm:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${Math.min(pct, 100)}%`, background: barColors[i] || '#3b82f6' }}
                            />
                          </div>
                          <span className="text-xs text-slate-400 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
