export interface ClassDTO {
  class_name: string;
  class_desc: string | null;
  class_teacher: number | null;
  class_duration: number | null;
  class_days: string | null;
  created_by: number;
  is_deleted: boolean | null;
}

export interface Class extends ClassDTO {
  class_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
