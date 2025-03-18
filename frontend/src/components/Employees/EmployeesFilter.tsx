import { Department } from "../../types";

interface EmployeesFilterProps {
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
      | ((prev: { before?: string; after?: string }) => {
          before?: string;
          after?: string;
        })
  ) => void;
  readonly departments?: Department[];
  readonly onAddNew?: () => void;
}

export function EmployeesFilter({
  nameFilter,
  setNameFilter,
  departmentFilter,
  setDepartmentFilter,
  employedDateFilter,
  setEmployedDateFilter,
  departments = [],
  onAddNew,
}: EmployeesFilterProps) {
  return (
    <>
      <div className="border rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1">
            <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0 lg:space-y-0 lg:grid-cols-1 lg:flex lg:gap-4 lg:items-end">
              <div className="lg:flex-1">
                <label
                  htmlFor="name-filter"
                  className="block text-sm font-medium mb-1"
                >
                  Search Name
                </label>
                <input
                  type="text"
                  placeholder="Search employees..."
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                />
              </div>

              <div className="lg:w-64">
                <label
                  htmlFor="department-filter"
                  className="block text-sm font-medium mb-1"
                >
                  Department
                </label>
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

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:flex lg:gap-4 lg:col-span-1">
                <div>
                  <label
                    htmlFor="employedAfter-filter"
                    className="block text-sm font-medium mb-1"
                  >
                    Employed After
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
                  <label
                    htmlFor="employedBefore-filter"
                    className="block text-sm font-medium mb-1"
                  >
                    Employed Before
                  </label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
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
            </div>
          </div>
        </div>
      </div>

      <div>
        {onAddNew && (
          <div className="flex items-end xs:justify-center">
            <button
              onClick={onAddNew}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors h-10"
            >
              Add Employee
            </button>
          </div>
        )}
      </div>
    </>
  );
}
