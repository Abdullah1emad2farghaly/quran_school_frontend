import { useState, useEffect, useCallback, useRef, useMemo } from "react";

/**
 * Generic data-table state manager. Pass an async `fetcher(params)` that
 * returns { data, pagination }. Handles debounced search, filters, paging.
 */
export function useDataTable(fetcher, { pageSize = 10, initialFilters = {} } = {}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({ page: 1, pageSize, total: 0, totalPages: 1 });
  const debounceRef = useRef(null);

  // Stable string key so effects can depend on filter *contents* rather
  // than the (new-every-render) filters object reference.
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const load = useCallback(
    async (overridePage) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetcher({ page: overridePage ?? page, pageSize, search, ...filters });
        setRows(res.data);
        if (res.pagination) setPagination(res.pagination);
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetcher, page, search, filtersKey]
  );

  // Debounce search changes back to page 1.
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (page !== 1) setPage(1);
      else load(1);
    }, 320);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filtersKey]);

  const refresh = useCallback(() => load(), [load]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFilterCount = Object.values(filters).filter((v) => v && v !== "all").length;

  return {
    rows,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    activeFilterCount,
    pagination,
    refresh,
  };
}
