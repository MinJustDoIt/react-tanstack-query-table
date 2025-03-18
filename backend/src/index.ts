// Required dependencies
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { faker } from "@faker-js/faker"; // Import faker.js

// Setup Express application
const app = express();
const PORT = 5555;
const cors = require("cors");

// Middleware
/** updated the cors origin to match the frontend port */
app.use(cors({ origin: "http://localhost:5173" }));
app.use(bodyParser.json());

// Types
export interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  position: string;
  employedOn: Date;
}

export interface Department {
  id: number;
  name: string;
}

// In-memory data storage
export let employees: Employee[] = [];
export let departments: Department[] = [];
let nextEmployeeId = 1;
let nextDepartmentId = 1;

// Seed function to populate initial data
export const seedData = () => {
  // Seed departments
  departments = [
    { id: nextDepartmentId++, name: "Engineering" },
    { id: nextDepartmentId++, name: "HR" },
    { id: nextDepartmentId++, name: "Sales" },
    { id: nextDepartmentId++, name: "Marketing" },
    { id: nextDepartmentId++, name: "Finance" },
    { id: nextDepartmentId++, name: "IT" },
    { id: nextDepartmentId++, name: "Accounting" },
  ];

  // Seed 1000 employees using faker.js
  for (let i = 0; i < 1000; i++) {
    const randomDepartment =
      departments[Math.floor(Math.random() * departments.length)].name;

    employees.push({
      id: nextEmployeeId++,
      name: faker.person.fullName(),
      age: faker.number.int({ min: 20, max: 65 }),
      department: randomDepartment,
      position: faker.person.jobTitle(),
      employedOn: faker.date.past({ years: 5 }),
    });
  }
};

// Call seed function
seedData();

// Helper function that paginates data.
const paginate = (
  items: Employee[],
  page: number,
  perPage: number
): Employee[] => {
  const offset = (page - 1) * perPage;
  return items.slice(offset, offset + perPage);
};

// Routes (same as before)

/**
 * GET /employees
 * Returns a paginated list of employees.
 * Query Parameters:
 * - page (number): The page number (default is 1).
 * - limit (number): The number of records per page (default is 10).
 * - sort (string): The field to sort by (default is 'id').
 * - order (string): The sort order ('asc' or 'desc', default is 'asc').
 * - filterName (string): Optional filter by employee name.
 * - filterDepartment (string): Optional filter by department.
 */
app.get("/employees", (req: Request, res: Response) => {
  let {
    page = "1",
    limit = "10",
    sort = "id",
    order = "asc", // Add order parameter
    filterName = "",
    filterDepartment = "",
    filterEmployedBefore = "",
    filterEmployedAfter = "",
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const isDescending = (order as string).toLowerCase() === "desc";

  let filteredEmployees = employees;

  // Apply filters if provided
  if (filterName) {
    filteredEmployees = filteredEmployees.filter((emp) =>
      emp.name.toLowerCase().includes((filterName as string).toLowerCase())
    );
  }

  // Filter by department name
  if (filterDepartment) {
    filteredEmployees = filteredEmployees.filter((emp) =>
      emp.department
        .toLowerCase()
        .includes((filterDepartment as string).toLowerCase())
    );
  }

  // Filter by employed date
  // Will find any employees employed before this date.
  if (filterEmployedBefore) {
    const filterDate = new Date(filterEmployedBefore as string);
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.employedOn < filterDate
    );
  }

  // Filter by employed date
  // Will find any employees employed after this date.
  if (filterEmployedAfter) {
    const filterDate = new Date(filterEmployedAfter as string);
    filteredEmployees = filteredEmployees.filter(
      (emp) => emp.employedOn > filterDate
    );
  }

  // Sort employees
  /** updated the sorting logic to handle order */
  filteredEmployees.sort((a, b) => {
    if (a[sort as keyof Employee] < b[sort as keyof Employee])
      return isDescending ? 1 : -1;
    if (a[sort as keyof Employee] > b[sort as keyof Employee])
      return isDescending ? -1 : 1;
    return 0;
  });

  const totalRecords = filteredEmployees.length;
  const paginatedEmployees = paginate(filteredEmployees, pageNum, limitNum);

  res.json({
    data: paginatedEmployees,
    totalRecords,
    page: pageNum,
    limit: limitNum,
  });
});

/**
 * GET /employees/:id
 * Returns the details of a specific employee by ID.
 */
app.get("/employees/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  res.json(employee);
});

/**
 * POST /employees
 * Creates a new employee.
 * Request Body:
 * - name (string): The employee's name.
 * - age (number): The employee's age.
 * - department (string): The department the employee belongs to.
 * - position (string): The employee's position.
 * - employedOn (date): The date the employee was employed.
 */
app.post("/employees", (req: Request, res: Response) => {
  const { name, age, department, position, employedOn } = req.body;

  if (!name || !age || !department || !position || !employedOn) {
    return res.status(400).json({
      message:
        "All fields are required: name, age, department, position, employedOn",
    });
  }

  const newEmployee: Employee = {
    id: nextEmployeeId++,
    name,
    age,
    department,
    position,
    employedOn: new Date(employedOn),
  };

  employees.push(newEmployee);
  res.status(201).json(newEmployee);
});

/**
 * PUT /employees/:id
 * Updates an existing employee by ID.
 * Request Body:
 * - name (string): The employee's name (optional).
 * - age (number): The employee's age (optional).
 * - department (string): The department the employee belongs to (optional).
 * - position (string): The employee's position (optional).
 * - employedOn (date): The date the employee was employed (optional).
 */
app.put("/employees/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const employee = employees.find((emp) => emp.id === id);

  if (!employee) {
    return res.status(404).json({ message: "Employee not found" });
  }

  const { name, age, department, position, employedOn } = req.body;

  if (name) employee.name = name;
  if (age) employee.age = age;
  if (department) employee.department = department;
  if (position) employee.position = position;
  if (employedOn) employee.employedOn = new Date(employedOn);

  res.json(employee);
});

/**
 * GET /departments
 * Returns a list of all departments.
 */
app.get("/departments", (req: Request, res: Response) => {
  res.json(departments);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
