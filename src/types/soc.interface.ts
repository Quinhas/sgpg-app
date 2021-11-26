import { Student } from "./student.interface";

export interface SocDTO {
  student_id: number;
  class_id: number;
  created_by: number;
}

export interface StudentOfClass extends SocDTO {
  created_at: Date;
  students: Student;
}
