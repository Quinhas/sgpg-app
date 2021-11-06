import { InstrumentBrand } from "./instrumentbrand.interface";
import { InstrumentType } from "./instrumenttype.interface";

export interface InstrumentDTO {
  instrument_type: number;
  instrument_model: string;
  instrument_brand: number;
  instrument_student?: number | null;
  created_by: number;
  is_deleted: boolean | null;
}

export interface Instrument extends InstrumentDTO {
  instrument_id: number;
  created_at: Date;
  updated_at: Date | null;
  deleted_at: Date | null;
  instrumentbrand?: InstrumentBrand;
  instrumenttype?: InstrumentType;
}
