import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { fetchEmployees, fetchDepartments, createEmployee, updateEmployee, fetchEmployeeById } from '../api/api';
import { Department, Employee, EmployeesResponse } from '../types';

// Hook for fetching employees with filtering, pagination and sorting
export const useEmployees = (
  page: number,
  limit: number,
  sortField: string,
  filters: Record<string, string>,
  sortDirection?: 'asc' | 'desc'
) => {
  return useQuery<EmployeesResponse>({
    queryKey: ['employees', page, limit, sortField, filters, sortDirection],
    queryFn: () => fetchEmployees(page, limit, sortField, filters, sortDirection),
    placeholderData: (previousData) => previousData,
  });
};

// Hook for fetching departments
export const useDepartments = (options?: UseQueryOptions<Department[]>) => {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: fetchDepartments,
    ...options
  });
};

// Hook for fetching a single employee
export const useEmployee = (id: number | null, options?: UseQueryOptions<Employee>) => {
  return useQuery<Employee>({
    queryKey: ['employee', id],
    queryFn: () => fetchEmployeeById(Number(id)),
    enabled: !!id,
    ...options
  });
};

// Hook for creating/updating employees
export const useEmployeeMutation = (isEdit: boolean = false) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Employee> & { id?: number }) => {
      const { id, ...employeeData } = data;
      
      // Convert employedOn to Date if it's a string
      if (typeof employeeData.employedOn === 'string') {
        employeeData.employedOn = new Date(employeeData.employedOn);
      }
      
      return isEdit && id
        ? updateEmployee(id, employeeData)
        : createEmployee(employeeData as Omit<Employee, "id">);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    }
  });
};
