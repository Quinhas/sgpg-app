export interface InstrumentBrandDTO {
  instrumentbrand_name: string;
  instrumentbrand_desc: string | null;
  instrumentbrand_logo: string | null;
  created_by: number;
  is_deleted: boolean | null;
}

export interface InstrumentBrand extends InstrumentBrandDTO {
  instrumentbrand_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
}
