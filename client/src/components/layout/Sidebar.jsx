import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, ArrowLeftRight, FileText,
  UserCog, Settings, X, Building2, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Data Penduduk', icon: Users, href: '/penduduk', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Kartu Keluarga', icon: Home, href: '/kartu-keluarga', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Mutasi Penduduk', icon: ArrowLeftRight, href: '/mutasi', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Surat Keterangan', icon: FileText, href: '/surat', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
];

const ADMIN_MENU = [
  { label: 'Kelola User', icon: UserCog, href: '/users', roles: ['ADMIN'] },
  { label: 'Pengaturan Desa', icon: Settings, href: '/pengaturan', roles: ['ADMIN'] },
];

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (href) => location.pathname.startsWith(href);

  const hasAccess = (roles) => roles.includes(user?.role);

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 flex-col bg-slate-900 text-slate-100 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'flex'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">SIDESA</p>
              <p className="text-[10px] text-slate-400">Motoboi Besar</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-1 hover:bg-slate-700 lg:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {MENU_ITEMS.filter((item) => hasAccess(item.roles)).map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
                {isActive(item.href) && <ChevronRight className="ml-auto h-3 w-3" />}
              </Link>
            ))}
          </div>

          {/* Admin section */}
          {ADMIN_MENU.some((item) => hasAccess(item.roles)) && (
            <div className="mt-6">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Administrasi
              </p>
              <div className="space-y-1">
                {ADMIN_MENU.filter((item) => hasAccess(item.roles)).map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                    {isActive(item.href) && <ChevronRight className="ml-auto h-3 w-3" />}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User info */}
        <div className="border-t border-slate-700 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {user?.namaLengkap?.charAt(0) || 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">{user?.namaLengkap}</p>
              <p className="text-[10px] text-slate-400">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
