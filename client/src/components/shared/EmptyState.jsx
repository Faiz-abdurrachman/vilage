import { InboxIcon } from 'lucide-react';

function EmptyState({ title = 'Tidak ada data', description, icon: Icon = InboxIcon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-5 float-animate">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-slate-700" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {title}
      </h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
