import { cn } from '@/lib/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export default function Skeleton({ className, variant = 'rectangular' }: SkeletonProps) {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200',
        variants[variant],
        className
      )}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton variant="circular" className="w-12 h-12" />
      </div>
      <Skeleton className="h-3 w-32 mt-4" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
