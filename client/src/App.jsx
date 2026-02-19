import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import LoginPage from '@/pages/auth/LoginPage';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import PendudukListPage from '@/pages/penduduk/PendudukListPage';
import PendudukFormPage from '@/pages/penduduk/PendudukFormPage';
import PendudukDetailPage from '@/pages/penduduk/PendudukDetailPage';
import KKListPage from '@/pages/kartuKeluarga/KKListPage';
import KKFormPage from '@/pages/kartuKeluarga/KKFormPage';
import KKDetailPage from '@/pages/kartuKeluarga/KKDetailPage';
import MutasiListPage from '@/pages/mutasi/MutasiListPage';
import MutasiFormPage from '@/pages/mutasi/MutasiFormPage';
import MutasiDetailPage from '@/pages/mutasi/MutasiDetailPage';
import SuratListPage from '@/pages/surat/SuratListPage';
import SuratFormPage from '@/pages/surat/SuratFormPage';
import SuratDetailPage from '@/pages/surat/SuratDetailPage';
import UsersPage from '@/pages/users/UsersPage';
import PengaturanPage from '@/pages/pengaturan/PengaturanPage';
import ProfilPage from '@/pages/profil/ProfilPage';
import NotFoundPage from '@/pages/NotFoundPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Penduduk */}
                <Route path="/penduduk" element={<PendudukListPage />} />
                <Route path="/penduduk/tambah" element={<PendudukFormPage />} />
                <Route path="/penduduk/:id" element={<PendudukDetailPage />} />
                <Route path="/penduduk/:id/edit" element={<PendudukFormPage />} />

                {/* Kartu Keluarga */}
                <Route path="/kartu-keluarga" element={<KKListPage />} />
                <Route path="/kartu-keluarga/tambah" element={<KKFormPage />} />
                <Route path="/kartu-keluarga/:id" element={<KKDetailPage />} />
                <Route path="/kartu-keluarga/:id/edit" element={<KKFormPage />} />

                {/* Mutasi */}
                <Route path="/mutasi" element={<MutasiListPage />} />
                <Route path="/mutasi/tambah" element={<MutasiFormPage />} />
                <Route path="/mutasi/:id" element={<MutasiDetailPage />} />

                {/* Surat */}
                <Route path="/surat" element={<SuratListPage />} />
                <Route path="/surat/tambah" element={<SuratFormPage />} />
                <Route path="/surat/:id" element={<SuratDetailPage />} />

                {/* Admin only */}
                <Route path="/users" element={<UsersPage />} />
                <Route path="/pengaturan" element={<PengaturanPage />} />

                {/* Profil */}
                <Route path="/profil" element={<ProfilPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
