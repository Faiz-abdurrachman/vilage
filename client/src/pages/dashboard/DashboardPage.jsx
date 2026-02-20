import { useEffect } from 'react';
import { Users, Home, ArrowLeftRight, FileText, UserCheck, UserX } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import { useDashboardStats, useDemografi, useMutasiBulanan } from '@/hooks/useDashboard';
import { useAuth } from '@/context/AuthContext';
import StatCard from '@/components/shared/StatCard';

const GENDER_COLORS = ['#3b82f6', '#f43f5e'];
const AGAMA_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const DUSUN_COLORS = ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-lg text-xs">
      {label && <p className="font-semibold text-slate-700 mb-1">{label}</p>}
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function ChartCard({ title, children, isLoading }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {title}
      </h3>
      {isLoading ? (
        <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
      ) : (
        children
      )}
    </div>
  );
}

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

  return (
    <div className="space-y-6 page-enter">
      {/* Welcome section */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 text-white shadow-lg shadow-blue-600/20">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Selamat datang, {user?.namaLengkap?.split(' ')[0]}! 
            </h1>
            <p className="mt-1 text-sm text-blue-100">
              Berikut ringkasan data kependudukan Desa Motoboi Kecil
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-200">Terakhir diperbarui</p>
            <p className="text-sm font-medium text-white">{timeStr}</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Penduduk"
          value={stats?.totalPenduduk}
          icon={Users}
          description="Penduduk aktif terdaftar"
          sub={`${stats?.pendudukLakiLaki ?? 0} L · ${stats?.pendudukPerempuan ?? 0} P`}
          color="blue"
          isLoading={statsLoading}
        />
        <StatCard
          title="Kartu Keluarga"
          value={stats?.totalKK}
          icon={Home}
          description="Keluarga terdaftar"
          color="green"
          isLoading={statsLoading}
        />
        <StatCard
          title="Mutasi Bulan Ini"
          value={stats?.totalMutasiBulanIni}
          icon={ArrowLeftRight}
          description="Perubahan penduduk"
          color="orange"
          isLoading={statsLoading}
        />
        <StatCard
          title="Surat Bulan Ini"
          value={stats?.totalSuratBulanIni}
          icon={FileText}
          description="Permohonan surat"
          color="purple"
          isLoading={statsLoading}
        />
      </div>

      {/* Mini status cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Laki-laki', value: stats?.pendudukLakiLaki, color: 'text-blue-600 bg-blue-50' },
          { label: 'Perempuan', value: stats?.pendudukPerempuan, color: 'text-rose-600 bg-rose-50' },
          { label: 'Telah Meninggal', value: stats?.totalPendudukMeninggal, color: 'text-slate-600 bg-slate-50' },
          { label: 'Pindah', value: stats?.totalPendudukPindah, color: 'text-purple-600 bg-purple-50' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4">
            <div className={`flex-1 min-w-0`}>
              <p className={`text-2xl font-bold counter-text ${item.color.split(' ')[0]}`} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {(item.value ?? 0).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{item.label}</p>
            </div>
            <div className={`h-10 w-10 shrink-0 rounded-xl ${item.color.split(' ')[1]} flex items-center justify-center`}>
              <Users className={`h-5 w-5 ${item.color.split(' ')[0]}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Gender + Agama */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Donut chart gender */}
        <ChartCard title="Komposisi Jenis Kelamin" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%" cy="50%"
                innerRadius={60} outerRadius={88}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {genderData.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2">
            {genderData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: GENDER_COLORS[i] }} />
                <span>{d.name}</span>
                <span className="font-semibold text-slate-800">
                  {d.value} ({totalGender ? ((d.value / totalGender) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Agama horizontal bar */}
        <ChartCard title="Komposisi Agama" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={(demografi?.perAgama || []).slice().sort((a, b) => b.jumlah - a.jumlah)}
              layout="vertical"
              margin={{ left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="agama" type="category" tick={{ fontSize: 11, fill: '#64748b' }} width={60} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" name="Penduduk" radius={[0, 4, 4, 0]} animationBegin={0} animationDuration={1200}>
                {(demografi?.perAgama || []).map((_, i) => (
                  <Cell key={i} fill={AGAMA_COLORS[i % AGAMA_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 2: Per Dusun + Kelompok Umur */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Penduduk per Dusun" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demografi?.perDusun || []} margin={{ top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="dusun" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" name="Penduduk" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200}>
                {(demografi?.perDusun || []).map((_, i) => (
                  <Cell key={i} fill={DUSUN_COLORS[i % DUSUN_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Kelompok Umur" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demografi?.perKelompokUmur || []} margin={{ top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="kelompok" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="lakiLaki" name="Laki-laki" fill="#3b82f6" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200} />
              <Bar dataKey="perempuan" name="Perempuan" fill="#f472b6" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Row 3: Pendidikan + Tren Mutasi */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ChartCard title="Tingkat Pendidikan" isLoading={demografiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={demografi?.perPendidikan || []} margin={{ top: 4 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="pendidikan" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="jumlah" name="Penduduk" fill="#10b981" radius={[4, 4, 0, 0]} animationBegin={0} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tren Mutasi 12 Bulan Terakhir" isLoading={mutasiLoading}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mutasiBulanan || []} margin={{ top: 4 }}>
              <defs>
                <linearGradient id="gLahir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gMasuk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="lahir" name="Lahir" stroke="#3b82f6" strokeWidth={2} fill="url(#gLahir)" dot={false} animationBegin={0} animationDuration={1200} />
              <Area type="monotone" dataKey="meninggal" name="Meninggal" stroke="#6b7280" strokeWidth={2} fill="none" dot={false} animationBegin={0} animationDuration={1200} />
              <Area type="monotone" dataKey="pindahMasuk" name="Masuk" stroke="#10b981" strokeWidth={2} fill="url(#gMasuk)" dot={false} animationBegin={0} animationDuration={1200} />
              <Area type="monotone" dataKey="pindahKeluar" name="Keluar" stroke="#f59e0b" strokeWidth={2} fill="none" dot={false} animationBegin={0} animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Top Pekerjaan */}
      {demografi?.perPekerjaan && demografi.perPekerjaan.length > 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-4" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            10 Pekerjaan Terbanyak
          </h3>
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
                  return (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 text-slate-400 text-xs">{i + 1}</td>
                      <td className="py-2.5 font-medium text-slate-700">{item.pekerjaan}</td>
                      <td className="py-2.5 text-right font-bold text-slate-900">{item.jumlah}</td>
                      <td className="py-2.5 text-right hidden sm:table-cell">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(pct, 100)}%` }} />
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
