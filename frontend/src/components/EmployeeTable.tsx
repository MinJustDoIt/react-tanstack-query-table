import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { fetchDepartments, fetchEmployees } from "../api/api";
import { Employee, EmployeesResponse } from "../types";
import EmployeeModal from "./EmployeeModal";

const EmployeeTable = () => {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [nameFilter, setNameFilter] = useState<string | undefined>("");
  const [debouncedName] = useDebounce(nameFilter, 300);
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(
    ""
  );
  const [employedDateFilter, setEmployedDateFilter] = useState<{
    before?: string;
    after?: string;
  }>({});
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  //Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
  });

  //Construct filters
  const filters = useMemo(
    () => ({
      filterName: debouncedName ?? "",
      filterDepartment: departmentFilter ?? "",
      filterEmployedBefore: employedDateFilter.before ?? "",
      filterEmployedAfter: employedDateFilter.after ?? "",
    }),
    [debouncedName, departmentFilter, employedDateFilter]
  );

  // Fetch employees
  const { data, isLoading } = useQuery<EmployeesResponse>({
    queryKey: ["employees", pagination, sorting, filters],
    queryFn: () =>
      fetchEmployees(
        pagination.pageIndex + 1, // Backend use 1-based index
        pagination.pageSize,
        sorting[0].id || "name",
        filters
      ),
    placeholderData: (previousData) => previousData,
  });
  const columnHelper = createColumnHelper<Employee>();

const columns = [
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
        enableSorting: false,
    }),
    columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <button
                    onClick={() => handleEdit(row.original.id)}
                    className="px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md"
                >
                    Edit
                </button>
            </div>
        ),
    }),
];

  // Initialize the table
  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.totalRecords
      ? Math.ceil(data.totalRecords / pagination.pageSize)
      : -1,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (id: number) => {
    setSelectedEmployeeId(id); // Set the selected employee ID
    setIsModalOpen(true); // Open the modal
  };

  

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Search Name</label>
          <input
            type="text"
            placeholder="Search employees..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 "
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>

        <div className="min-w-[200px]">
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments?.map((d) => (
              <option key={d.id} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Employed After
            </label>
            <input
              type="date"
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setEmployedDateFilter((prev) => ({
                  ...prev,
                  after: e.target.value,
                }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Employed Before
            </label>
            <input
              type="date"
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={(e) =>
                setEmployedDateFilter((prev) => ({
                  ...prev,
                  before: e.target.value,
                }))
              }
            />
          </div>
        </div>
        <button
          onClick={() => {
            setSelectedEmployeeId(null); // Reset selected employee ID
            setIsModalOpen(true); // Open the modal
          }}
          className="h-[42px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: "↑",
                      desc: "↓",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 cursor-pointer">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                {/* <td>
                  <button onClick={() => handleEdit(row.original.id)}>
                    Edit
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            Showing {data?.data.length ?? 0} of {data?.totalRecords ?? 0}{" "}
            results
          </span>
          <select
            value={pagination.pageSize}
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
            className="px-4 py-3 border rounded-md enabled:hover:bg-gray-500 disabled:opactiy-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-3 border rounded-md enabled:hover:bg-gray-500 disabled:opactiy-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen} // Pass isOpen explicitly
          onClose={() => setIsModalOpen(false)}
          employeeId={selectedEmployeeId ?? null} // Pass the selected employee ID
          departments={departments ?? []} // Pass the departments data
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["employees"] });
          }}
          onSave={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["employees"] });
          }}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
