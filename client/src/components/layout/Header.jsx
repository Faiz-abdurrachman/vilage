import { Menu, LogOut, User, KeyRound, ChevronDown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  KADES: 'Kepala Desa',
  SEKDES: 'Sekretaris Desa',
  OPERATOR: 'Operator',
};

const ROLE_COLORS = {
  ADMIN: 'bg-red-100 text-red-700',
  KADES: 'bg-blue-100 text-blue-700',
  SEKDES: 'bg-purple-100 text-purple-700',
  OPERATOR: 'bg-slate-100 text-slate-600',
};

// Breadcrumb label lookup
const ROUTE_LABELS = {
  '/dashboard': 'Dashboard',
  '/penduduk': 'Data Penduduk',
  '/kartu-keluarga': 'Kartu Keluarga',
  '/mutasi': 'Mutasi Penduduk',
  '/surat': 'Surat Keterangan',
  '/users': 'Kelola Pengguna',
  '/pengaturan': 'Pengaturan Desa',
  '/profil': 'Profil Saya',
};

function useBreadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);
  const crumbs = [];

  let path = '';
  for (const part of parts) {
    path += '/' + part;
    const label = ROUTE_LABELS[path];
    if (label) {
      crumbs.push({ label, href: path });
    } else {
      // dynamic segment (id)
      const isId = part.length > 10 && !ROUTE_LABELS['/' + part];
      crumbs.push({ label: isId ? 'Detail' : part, href: path });
    }
  }

  return crumbs;
}

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const breadcrumbs = useBreadcrumb();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setDropdownOpen(false);
  };

  const initials = (user?.namaLengkap || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-6">
      {/* Left — hamburger + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden h-9 w-9 text-slate-500"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-slate-300">/</span>}
              {i === breadcrumbs.length - 1 ? (
                <span className="font-semibold text-slate-800">{crumb.label}</span>
              ) : (
                <Link to={crumb.href} className="text-slate-500 hover:text-slate-700 transition-colors">
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {/* Mobile: just show current page */}
        <span className="sm:hidden text-sm font-semibold text-slate-800">
          {breadcrumbs[breadcrumbs.length - 1]?.label || 'SIDESA'}
        </span>
      </div>

      {/* Right — user dropdown */}
      <div className="flex items-center gap-3">
        {/* Role badge */}
        <span className={cn(
          'hidden md:inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
          ROLE_COLORS[user?.role] || 'bg-slate-100 text-slate-600'
        )}>
          {ROLE_LABELS[user?.role] || user?.role}
        </span>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-xs font-bold text-white">
              {initials}
            </div>
            <span className="hidden sm:block font-medium text-slate-700 max-w-[120px] truncate">
              {user?.namaLengkap}
            </span>
            <ChevronDown className={cn(
              'h-3.5 w-3.5 text-slate-400 transition-transform duration-150',
              dropdownOpen && 'rotate-180'
            )} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden">
                {/* User info */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-semibold text-slate-800 truncate">{user?.namaLengkap}</p>
                  <p className="text-xs text-slate-400 mt-0.5">@{user?.username}</p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    to="/profil"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    Profil Saya
                  </Link>
                  <Link
                    to="/profil"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    Ganti Password
                  </Link>
                </div>

                <div className="border-t border-slate-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
