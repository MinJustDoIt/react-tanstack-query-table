import { useMemo } from 'react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Employee } from '../types';

/**
 * Custom hook to generate employee table columns
 * @param onEdit Callback function when edit button is clicked
 * @returns Array of column definitions for the employee table
 */
export const useEmployeeColumns = (
  onEdit: (id: number) => void
): ColumnDef<Employee, any>[] => {
  const columnHelper = createColumnHelper<Employee>();
  
  return useMemo(() => [
    columnHelper.accessor("name", {
      header: "Name",
      enableSorting: true,
    }),
    columnHelper.accessor("age", {
      header: "Age",
      enableSorting: true,
    }),
    columnHelper.accessor("position", {
      header: "Position",
      enableSorting: true,
    }),
    columnHelper.accessor("employedOn", {
      header: "Employed On",
      cell: (info) => new Date(info.getValue()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      enableSorting: true,
    }),
    columnHelper.accessor("department", {
      header: "Department",
      enableSorting: true,
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(row.original.id)}
            className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
          >
            Edit
          </button>
        </div>
      ),
    }),
  ], [onEdit]);
};
