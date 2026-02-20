import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-100',  accent: 'border-l-blue-500' },
  green:  { bg: 'bg-emerald-50',text: 'text-emerald-600',border: 'border-emerald-100',accent: 'border-l-emerald-500' },
  orange: { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-100', accent: 'border-l-amber-500' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100',accent: 'border-l-violet-500' },
  red:    { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-100',   accent: 'border-l-red-500' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100',accent: 'border-l-yellow-500' },
};

// Animated counter hook
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === undefined || target === null) return;
    const start = performance.now();
    const from = 0;
    const to = Number(target) || 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(from + (to - from) * ease));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return count;
}

function StatCard({ title, value, icon: Icon, description, sub, trend, color = 'blue', isLoading }) {
  const count = useCountUp(value);
  const c = colorMap[color] || colorMap.blue;

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 bg-slate-100 rounded-xl" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
        <div className="h-9 w-24 bg-slate-100 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className={cn(
      'stat-card rounded-2xl border bg-white p-6 shadow-sm border-l-[3px]',
      c.border,
      c.accent,
    )}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon && (
          <div className={cn('rounded-xl p-2.5', c.bg, c.border, 'border')}>
            <Icon className={cn('h-5 w-5', c.text)} />
          </div>
        )}
      </div>

      <p className={cn('text-4xl font-bold counter-text', c.text)} style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {count.toLocaleString('id-ID')}
      </p>

      {description && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
          {trend === 'up' && <TrendingUp className="h-3 w-3 text-emerald-500" />}
          {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
          {trend === 'neutral' && <Minus className="h-3 w-3 text-slate-400" />}
          <span>{description}</span>
        </div>
      )}

      {sub && (
        <p className="mt-1.5 text-xs text-slate-400">{sub}</p>
      )}
    </div>
  );
}

export default StatCard;
