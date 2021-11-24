import formatCPF from "@utils/formatCPF";
import formatPhone from "@utils/formatPhone";
import { SGPGApplicationException } from "@utils/SGPGApplicationException";
import axios from "axios";
import { Class, ClassDTO } from "src/types/class.interface";
import { EmployeeDTO, EmployeeResponse } from "src/types/employee.interface";
import { Instrument, InstrumentDTO } from "src/types/instrument.interface";
import {
  InstrumentBrand,
  InstrumentBrandDTO
} from "src/types/instrumentbrand.interface";
import {
  InstrumentType,
  InstrumentTypeDTO
} from "src/types/instrumenttype.interface";
import { Role, RoleDTO } from "src/types/role.interface";
import { Student, StudentDTO } from "src/types/student.interface";

const apiService = axios.create({
  // baseURL:
  //   process.env.NODE_ENV === "production"
  //     ? "https://sgpg-univem.herokuapp.com/"
  //     : "http://localhost:5000/",
  // baseURL: "https://sgpg-univem.herokuapp.com/",
  baseURL: "http://localhost:5000/",
});

// BEGINS EMPLOYEE SERVICE

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

export async function login(
  email: string,
  password: string
): Promise<EmployeeResponse> {
  try {
    const response = (
      await apiService.post<{ message: string; records: EmployeeResponse }>(
        `/employees/login`,
        {
          employee_email: email,
          employee_password: password,
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

const employees = {
  getAll: getAllEmployees,
  getByID: getEmployeeByID,
  create: createEmployee,
  update: updateEmployee,
  delete: deleteEmployee,
  login: login,
};

// ENDS EMPLOYEE SERVICE

// BEGINS INSTRUMENT SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all instruments, even those that were deleted.
 * @returns {Promise} Array of all instruments.
 * @throws {SGPGApplicationException}
 */
export async function getAllInstruments(
  isDeleted: boolean = false
): Promise<Instrument[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: Instrument[] }>(
          "/instruments"
        )
      ).data;
      const instruments = response.records;
      return instruments;
    } else {
      const response = (
        await apiService.get<{ message: string; records: Instrument[] }>(
          "/instruments"
        )
      ).data;
      const instruments = (response.records ?? []).filter(
        (instrument) => !instrument.is_deleted
      );
      return instruments;
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
 * @param {number} id - ID of the instrument.
 * @returns {Promise} If found, returns the instrument. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getInstrumentByID(id: number): Promise<Instrument> {
  try {
    const response = (
      await apiService.get<{ message: string; records: Instrument }>(
        `/instruments/${id}`
      )
    ).data;
    const instrument = response.records ?? null;
    return instrument;
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
 * @param {Object} _instrument - InstrumentDTO
 * @returns {Promise} If successfull, returns the new instrument.
 * @throws {SGPGApplicationException}
 */
export async function createInstrument(
  _instrument: InstrumentDTO
): Promise<Instrument> {
  try {
    const response = (
      await apiService.post<{ message: string; records: Instrument }>(
        "/instruments",
        _instrument
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
 * @param {number} id - ID of the instrument.
 * @param {Object} _instrument - InstrumentDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateInstrument(
  id: number,
  _instrument: Partial<InstrumentDTO>
): Promise<Instrument> {
  try {
    const response = (
      await apiService.put<{ message: string; records: Instrument }>(
        `/instruments/${id}`,
        _instrument
      )
    ).data;
    const instrument = response.records ?? null;
    return instrument;
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
 * @param {number} id - ID of the instrument.
 * @returns {Promise} If successful, returns the instrument deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteInstrument(id: number): Promise<Instrument> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: Instrument }>(
        `/instruments/${id}`
      )
    ).data;
    const instrument = response.records ?? null;
    return instrument;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const instruments = {
  getAll: getAllInstruments,
  getByID: getInstrumentByID,
  create: createInstrument,
  update: updateInstrument,
  delete: deleteInstrument,
};

// ENDS INSTRUMENT SERVICE

// BEGINS STUDENT SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all students, even those that were deleted.
 * @returns {Promise} Array of all students.
 * @throws {SGPGApplicationException}
 */
export async function getAllStudents(
  isDeleted: boolean = false
): Promise<Student[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: Student[] }>(
          "/students"
        )
      ).data;
      const students = response.records;
      return students;
    } else {
      const response = (
        await apiService.get<{ message: string; records: Student[] }>(
          "/students"
        )
      ).data;
      const students = (response.records ?? []).filter(
        (student) => !student.is_deleted
      );
      return students;
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
 * @param {number} id - ID of the student.
 * @returns {Promise} If found, returns the student. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getStudentByID(id: number): Promise<Student> {
  try {
    const response = (
      await apiService.get<{ message: string; records: Student }>(
        `/students/${id}`
      )
    ).data;
    const student = response.records ?? null;
    return student;
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
 * @param {Object} _student - StudentDTO
 * @returns {Promise} If successfull, returns the new student.
 * @throws {SGPGApplicationException}
 */
export async function createStudent(_student: StudentDTO): Promise<Student> {
  try {
    const response = (
      await apiService.post<{ message: string; records: Student }>(
        "/students",
        _student
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
 * @param {number} id - ID of the student.
 * @param {Object} _student - StudentDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateStudent(
  id: number,
  _student: Partial<StudentDTO>
): Promise<Student> {
  try {
    const response = (
      await apiService.put<{ message: string; records: Student }>(
        `/students/${id}`,
        _student
      )
    ).data;
    const student = response.records ?? null;
    return student;
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
 * @param {number} id - ID of the student.
 * @returns {Promise} If successful, returns the student deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteStudent(id: number): Promise<Student> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: Student }>(
        `/students/${id}`
      )
    ).data;
    const student = response.records ?? null;
    return student;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const students = {
  getAll: getAllStudents,
  getByID: getStudentByID,
  create: createStudent,
  update: updateStudent,
  delete: deleteStudent,
};

// ENDS STUDENT SERVICE

// BEGINS CLASS SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all classes, even those that were deleted.
 * @returns {Promise} Array of all classes.
 * @throws {SGPGApplicationException}
 */
export async function getAllClasses(
  isDeleted: boolean = false
): Promise<Class[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: Class[] }>("/classes")
      ).data;
      const classes = response.records;
      return classes;
    } else {
      const response = (
        await apiService.get<{ message: string; records: Class[] }>("/classes")
      ).data;
      const classes = (response.records ?? []).filter(
        (classSGPG) => !classSGPG.is_deleted
      );
      return classes;
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
 * @param {number} id - ID of the classSGPG.
 * @returns {Promise} If found, returns the classSGPG. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getClassByID(id: number): Promise<Class> {
  try {
    const response = (
      await apiService.get<{ message: string; records: Class }>(
        `/classes/${id}`
      )
    ).data;
    const classSGPG = response.records ?? null;
    return classSGPG;
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
 * @param {Object} _class - ClassDTO
 * @returns {Promise} If successfull, returns the new classSGPG.
 * @throws {SGPGApplicationException}
 */
export async function createClass(_class: ClassDTO): Promise<Class> {
  try {
    const response = (
      await apiService.post<{ message: string; records: Class }>(
        "/classes",
        _class
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
 * @param {number} id - ID of the classSGPG.
 * @param {Object} _class - ClassDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateClass(
  id: number,
  _class: Partial<ClassDTO>
): Promise<Class> {
  try {
    const response = (
      await apiService.put<{ message: string; records: Class }>(
        `/classes/${id}`,
        _class
      )
    ).data;
    const classSGPG = response.records ?? null;
    return classSGPG;
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
 * @param {number} id - ID of the classSGPG.
 * @returns {Promise} If successful, returns the classSGPG deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteClass(id: number): Promise<Class> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: Class }>(
        `/classes/${id}`
      )
    ).data;
    const classSGPG = response.records ?? null;
    return classSGPG;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const classes = {
  getAll: getAllClasses,
  getByID: getClassByID,
  create: createClass,
  update: updateClass,
  delete: deleteClass,
};

// ENDS CLASS SERVICE

// BEGINS ROLES SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all roles, even those that were deleted.
 * @returns {Promise} Array of all roles.
 * @throws {SGPGApplicationException}
 */
export async function getAllRoles(isDeleted: boolean = false): Promise<Role[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: Role[] }>("/roles")
      ).data;
      const roles = response.records;
      return roles;
    } else {
      const response = (
        await apiService.get<{ message: string; records: Role[] }>("/roles")
      ).data;
      const roles = (response.records ?? []).filter((role) => !role.is_deleted);
      return roles;
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
 * @param {number} id - ID of the role.
 * @returns {Promise} If found, returns the role. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getRoleByID(id: number): Promise<Role> {
  try {
    const response = (
      await apiService.get<{ message: string; records: Role }>(`/roles/${id}`)
    ).data;
    const role = response.records ?? null;
    return role;
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
 * @param {Object} _class - RoleDTO
 * @returns {Promise} If successfull, returns the new role.
 * @throws {SGPGApplicationException}
 */
export async function createRole(_class: RoleDTO): Promise<Role> {
  try {
    const response = (
      await apiService.post<{ message: string; records: Role }>(
        "/roles",
        _class
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
 * @param {number} id - ID of the role.
 * @param {Object} _class - RoleDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateRole(
  id: number,
  _role: Partial<RoleDTO>
): Promise<Role> {
  try {
    const response = (
      await apiService.put<{ message: string; records: Role }>(
        `/roles/${id}`,
        _role
      )
    ).data;
    const role = response.records ?? null;
    return role;
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
 * @param {number} id - ID of the role.
 * @returns {Promise} If successful, returns the role deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteRole(id: number): Promise<Role> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: Role }>(
        `/roles/${id}`
      )
    ).data;
    const role = response.records ?? null;
    return role;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const roles = {
  getAll: getAllRoles,
  getByID: getRoleByID,
  create: createRole,
  update: updateRole,
  delete: deleteRole,
};

// ENDS ROLES SERVICE

// BEGINS INSTRUMENT TYPES SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all instrumenttypes, even those that were deleted.
 * @returns {Promise} Array of all instrumenttypes.
 * @throws {SGPGApplicationException}
 */
export async function getAllInstrumentTypes(
  isDeleted: boolean = false
): Promise<InstrumentType[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: InstrumentType[] }>(
          "/instrumenttypes"
        )
      ).data;
      const instrumenttypes = response.records;
      return instrumenttypes;
    } else {
      const response = (
        await apiService.get<{ message: string; records: InstrumentType[] }>(
          "/instrumenttypes"
        )
      ).data;
      const instrumenttypes = (response.records ?? []).filter(
        (instrumenttype) => !instrumenttype.is_deleted
      );
      return instrumenttypes;
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
 * @param {number} id - ID of the instrumenttype.
 * @returns {Promise} If found, returns the instrumenttype. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getInstrumentTypeByID(
  id: number
): Promise<InstrumentType> {
  try {
    const response = (
      await apiService.get<{ message: string; records: InstrumentType }>(
        `/instrumenttypes/${id}`
      )
    ).data;
    const instrumenttype = response.records ?? null;
    return instrumenttype;
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
 * @param {Object} _class - InstrumentTypeDTO
 * @returns {Promise} If successfull, returns the new instrumenttype.
 * @throws {SGPGApplicationException}
 */
export async function createInstrumentType(
  _class: InstrumentTypeDTO
): Promise<InstrumentType> {
  try {
    const response = (
      await apiService.post<{ message: string; records: InstrumentType }>(
        "/instrumenttypes",
        _class
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
 * @param {number} id - ID of the instrumenttype.
 * @param {Object} _class - InstrumentTypeDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateInstrumentType(
  id: number,
  _type: Partial<InstrumentTypeDTO>
): Promise<InstrumentType> {
  try {
    const response = (
      await apiService.put<{ message: string; records: InstrumentType }>(
        `/instrumenttypes/${id}`,
        _type
      )
    ).data;
    const instrumenttype = response.records ?? null;
    return instrumenttype;
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
 * @param {number} id - ID of the instrumenttype.
 * @returns {Promise} If successful, returns the instrumenttype deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteInstrumentType(
  id: number
): Promise<InstrumentType> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: InstrumentType }>(
        `/instrumenttypes/${id}`
      )
    ).data;
    const instrumenttype = response.records ?? null;
    return instrumenttype;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const instrumenttypes = {
  getAll: getAllInstrumentTypes,
  getByID: getInstrumentTypeByID,
  create: createInstrumentType,
  update: updateInstrumentType,
  delete: deleteInstrumentType,
};

// ENDS INSTRUMENT TYPES SERVICE

// BEGINS INSTRUMENT BRANDS SERVICE

/**
 * @param {boolean} [isDeleted=false] - If true, returns all instrumentbrands, even those that were deleted.
 * @returns {Promise} Array of all instrumentbrands.
 * @throws {SGPGApplicationException}
 */
export async function getAllInstrumentBrands(
  isDeleted: boolean = false
): Promise<InstrumentBrand[]> {
  try {
    if (isDeleted) {
      const response = (
        await apiService.get<{ message: string; records: InstrumentBrand[] }>(
          "/instrumentbrands"
        )
      ).data;
      const instrumentbrands = response.records;
      return instrumentbrands;
    } else {
      const response = (
        await apiService.get<{ message: string; records: InstrumentBrand[] }>(
          "/instrumentbrands"
        )
      ).data;
      const instrumentbrands = (response.records ?? []).filter(
        (instrumentbrand) => !instrumentbrand.is_deleted
      );
      return instrumentbrands;
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
 * @param {number} id - ID of the instrumentbrand.
 * @returns {Promise} If found, returns the instrumentbrand. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function getInstrumentBrandByID(
  id: number
): Promise<InstrumentBrand> {
  try {
    const response = (
      await apiService.get<{ message: string; records: InstrumentBrand }>(
        `/instrumentbrands/${id}`
      )
    ).data;
    const instrumentbrand = response.records ?? null;
    return instrumentbrand;
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
 * @param {Object} _class - InstrumentBrandDTO
 * @returns {Promise} If successfull, returns the new instrumentbrand.
 * @throws {SGPGApplicationException}
 */
export async function createInstrumentBrand(
  _class: InstrumentBrandDTO
): Promise<InstrumentBrand> {
  try {
    const response = (
      await apiService.post<{ message: string; records: InstrumentBrand }>(
        "/instrumentbrands",
        _class
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
 * @param {number} id - ID of the instrumentbrand.
 * @param {Object} _class - InstrumentBrandDTO
 * @returns {Promise} If successfull, returns the updated employee.
 * @throws {SGPGApplicationException}
 */
export async function updateInstrumentBrand(
  id: number,
  _brand: Partial<InstrumentBrandDTO>
): Promise<InstrumentBrand> {
  try {
    const response = (
      await apiService.put<{ message: string; records: InstrumentBrand }>(
        `/instrumentbrands/${id}`,
        _brand
      )
    ).data;
    const instrumentbrand = response.records ?? null;
    return instrumentbrand;
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
 * @param {number} id - ID of the instrumentbrand.
 * @returns {Promise} If successful, returns the instrumentbrand deleted. Otherwise, returns null.
 * @throws {SGPGApplicationException}
 */
export async function deleteInstrumentBrand(
  id: number
): Promise<InstrumentBrand> {
  try {
    const response = (
      await apiService.delete<{ message: string; records: InstrumentBrand }>(
        `/instrumentbrands/${id}`
      )
    ).data;
    const instrumentbrand = response.records ?? null;
    return instrumentbrand;
  } catch (err: any) {
    if (err instanceof SGPGApplicationException) {
      throw err;
    } else {
      const error = err as Error;
      throw new SGPGApplicationException(error.message, error);
    }
  }
}

const instrumentbrands = {
  getAll: getAllInstrumentBrands,
  getByID: getInstrumentBrandByID,
  create: createInstrumentBrand,
  update: updateInstrumentBrand,
  delete: deleteInstrumentBrand,
};

// ENDS INSTRUMENT BRANDS SERVICE

const api = {
  apiService,
  employees,
  instruments,
  students,
  classes,
  roles,
  instrumenttypes,
  instrumentbrands,
};

export default api;
