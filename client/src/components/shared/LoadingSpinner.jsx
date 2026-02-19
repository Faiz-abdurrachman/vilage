import { cn } from '@/lib/utils';

function LoadingSpinner({ size = 'default', className }) {
  const sizeClass = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
  }[size];

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn('animate-spin rounded-full border-slate-300 border-t-blue-700', sizeClass)} />
    </div>
  );
}

function PageLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-3" />
        <p className="text-sm text-slate-500">Memuat data...</p>
      </div>
    </div>
  );
}

export { LoadingSpinner, PageLoader };
