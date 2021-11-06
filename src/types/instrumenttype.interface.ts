export interface InstrumentTypeDTO {
  instrumenttype_name: string;
  instrumenttype_desc: string | null;
  created_by: number;
  is_deleted: boolean | null;
}

export interface InstrumentType extends InstrumentTypeDTO {
  instrumenttype_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
