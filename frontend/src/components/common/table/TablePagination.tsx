import { Table } from '@tanstack/react-table';

interface TablePaginationProps<T> {
  readonly table: Table<T>;
  readonly totalRecords?: number;
}

export function TablePagination<T>({ table, totalRecords = 0 }: TablePaginationProps<T>) {
  return (
    <div className="mt-4 flex items-center justify-end gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700">
          Showing {table.getRowModel().rows.length} of {totalRecords} results
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 border rounded-md enabled:hover:bg-gray-100 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 border rounded-md enabled:hover:bg-gray-100 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
