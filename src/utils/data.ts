import { EmployeeDTO } from "src/types/employee.interface";
import { StudentDTO } from "src/types/student.interface";
import _students from "./data.json";
import _employees from "./employees.json";

export const roles = [
  {
    created_by: 1,
    is_deleted: false,
    role_desc: "Professor",
    role_title: "Professor",
  },

  {
    created_by: 1,
    is_deleted: false,
    role_desc: "Faxineiro",
    role_title: "Faxineiro",
  },
  {
    created_by: 1,
    is_deleted: false,
    role_desc: "Coordenador",
    role_title: "Coordenador",
  },
  {
    created_by: 1,
    is_deleted: false,
    role_desc: "Assistente",
    role_title: "Assistente",
  },
];
// Funcionarios
const employees: EmployeeDTO[] = [];

_employees.map((employee) => {
  employees.push({
    employee_name: employee.employee_name,
    employee_email: `${employee.employee_name
      .split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}@sgpg.com`,
    employee_cpf: employee.employee_cpf,
    employee_password: `${employee.employee_name
      .split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}_sgpg`,
    employee_addr: employee.employee_addr,
    employee_phone: employee.employee_phone,
    employee_role: employee.employee_role,
    employee_salary: employee.employee_salary,
    created_by: 0,
    is_deleted: false,
  });
});

export { employees };
export { students };

// Estudantes
const students: StudentDTO[] = [];

_students.map((student) => {
  students.push({
    student_name: student.nome,
    student_rg: student.rg,
    student_cpf: student.cpf,
    student_email: `${student.nome
      .split(" ")[0]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")}${student.cpf.substr(0, 3)}@gmail.com`,
    student_addr: `${student.endereco}, ${student.numero}`,
    student_phone: student.celular,
    student_responsible: null,
    student_scholarship: null,
    is_deleted: false,
    created_by: 0,
  });
});

// Marca Instrumento
export const instrumentbrands = [
  {
    created_by: 1,
    instrumentbrand_desc: "Sopro",
    instrumentbrand_logo:
      "https://thumbs.dreamstime.com/z/%C3%ADcone-da-flauta-%C3%ADcone-do-vetor-da-silhueta-93153637.jpg",
    instrumentbrand_name: "NineFlaut",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumentbrand_desc: "guitarra",
    instrumentbrand_logo:
      "https://media.istockphoto.com/vectors/vector-guitar-logo-icon-vector-id1197682363?k=20&m=1197682363&s=170667a&w=0&h=x0Rfh6occzSzKRjar0zQqQhR15GhM_4UrSVwHgXhXto=",
    instrumentbrand_name: "GuitarSix",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumentbrand_desc: "percusão",
    instrumentbrand_logo:
      "https://thumbs.dreamstime.com/b/%C3%ADcone-da-percuss%C3%A3o-conceito-na-moda-do-logotipo-no-backgro-branco-131168679.jpg",
    instrumentbrand_name: "Tandara",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumentbrand_desc: "grito",
    instrumentbrand_logo: "garganta ",
    instrumentbrand_name: "Scream",
    is_deleted: false,
  },
];
// Tipo Instrumento
export const instrumenttypes = [
  {
    created_by: 1,
    instrumenttype_desc: "Sopro",
    instrumenttype_name: "Flauta",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumenttype_desc: "cordas",
    instrumenttype_name: "guitar",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumenttype_desc: "Percusão",
    instrumenttype_name: "triangulo",
    is_deleted: false,
  },
  {
    created_by: 1,
    instrumenttype_desc: "Grito",
    instrumenttype_name: "Grito",
    is_deleted: false,
  },
];
// Instrumento
export const instruments = [
  {
    created_by: 1,
    instrument_brand: 1,
    instrument_model: "Smg",
    instrument_student: 1,
    instrument_type: 1,
    is_deleted: false,
  },
  {
    created_by: 1,
    instrument_brand: 2,
    instrument_model: "Sff5",
    instrument_student: null,
    instrument_type: 2,
    is_deleted: false,
  },
  {
    created_by: 1,
    instrument_brand: 3,
    instrument_model: "sgsg",
    instrument_student: 3,
    instrument_type: 3,
    is_deleted: false,
  },
  {
    created_by: 1,
    instrument_brand: 4,
    instrument_model: "F568",
    instrument_student: 4,
    instrument_type: 4,
    is_deleted: false,
  },
];
// Event
export const events = [
  {
    created_by: 1,
    event_desc: "Show de Talentos",
    event_name: "Primeiro Show de Talentos pos pandemia",
    is_deleted: false,
  },
];
