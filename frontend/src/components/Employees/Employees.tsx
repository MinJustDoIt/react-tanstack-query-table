import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import EmployeeModal from "./EmployeeModal";
import { useTableControls } from "../../hooks/useTableControls";
import { useModal } from "../../hooks/useModal";
import { useEmployees, useDepartments } from "../../hooks/useApi";
import { useEmployeeColumns } from "../../hooks/useEmployeeColumns";
import { Table } from "../common/table/Table";
import { TablePagination } from "../common/table/TablePagination";
import { EmployeesFilter } from "./EmployeesFilter";

const Employees = () => {
  // Use custom hooks for table controls and modal
  const {
    sorting,
    setSorting,
    pagination,
    setPagination,
    filters,
    nameFilter,
    setNameFilter,
    departmentFilter,
    setDepartmentFilter,
    employedDateFilter,
    setEmployedDateFilter,
  } = useTableControls();

  const {
    isOpen: isModalOpen,
    data: selectedEmployeeId,
    openModal,
    closeModal,
  } = useModal();

  // Fetch departments using custom hook
  const { data: departments = [] } = useDepartments();

  // Fetch employees using custom hook
  const { data, isLoading } = useEmployees(
    pagination.pageIndex + 1, // Backend uses 1-based index
    pagination.pageSize,
    sorting[0]?.id || "name",
    filters,
    sorting[0]?.desc ? "desc" : "asc"
  );

  const handleEdit = (id: number) => {
    openModal(id);
  };

  // Get columns using our extracted hook
  const columns = useEmployeeColumns(handleEdit);

  // Initialize the table with our custom hooks
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
      {/* Using our reusable FilterBar component */}
      <EmployeesFilter
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        departmentFilter={departmentFilter}
        setDepartmentFilter={setDepartmentFilter}
        employedDateFilter={employedDateFilter}
        setEmployedDateFilter={setEmployedDateFilter}
        departments={departments}
        onAddNew={() => openModal(null)}
      />

      {/* Using our reusable TablePagination component */}
      <div className="mb-4">
        <TablePagination table={table} totalRecords={data?.totalRecords ?? 0} />
      </div>

      {/* Using our reusable Table component */}
      <Table
        table={table}
        isLoading={isLoading}
        emptyMessage="No employees found"
      />

      {/* Using our reusable TablePagination component */}
      <TablePagination table={table} totalRecords={data?.totalRecords ?? 0} />

      {/* Modal component */}
      {isModalOpen && (
        <EmployeeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          employeeId={selectedEmployeeId}
          departments={departments}
          onSuccess={() => {
            closeModal();
          }}
        />
      )}
    </div>
  );
};

export default Employees;
