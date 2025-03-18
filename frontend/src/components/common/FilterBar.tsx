import { Department } from "../../types";

interface FilterBarProps {
  readonly nameFilter: string;
  readonly setNameFilter: (value: string) => void;
  readonly departmentFilter: string;
  readonly setDepartmentFilter: (value: string) => void;
  readonly employedDateFilter: {
    readonly before?: string;
    readonly after?: string;
  };
  readonly setEmployedDateFilter: (
    filter:
      | {
          before?: string;
          after?: string;
        }
      | ((prev: { before?: string; after?: string }) => { before?: string; after?: string })
  ) => void;
  readonly departments?: Department[];
  readonly onAddNew?: () => void;
}

export function FilterBar({
  nameFilter,
  setNameFilter,
  departmentFilter,
  setDepartmentFilter,
  employedDateFilter,
  setEmployedDateFilter,
  departments = [],
  onAddNew,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6 items-end">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="name-filter" className="block text-sm font-medium mb-1">Search Name</label>
        <input
          type="text"
          placeholder="Search employees..."
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <div className="min-w-[200px]">
        <label htmlFor="department-filter" className="block text-sm font-medium mb-1">Department</label>
        <select
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4">
        <div>
          <label htmlFor="employedAfter-filter" className="block text-sm font-medium mb-1">
            Employed After
          </label>
          <input
            type="date"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={employedDateFilter.after ?? ""}
            onChange={(e) =>
              setEmployedDateFilter((prev) => ({
                ...prev,
                after: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <label htmlFor="employedBefore-filter" className="block text-sm font-medium mb-1">
            Employed Before
          </label>
          <input
            type="date"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={employedDateFilter.before ?? ""}
            onChange={(e) =>
              setEmployedDateFilter((prev) => ({
                ...prev,
                before: e.target.value,
              }))
            }
          />
        </div>
      </div>
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="h-[42px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Employee
        </button>
      )}
    </div>
  );
}
