import {
    useQuery,
    useQueryClient
} from "@tanstack/react-query";
import {
    createColumnHelper,
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
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
    enableSorting: true,
  }),
  columnHelper.accessor("department", {
    header: "Department",
    enableSorting: false,
  }),
];

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
  const [debouncedName, setDebouncedName] = useDebounce(nameFilter, 300);
  const [departmentFilter, setDepartmentFilter] = useState<string | undefined>(
    ""
  );
  const [employedDateFilter, setEmployedDateFilter] = useState<{
    before?: string;
    after?: string;
  }>({});
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  //Fetch departments
  const { data: departments } = useQuery({
    queryKey: ["departments"],
    queryFn: () => fetchDepartments,
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
  const { data, isPending } = useQuery<EmployeesResponse>({
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
      </div>
    </div>
  );
};

export default EmployeeTable;
