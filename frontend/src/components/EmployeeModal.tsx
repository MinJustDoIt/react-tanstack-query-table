import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { updateEmployee, createEmployee } from "../api/api";
import { Employee, Department } from "../types";

interface EmployeeModalProps {
  readonly employee?: Employee | null;
  readonly departments: Department[];
  readonly onClose: () => void;
  readonly onSuccess: () => void;
}

export default function EmployeeModal({
  employee,
  departments,
  onClose,
  onSuccess,
}: EmployeeModalProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!employee?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Employee>({
    defaultValues: employee || {
      name: "",
      age: 18,
      position: "",
      department: "",
      employedOn: new Date(),
    },
  });

  const mutation = useMutation({
    mutationFn: (data: Employee) =>
      isEditMode ? updateEmployee(employee.id, data) : createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      onSuccess();
      onClose();
    },
  });

  return (
    <Dialog open={!!employee} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* Modal container */}
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

          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-4"
          >
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name *
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                className={`w-full p-2 border rounded-md ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Age Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Age *</label>
              <input
                type="number"
                {...register("age", {
                  required: "Age is required",
                  min: { value: 18, message: "Minimum age is 18" },
                  max: { value: 65, message: "Maximum age is 65" },
                })}
                className={`w-full p-2 border rounded-md ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Position Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Position *
              </label>
              <input
                {...register("position", { required: "Position is required" })}
                className={`w-full p-2 border rounded-md ${
                  errors.position ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.position && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.position.message}
                </p>
              )}
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Department *
              </label>
              <select
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
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.department.message}
                </p>
              )}
            </div>

            {/* Employment Date */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Employment Date *
              </label>
              <input
                type="date"
                {...register("employedOn", {
                  required: "Employment date is required",
                })}
                className={`w-full p-2 border rounded-md ${
                  errors.employedOn ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.employedOn && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.employedOn.message}
                </p>
              )}
            </div>

            {/* Form Actions */}
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
                disabled={mutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {mutation.isPending ? "Saving..." : "Save Employee"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
