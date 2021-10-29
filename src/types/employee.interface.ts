export interface EmployeeDTO {
  employee_name: string;
  employee_cpf: string;
  employee_email: string;
  employee_password: string;
  employee_phone: string;
  employee_addr: string;
  employee_salary: number;
  employee_role: number;
  created_by: number;
  is_deleted: boolean;
}

export interface Employee extends EmployeeDTO {
  employee_id: number;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface EmployeeResponse extends Omit<Employee, "employee_password"> {}
