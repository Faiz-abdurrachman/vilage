import { Menu, LogOut, User, KeyRound, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const ROLE_LABELS = {
  ADMIN: { label: 'Administrator', variant: 'destructive' },
  KADES: { label: 'Kepala Desa', variant: 'default' },
  SEKDES: { label: 'Sekretaris Desa', variant: 'purple' },
  OPERATOR: { label: 'Operator', variant: 'secondary' },
};

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleInfo = ROLE_LABELS[user?.role] || { label: user?.role, variant: 'secondary' };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="hidden items-center gap-2 lg:flex">
          <span className="text-sm font-semibold text-slate-700">SIDESA</span>
          <span className="text-slate-300">—</span>
          <span className="text-sm text-slate-500">Sistem Informasi Kependudukan Desa Motoboi Besar</span>
        </div>
      </div>

      {/* Right */}
      <div className="relative flex items-center gap-3">
        <Badge variant={roleInfo.variant}>{roleInfo.label}</Badge>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {user?.namaLengkap?.charAt(0) || 'U'}
            </div>
            <span className="hidden font-medium text-slate-700 sm:block">{user?.namaLengkap}</span>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                <div className="border-b border-slate-100 px-4 py-2">
                  <p className="text-xs font-semibold text-slate-700">{user?.namaLengkap}</p>
                  <p className="text-xs text-slate-400">@{user?.username}</p>
                </div>
                <Link
                  to="/profil"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profil Saya
                </Link>
                <Link
                  to="/profil"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setDropdownOpen(false)}
                >
                  <KeyRound className="h-4 w-4" />
                  Ganti Password
                </Link>
                <div className="border-t border-slate-100 mt-1">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
