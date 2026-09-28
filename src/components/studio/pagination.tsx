'use client';
import {useState, useMemo} from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react';
import s from './workspace.module.css';

export function usePagination<T>(items: T[], pageSize: number = 25) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  return {
    page: currentPage,
    totalPages,
    setPage,
    paginatedItems
  };
}

export function Pagination({page, totalPages, setPage}: {page: number; totalPages: number; setPage: (p: number) => void}) {
  if (totalPages <= 1) return null;
  return (
    <div className={s.pagination} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '16px', justifyContent: 'center' }}>
      <button 
        type="button" 
        onClick={() => setPage(page - 1)} 
        disabled={page <= 1}
        style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ffffff40', color: 'inherit', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <ChevronLeft size={14}/> Prev
      </button>
      <span style={{ height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 12px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid #ffffff40', borderRadius: '4px', fontSize: '13px', fontWeight: 500 }}>
        {page} / {totalPages}
      </span>
      <button 
        type="button" 
        onClick={() => setPage(page + 1)} 
        disabled={page >= totalPages}
        style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #ffffff40', color: 'inherit', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        Next <ChevronRight size={14}/>
      </button>
    </div>
  );
}
