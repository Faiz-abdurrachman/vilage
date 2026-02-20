import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Eye, EyeOff, LogIn, Users, FileText, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

// Floating decorative circle
function FloatingCircle({ className }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 ${className}`}
    />
  );
}

function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shakeError, setShakeError] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    document.title = 'Login | SIDESA';
  }, []);

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setLoginError('');
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Username atau password salah.';
      setLoginError(msg);
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ========== LEFT PANEL (decorative) ========== */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern" />

        {/* Floating circles */}
        <FloatingCircle className="h-72 w-72 bg-blue-500 -top-16 -right-16 animate-pulse" style={{ animationDuration: '4s' }} />
        <FloatingCircle className="h-96 w-96 bg-blue-600 -bottom-24 -left-24" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        <FloatingCircle className="h-48 w-48 bg-indigo-500 top-1/2 right-12" style={{ animationDuration: '5s', animationDelay: '2s' }} />

        {/* Content */}
        <div className="relative z-10 text-center px-12 max-w-lg">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-2xl shadow-blue-600/40 ring-4 ring-blue-500/30">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            SIDESA
          </h1>
          <p className="text-lg text-blue-200 font-medium mb-2">
            Sistem Informasi Kependudukan Desa
          </p>
          <p className="text-sm text-slate-400 mb-10">
            Desa Motoboi Kecil · Kecamatan Kotamobagu Selatan · Kota Kotamobagu
          </p>

          {/* Features */}
          <div className="space-y-4">
            {[
              { icon: Users, title: 'Data Penduduk', desc: 'Kelola data kependudukan secara digital' },
              { icon: FileText, title: 'Surat Menyurat', desc: 'Buat dan kelola surat keterangan warga' },
              { icon: BarChart3, title: 'Laporan & Statistik', desc: 'Dashboard dengan visualisasi data realtime' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600/30 ring-1 ring-blue-500/30">
                  <Icon className="h-5 w-5 text-blue-300" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 absolute bottom-8 left-0 right-0 text-center">
          <p className="text-xs text-slate-600 italic">
            "Melayani masyarakat dengan teknologi"
          </p>
        </div>
      </div>

      {/* ========== RIGHT PANEL (login form) ========== */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
              <Building2 className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              SIDESA
            </h1>
            <p className="mt-1 text-sm text-slate-500">Sistem Informasi Kependudukan Desa</p>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Selamat Datang
            </h2>
            <p className="mt-1.5 text-sm text-slate-500">
              Masuk untuk mengakses sistem kependudukan desa
            </p>
          </div>

          {/* Error message */}
          {loginError && (
            <div className={`mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 ${shakeError ? 'shake' : ''}`}>
              <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-red-700">{loginError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Users className="h-4 w-4" />
                </span>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  autoComplete="username"
                  className={`w-full h-12 rounded-xl border pl-10 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400
                    ${errors.username
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  {...register('username')}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  className={`w-full h-12 rounded-xl border pl-10 pr-11 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400
                    ${errors.password
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                    }`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white
                transition-all duration-150
                hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30
                active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Masuk...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Masuk ke Sistem
                </>
              )}
            </button>

            {/* Back to landing */}
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-3 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Kembali ke Beranda
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-8 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="mb-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Akun Demo</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['admin', 'admin123', 'Administrator'],
                ['kades', 'kades123', 'Kepala Desa'],
                ['sekdes', 'sekdes123', 'Sekretaris'],
                ['operator1', 'operator123', 'Operator'],
              ].map(([usr, pwd, role]) => (
                <div key={usr} className="text-xs">
                  <p className="font-medium text-slate-700">{role}</p>
                  <p className="text-slate-400 font-mono">{usr} / {pwd}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-xs text-slate-400">
            © 2026 Desa Motoboi Kecil · SIDESA v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
