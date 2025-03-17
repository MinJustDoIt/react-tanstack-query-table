import { Employee } from "./employee.type";

export interface EmployeesResponse {
  data: Employee[];
  totalRecords: number;
  page: number;
  limit: number;
}
