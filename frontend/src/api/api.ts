import axios from "axios";
import { Department, Employee, EmployeesResponse } from "../types";

const API_URL = "http://localhost:5555"; // Base URL for the API

// Fetch a paginated list of employees with sorting and filtering options
export const fetchEmployees = async (
  page: number,
  limit: number,
  sort: string,
  filters: Record<string, string>
): Promise<EmployeesResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort,
    ...filters,
  });

  // Make a GET request to fetch employees
  const response = await axios.get<EmployeesResponse>(
    `${API_URL}/employees?${params}`
  );
  return response.data;
};

// Fetch a list of all departments
export const fetchDepartments = async (): Promise<Department[]> => {
  // Make a GET request to fetch departments
  const response = await axios.get<Department[]>(`${API_URL}/departments`);
  return response.data; // Return the response data
};

// Create a new employee
export const createEmployee = async (employee: Omit<Employee, "id">) => {
  // Make a POST request to create an employee
  const response = await axios.post<Employee>(`${API_URL}/employees`, employee);
  return response.data; // Return the created employee data
};

// Update an existing employee by ID
export const updateEmployee = async (
  id: number,
  employee: Partial<Employee>
) => {
  // Make a PUT request to update the employee
  const response = await axios.put<Employee>(
    `${API_URL}/employees/${id}`,
    employee
  );
  return response.data;
};
