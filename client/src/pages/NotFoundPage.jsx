import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center px-4">
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <AlertCircle className="h-10 w-10 text-slate-400" />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Button asChild>
          <Link to="/dashboard">
            <Home className="h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default NotFoundPage;
