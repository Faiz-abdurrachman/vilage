import { Users, Home, ArrowLeftRight, FileText, UserCheck, UserX } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import { useDashboardStats, useDemografi, useMutasiBulanan } from '@/hooks/useDashboard';
import StatCard from '@/components/shared/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageLoader } from '@/components/shared/LoadingSpinner';

const AGAMA_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const GENDER_COLORS = ['#3b82f6', '#ec4899'];
const MUTASI_COLORS = { lahir: '#3b82f6', meninggal: '#6b7280', pindahMasuk: '#10b981', pindahKeluar: '#f59e0b' };

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
        <p className="mb-1 text-xs font-semibold text-slate-700">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: demografi, isLoading: demografiLoading } = useDemografi();
  const { data: mutasiBulanan, isLoading: mutasiLoading } = useMutasiBulanan();

  if (statsLoading) return <PageLoader />;

  const genderData = [
    { name: 'Laki-laki', value: stats?.pendudukLakiLaki || 0 },
    { name: 'Perempuan', value: stats?.pendudukPerempuan || 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Ringkasan data kependudukan Desa Motoboi Besar</p>
      </div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Penduduk"
          value={stats?.totalPenduduk}
          icon={Users}
          description="Penduduk aktif terdaftar"
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
          description="Perubahan penduduk bulan ini"
          color="orange"
          isLoading={statsLoading}
        />
        <StatCard
          title="Surat Bulan Ini"
          value={stats?.totalSuratBulanIni}
          icon={FileText}
          description="Permohonan surat bulan ini"
          color="purple"
          isLoading={statsLoading}
        />
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Laki-laki', value: stats?.pendudukLakiLaki, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Perempuan', value: stats?.pendudukPerempuan, icon: Users, color: 'text-pink-600', bg: 'bg-pink-50' },
          { label: 'Meninggal', value: stats?.totalPendudukMeninggal, icon: UserX, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'Pindah', value: stats?.totalPendudukPindah, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((item, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4`}>
            <div className={`rounded-lg p-2 ${item.bg}`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-900">{item.value?.toLocaleString('id-ID') ?? 0}</p>
              <p className="text-xs text-slate-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Komposisi Jenis Kelamin</CardTitle>
          </CardHeader>
          <CardContent>
            {demografiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={genderData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                    {genderData.map((_, index) => (
                      <Cell key={index} fill={GENDER_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value + ' jiwa', '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Agama Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Komposisi Agama</CardTitle>
          </CardHeader>
          <CardContent>
            {demografiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={demografi?.perAgama || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="jumlah"
                    nameKey="agama"
                    label={({ agama, jumlah }) => `${agama}: ${jumlah}`}
                    labelLine={false}
                  >
                    {(demografi?.perAgama || []).map((_, index) => (
                      <Cell key={index} fill={AGAMA_COLORS[index % AGAMA_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Per Dusun */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Penduduk per Dusun</CardTitle>
          </CardHeader>
          <CardContent>
            {demografiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demografi?.perDusun || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="dusun" type="category" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jumlah" name="Penduduk" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Kelompok Umur */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kelompok Umur</CardTitle>
          </CardHeader>
          <CardContent>
            {demografiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demografi?.perKelompokUmur || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="kelompok" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jumlah" name="Penduduk" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pendidikan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tingkat Pendidikan</CardTitle>
          </CardHeader>
          <CardContent>
            {demografiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demografi?.perPendidikan || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="pendidikan" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="jumlah" name="Penduduk" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Mutasi Bulanan */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tren Mutasi 12 Bulan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            {mutasiLoading ? (
              <div className="h-48 animate-pulse bg-slate-100 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mutasiBulanan || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 9 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="lahir" name="Lahir" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="meninggal" name="Meninggal" stroke="#6b7280" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pindahMasuk" name="Masuk" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="pindahKeluar" name="Keluar" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Pekerjaan */}
      {demografi?.perPekerjaan && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">10 Pekerjaan Terbanyak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="pb-2 text-left text-xs font-semibold text-slate-500">No</th>
                    <th className="pb-2 text-left text-xs font-semibold text-slate-500">Pekerjaan</th>
                    <th className="pb-2 text-right text-xs font-semibold text-slate-500">Jumlah</th>
                    <th className="pb-2 text-right text-xs font-semibold text-slate-500">Persentase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {demografi.perPekerjaan.map((item, i) => {
                    const total = stats?.totalPenduduk || 1;
                    const pct = ((item.jumlah / total) * 100).toFixed(1);
                    return (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="py-2 text-slate-500">{i + 1}</td>
                        <td className="py-2 font-medium text-slate-700">{item.pekerjaan}</td>
                        <td className="py-2 text-right text-slate-900 font-semibold">{item.jumlah}</td>
                        <td className="py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 w-10 text-right">{pct}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DashboardPage;
