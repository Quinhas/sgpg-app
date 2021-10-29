import formatCPF from "@utils/formatCPF";
import formatPhone from "@utils/formatPhone";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import axios from "axios";
import { EmployeeDTO, EmployeeResponse } from "src/types/employee.interface";

const apiService = axios.create({
  baseURL: "http://localhost:5000/",
});

/**
 * @param {boolean} [isDeleted=false] - If true, returns all employees, even those that were deleted.
 * @returns {Promise} Array of all employees.
 * @throws {SGPGApplicationException}
 */
export async function getAllEmployees(
  isDeleted: boolean = false
): Promise<EmployeeResponse[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: EmployeeResponse[] }>(
          "/employees"
        )
      ).data;
      const employees = (response.records ?? []).map((employee) => {
        return {
          ...employee,
          employee_salary: Number(employee.employee_salary),
          employee_cpf: formatCPF(employee.employee_cpf),
          employee_phone: formatPhone(employee.employee_phone),
        };
      });
      return employees;
    } else {
      const response = (
        await apiService.get<{ message: string; records: EmployeeResponse[] }>(
          "/employees"
        )
      ).data;
      const employees = (response.records ?? [])
        .filter((employee) => !employee.is_deleted)
        .map((employee) => {
          return {
            ...employee,
            employee_salary: Number(employee.employee_salary),
            employee_cpf: formatCPF(employee.employee_cpf),
            employee_phone: formatPhone(employee.employee_phone),
          };
        });
      return employees;
    }
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

/**
 * @param {number} id - ID of the employee.
 * @returns {Promise} If found, returns the employee. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getEmployeeByID(id: number): Promise<EmployeeResponse> {
  try {
    const response = (
      await apiService.get<{ message: string; records: EmployeeResponse }>(
        `/employees/${id}`
      )
    ).data;
    const employee = response.records ?? null;
    return employee;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

/**
 * @param {Object} _employee - EmployeeDTO
 * @returns {Promise} If successfull, returns the new employee.
 * @throws {SGPGApplicationException}
 */
export async function createEmployee(
  _employee: EmployeeDTO
): Promise<EmployeeResponse> {
  try {
    const response = (
      await apiService.post<{ message: string; records: EmployeeResponse }>(
        "/employees",
        _employee
      )
    ).data;
    return response.records;
  } catch (err: any) {
    console.log(err);
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

/**
 * @param {number} id - ID of the employee.
 * @param {Object} _employee - EmployeeDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateEmployee(
  id: number,
  _employee: Partial<EmployeeDTO>
): Promise<EmployeeResponse> {
  try {
    const response = (
      await apiService.put<{ message: string; records: EmployeeResponse }>(
        `/employees/${id}`,
        {
          ..._employee,
          employee_phone: _employee.employee_phone?.replace(/\D/g, ""),
        }
      )
    ).data;
    const employee = response.records ?? null;
    return employee;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

/**
 * @param {number} id - ID of the employee.
 * @returns {Promise} If successful, returns the employee deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteEmployee(id: number): Promise<EmployeeResponse> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: EmployeeResponse }>(
        `/employees/${id}`
      )
    ).data;
    const employee = response.records ?? null;
    return employee;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const api = {
  apiService,
  getAllEmployees,
  getEmployeeByID,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default api;
