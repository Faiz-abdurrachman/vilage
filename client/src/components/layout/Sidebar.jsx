import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Home, ArrowLeftRight, FileText,
  UserCog, Settings, X, Building2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSuratList } from '@/hooks/useSurat';
import { cn } from '@/lib/utils';

const MENU_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Data Penduduk', icon: Users, href: '/penduduk', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Kartu Keluarga', icon: Home, href: '/kartu-keluarga', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Mutasi Penduduk', icon: ArrowLeftRight, href: '/mutasi', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
  { label: 'Surat Keterangan', icon: FileText, href: '/surat', roles: ['ADMIN', 'KADES', 'SEKDES', 'OPERATOR'] },
];

const ADMIN_MENU = [
  { label: 'Kelola Pengguna', icon: UserCog, href: '/users', roles: ['ADMIN'] },
  { label: 'Pengaturan Desa', icon: Settings, href: '/pengaturan', roles: ['ADMIN'] },
];

const ROLE_LABELS = {
  ADMIN: 'Administrator',
  KADES: 'Kepala Desa',
  SEKDES: 'Sekretaris Desa',
  OPERATOR: 'Operator',
};

const ROLE_GRADIENTS = {
  ADMIN: 'from-blue-500 to-blue-700',
  KADES: 'from-emerald-500 to-emerald-700',
  SEKDES: 'from-violet-500 to-violet-700',
  OPERATOR: 'from-amber-500 to-amber-700',
};

function NavItem({ item, isActive, onClick, badge, collapsed }) {
  return (
    <Link
      to={item.href}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center rounded-lg text-sm font-medium transition-all duration-150',
        collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
        collapsed
          ? isActive
            ? 'bg-blue-600/20 text-white'
            : 'text-slate-400 hover:bg-white/5 hover:text-white'
          : isActive
            ? 'bg-blue-600/20 text-white border-l-[3px] border-blue-400 pl-[9px]'
            : 'text-slate-400 hover:bg-white/5 hover:text-white border-l-[3px] border-transparent pl-[9px]'
      )}
    >
      <item.icon className={cn(
        'shrink-0 transition-colors',
        collapsed ? 'h-5 w-5' : 'h-4 w-4',
        isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
      )} />

      {!collapsed && <span className="truncate">{item.label}</span>}

      {/* Badge / active dot */}
      {!collapsed && badge > 0 ? (
        <span className="ml-auto shrink-0 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
          {badge > 99 ? '99+' : badge}
        </span>
      ) : !collapsed && isActive ? (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
      ) : null}

      {/* Collapsed badge dot */}
      {collapsed && badge > 0 && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-500" />
      )}
    </Link>
  );
}

function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const { user } = useAuth();
  const location = useLocation();

  const { data: suratData } = useSuratList({ status: 'MENUNGGU', limit: 1 });
  const menungguCount = suratData?.meta?.total || 0;

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');
  const hasAccess = (roles) => roles.includes(user?.role);

  const initials = (user?.namaLengkap || 'U')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const avatarGradient = ROLE_GRADIENTS[user?.role] || 'from-blue-500 to-blue-700';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full flex flex-col',
          'bg-gradient-to-b from-slate-950 to-slate-900',
          'transition-[width,transform] duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto',
          // Mobile: always full width, show/hide via translate
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: respect collapsed state
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-[72px] w-[260px]' : 'w-[260px]'
        )}
      >
        {/* Logo Header */}
        <div className={cn(
          'flex items-center border-b border-white/10',
          isCollapsed ? 'justify-center px-0 py-5' : 'justify-between px-5 py-5'
        )}>
          {isCollapsed ? (
            // Collapsed: just icon, toggle button below
            <div className="flex flex-col items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                title="Perluas sidebar"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    SIDESA
                  </p>
                  <p className="text-[10px] text-slate-500 leading-tight">Desa Motoboi Kecil</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {/* Desktop collapse toggle */}
                <button
                  onClick={onToggleCollapse}
                  className="hidden lg:flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  title="Ciutkan sidebar"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {/* Mobile close */}
                <button
                  onClick={onClose}
                  className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          'flex-1 overflow-y-auto py-4 space-y-5',
          isCollapsed ? 'px-2' : 'px-3'
        )}>
          {/* Menu Utama */}
          <div>
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                Menu Utama
              </p>
            )}
            <div className="space-y-0.5">
              {MENU_ITEMS.filter((item) => hasAccess(item.roles)).map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  isActive={isActive(item.href)}
                  onClick={onClose}
                  badge={item.href === '/surat' ? menungguCount : 0}
                  collapsed={isCollapsed}
                />
              ))}
            </div>
          </div>

          {/* Admin section */}
          {ADMIN_MENU.some((item) => hasAccess(item.roles)) && (
            <div>
              {!isCollapsed && (
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600">
                  Pengaturan
                </p>
              )}
              {isCollapsed && (
                <div className="mx-2 my-1 h-px bg-white/10" />
              )}
              <div className="space-y-0.5">
                {ADMIN_MENU.filter((item) => hasAccess(item.roles)).map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isActive={isActive(item.href)}
                    onClick={onClose}
                    collapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User card at bottom */}
        <div className={cn(
          'border-t border-white/10',
          isCollapsed ? 'px-2 pb-4 pt-4' : 'px-3 pb-4 pt-4'
        )}>
          <Link
            to="/profil"
            onClick={onClose}
            title={isCollapsed ? user?.namaLengkap : undefined}
            className={cn(
              'flex items-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors',
              isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-3'
            )}
          >
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-xs font-bold text-white shadow-sm`}>
              {initials}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-white">{user?.namaLengkap}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                  <p className="text-[10px] text-slate-400 truncate">{ROLE_LABELS[user?.role] || user?.role}</p>
                </div>
              </div>
            )}
          </Link>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
