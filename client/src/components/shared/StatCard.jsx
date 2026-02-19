import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
  green: 'bg-green-50 text-green-700 border-green-100',
  orange: 'bg-orange-50 text-orange-700 border-orange-100',
  purple: 'bg-purple-50 text-purple-700 border-purple-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-100',
};

function StatCard({ title, value, icon: Icon, description, trend, color = 'blue', isLoading }) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-200 rounded" />
            </div>
            <div className="h-12 w-12 bg-slate-200 rounded-xl" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{value?.toLocaleString('id-ID') ?? 0}</p>
            {description && (
              <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
                {trend === 'neutral' && <Minus className="h-3 w-3 text-slate-400" />}
                <span>{description}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={cn('rounded-xl p-3 border', colorMap[color] || colorMap.blue)}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default StatCard;
