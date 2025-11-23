import { useState, useMemo, useCallback } from 'react';
import { paginateArray, calculateTotalPages, scrollToTop } from '@/lib/utils';

export function usePagination(items, itemsPerPage) {
  const [page, setPage] = useState(1);

  const paginatedItems = useMemo(() => {
    return paginateArray(items, page, itemsPerPage);
  }, [items, page, itemsPerPage]);

  const totalPages = useMemo(() => {
    return calculateTotalPages(items.length, itemsPerPage);
  }, [items.length, itemsPerPage]);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
    scrollToTop();
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return {
    page,
    paginatedItems,
    totalPages,
    handlePageChange,
    resetPage,
  };
}
