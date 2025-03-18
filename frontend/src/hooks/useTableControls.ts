import { useState, useMemo } from 'react';
import { useDebounce } from 'use-debounce';
import { PaginationState, SortingState } from '@tanstack/react-table';

interface UseTableControlsOptions {
  defaultSorting?: SortingState;
  defaultPageSize?: number;
  debounceMs?: number;
}

export const useTableControls = (options?: UseTableControlsOptions) => {
  // Sorting state
  const [sorting, setSorting] = useState<SortingState>(
    options?.defaultSorting ?? [{ id: 'name', desc: false }]
  );
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: options?.defaultPageSize ?? 10,
  });
  
  // Filter states
  const [nameFilter, setNameFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [employedDateFilter, setEmployedDateFilter] = useState<{
    before?: string;
    after?: string;
  }>({});
  
  // Debounce name filter to prevent excessive API calls
  const [debouncedName] = useDebounce(nameFilter, options?.debounceMs ?? 300);
  
  // Combine all filters into a single object for API requests
  const filters = useMemo(() => ({
    filterName: debouncedName,
    filterDepartment: departmentFilter,
    filterEmployedBefore: employedDateFilter.before ?? '',
    filterEmployedAfter: employedDateFilter.after ?? '',
  }), [debouncedName, departmentFilter, employedDateFilter]);

  const resetFilters = () => {
    setNameFilter('');
    setDepartmentFilter('');
    setEmployedDateFilter({});
  };
  
  return {
    // Sorting
    sorting,
    setSorting,
    
    // Pagination
    pagination,
    setPagination,
    
    // Filters
    filters,
    nameFilter,
    setNameFilter,
    departmentFilter,
    setDepartmentFilter,
    employedDateFilter,
    setEmployedDateFilter,
    resetFilters,
  };
};
