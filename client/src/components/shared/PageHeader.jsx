import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-xs text-slate-500">
          <Link to="/dashboard" className="flex items-center gap-1 hover:text-blue-700">
            <Home className="h-3 w-3" />
            <span>Beranda</span>
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-blue-700">{crumb.label}</Link>
              ) : (
                <span className="text-slate-700 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export default PageHeader;
