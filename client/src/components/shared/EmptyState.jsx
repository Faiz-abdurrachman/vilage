import { InboxIcon } from 'lucide-react';

function EmptyState({ title = 'Tidak ada data', description, icon: Icon = InboxIcon, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Icon className="h-10 w-10 text-slate-400" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-slate-700">{title}</h3>
      {description && <p className="mb-4 text-sm text-slate-500 max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
