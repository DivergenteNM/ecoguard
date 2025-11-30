import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const pages = [];
  const maxVisible = 5;
  
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
      </Button>
      
      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-1 text-sm rounded hover:bg-slate-100"
          >
            1
          </button>
          {start > 2 && <span className="text-slate-400">...</span>}
        </>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={cn(
            'px-3 py-1 text-sm rounded transition-colors',
            page === currentPage
              ? 'bg-emerald-600 text-white'
              : 'hover:bg-slate-100 text-slate-700'
          )}
        >
          {page}
        </button>
      ))}
      
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-slate-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 text-sm rounded hover:bg-slate-100"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}
