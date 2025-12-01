import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'emerald' | 'blue' | 'amber' | 'red' | 'slate' | 'orange' | 'yellow' | 'green' | 'purple' | 'pink';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ children, variant = 'neutral', size = 'md', className }: BadgeProps) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    warning: 'bg-amber-100 text-amber-700 border-amber-300',
    danger: 'bg-red-100 text-red-700 border-red-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
    neutral: 'bg-slate-100 text-slate-700 border-slate-300',
    // Colores adicionales para compatibilidad con ColorType
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    amber: 'bg-amber-100 text-amber-700 border-amber-300',
    red: 'bg-red-100 text-red-700 border-red-300',
    slate: 'bg-slate-100 text-slate-700 border-slate-300',
    // Nuevos colores para más categorías de fenómenos
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full border shadow-sm',
        variants[variant] || variants.neutral,
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
