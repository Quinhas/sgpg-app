import { StudentDTO } from "src/types/student.interface";
import _students from "./data.json";

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
export const employees = [
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 1513",
    employee_cpf: "74368317807",
    employee_email: "kevinseverinoandremendes@morada.com.br",
    employee_name: "Kevin Severino André Mendes",
    employee_password: "123",
    employee_phone: "14989807923",
    employee_role: 4,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 1510",
    employee_cpf: "74368317600",
    employee_email: "andremendes@morada.com.br",
    employee_name: " André Mendes",
    employee_password: "123",
    employee_phone: "14989807924",
    employee_role: 1,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 1555",
    employee_cpf: "74368317200",
    employee_email: "mendes@morada.com.br",
    employee_name: "Severino Mendes",
    employee_password: "123",
    employee_phone: "14989807925",
    employee_role: 2,
    employee_salary: 3000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 1500",
    employee_cpf: "74368317100",
    employee_email: "keseveri_andem@morada.com.br",
    employee_name: "Keseveri Andem",
    employee_password: "123",
    employee_phone: "14989807926",
    employee_role: 1,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 100",
    employee_cpf: "74368317123",
    employee_email: "paulo@hotmail.com",
    employee_name: "Paulo coelho",
    employee_password: "123",
    employee_phone: "14989807927",
    employee_role: 1,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 101",
    employee_cpf: "74368317124",
    employee_email: "airton@hotmail.com",
    employee_name: "Airton Carlos",
    employee_password: "123",
    employee_phone: "14989807929",
    employee_role: 1,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 150",
    employee_cpf: "74368317300",
    employee_email: "tiago@hotmail.com",
    employee_name: "Tiado Almeida",
    employee_password: "123",
    employee_phone: "14989807993",
    employee_role: 1,
    employee_salary: 2000.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av Santo Antonio, 250",
    employee_cpf: "74368317600",
    employee_email: "kemendes@morada.com.br",
    employee_name: "Kenedy Mendes",
    employee_password: "123",
    employee_phone: "14989807960",
    employee_role: 4,
    employee_salary: 1500.0,
    is_deleted: false,
  },
  {
    created_by: 1,
    employee_addr: "Av sampaio vidal, 100",
    employee_cpf: "74368317200",
    employee_email: "felipeluis@hotmail.com.br",
    employee_name: "Felipe Luis ",
    employee_password: "123",
    employee_phone: "14989807930",
    employee_role: 4,
    employee_salary: 1500.0,
    is_deleted: false,
  },
];
// Turma
export const classes = [
  {
    class_days: "TERCA",
    class_desc: "Sopro",
    class_duration: 1,
    class_name: "Flauta Indiana",
    class_teacher: 2,
    created_by: 1,
    is_deleted: false,
  },
  {
    class_days: "QUARTA",
    class_desc: "Guitarra",
    class_duration: 1,
    class_name: "Guitarra Classica",
    class_teacher: 4,
    created_by: 1,
    is_deleted: false,
  },
  {
    class_days: "QUINTA",
    class_desc: "Violão",
    class_duration: 1,
    class_name: "Violão rural",
    class_teacher: 4,
    created_by: 1,
    is_deleted: false,
  },
];
// Responsaveis
export const responsibles = [
  {
    created_by: 1,
    is_deleted: false,
    responsible_addr: "Av carlos gomes, 200",
    responsible_cpf: "71260340830",
    responsible_email: "ttatianemanuelalima@engemed.com",
    responsible_name: "Tatiane Manuela Lima",
    responsible_phone: "14996536619",
  },
  {
    created_by: 1,
    is_deleted: false,
    responsible_addr: "Av carlos gomes, 150",
    responsible_cpf: "71260340838",
    responsible_email: "manuelalima@engemed.com",
    responsible_name: "Manuela Lima",
    responsible_phone: "14996536620",
  },
  {
    created_by: 1,
    is_deleted: false,
    responsible_addr: "Av carlos gomes, 100",
    responsible_cpf: "71260340835",
    responsible_email: "ttati@engemed.com",
    responsible_name: "Tatiane Lima",
    responsible_phone: "14996536670",
  },
  {
    created_by: 1,
    is_deleted: false,
    responsible_addr: "Av carlos gomes, 400",
    responsible_cpf: "71260340860",
    responsible_email: "Lima@engemed.com",
    responsible_name: "Lima",
    responsible_phone: "14996536630",
  },
];
// Estudantes
const students: StudentDTO[] = [];

_students.map((student) => {
  students.push({
    student_name: student.nome,
    student_rg: student.rg,
    student_cpf: student.cpf,
    student_email: `${student.nome.split(" ")[0]}${student.cpf.substr(
      0,
      3
    )}@gmail.com`,
    student_addr: `${student.endereco}, ${student.numero}`,
    student_phone: student.celular,
    student_responsible: null,
    student_scholarship: null,
    is_deleted: false,
    created_by: 6,
  });
});

export { students };

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
