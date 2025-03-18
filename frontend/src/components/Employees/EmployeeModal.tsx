import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Employee, Department } from "../../types";
import { useEmployee, useEmployeeMutation } from "../../hooks/useApi";
import { FormField } from "../common/form/FormField";

interface EmployeeModalProps {
  readonly isOpen: boolean;
  readonly employeeId?: number | null;
  readonly departments: Department[];
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export default function EmployeeModal({
  isOpen,
  employeeId,
  departments,
  onClose,
  onSuccess,
}: EmployeeModalProps) {
  const isEditMode = !!employeeId;

  // Use our custom hook to fetch employee data
  const { data: employeeData, isLoading: isLoadingEmployee } = useEmployee(
    employeeId ?? null,
    {
      queryKey: ["employee", employeeId],
      enabled: isEditMode,
    }
  );

  // Use our custom hook for employee mutation
  const { mutate, isPending: isMutating } = useEmployeeMutation(isEditMode);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Employee>({
    defaultValues: {
      name: "",
      age: 18,
      position: "",
      department: "",
      employedOn: new Date(),
    },
  });

  // Reset form when employee data changes or mode changes
  useEffect(() => {
    if (employeeData) {
      // Format the date properly before setting in form
      const formattedDate = new Date(employeeData.employedOn)
        .toISOString()
        .split("T")[0];

      reset({
        ...employeeData,
        employedOn: formattedDate,
      });
    } else if (!isEditMode) {
      reset({
        name: "",
        age: 18,
        position: "",
        department: "",
        employedOn: new Date().toISOString().split("T")[0],
      });
    }
  }, [employeeData, isEditMode, reset]);

  // Handle form submission
  const onSubmit = (data: Employee) => {
    mutate(
      {
        ...(isEditMode && employeeId ? { id: employeeId } : {}),
        ...data,
      },
      {
        onSuccess: onSuccess,
      }
    );
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-semibold">
              {isEditMode ? "Edit Employee" : "Create New Employee"}
            </DialogTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {isLoadingEmployee && isEditMode ? (
            <div className="text-center py-4">Loading employee data...</div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Replace direct input fields with FormField components */}
              <FormField label="Full Name" error={errors.name} required>
                <input
                  id="fullName"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full p-2 border rounded-md ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="Age" error={errors.age} required>
                <input
                  id="age"
                  type="number"
                  {...register("age", {
                    required: "Age is required",
                    valueAsNumber: true,
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.age ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="Position" error={errors.position} required>
                <input
                  id="position"
                  {...register("position", {
                    required: "Position is required",
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.position ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <FormField label="Department" error={errors.department} required>
                <select
                  id="department"
                  {...register("department", {
                    required: "Department is required",
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.department ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Employment Date" error={errors.employedOn} required>
                <input
                  id="employmentDate"
                  type="date"
                  {...register("employedOn", {
                    required: "Employment date is required",
                  })}
                  className={`w-full p-2 border rounded-md ${
                    errors.employedOn ? "border-red-500" : "border-gray-300"
                  }`}
                />
              </FormField>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isMutating ? "Saving..." : "Save Employee"}
                </button>
              </div>
            </form>
          )}
        </DialogPanel>
      </div>
    </Dialog>
  );
}
