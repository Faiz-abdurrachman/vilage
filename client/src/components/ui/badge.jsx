import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-blue-200 bg-blue-100 text-blue-700',
        secondary: 'border-slate-200 bg-slate-100 text-slate-700',
        success: 'border-green-200 bg-green-100 text-green-700',
        warning: 'border-yellow-200 bg-yellow-100 text-yellow-700',
        destructive: 'border-red-200 bg-red-100 text-red-700',
        outline: 'text-slate-700 border-slate-300',
        purple: 'border-purple-200 bg-purple-100 text-purple-700',
        dark: 'border-slate-400 bg-slate-200 text-slate-800',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
