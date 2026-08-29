export type PlaceData = {
  place_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  photos?: string[];
  rating?: number | null;
  types?: string[] | string;
  // Extracted property fields from backend
  property_name?: string;
  property_address?: string;
  property_type?: string;
  number_of_units?: number | string;
  rentable_area?: number | string;
  year_built?: number | string;
  occupancy?: number | string;
  year_renovated?: number | string;
  parking_spaces?: number | string;
  [key: string]: unknown;
};

export type PropertyData = {
  id?: number;
  place_id?: string;
  property_name: string;
  property_address: string;
  property_type?: string;
  number_of_units?: number | string;
  rentable_area?: number | string;
  year_built?: number | string;
  occupancy?: number | string;
  year_renovated?: number | string;
  parking_spaces?: number | string;
  latitude?: number | string;
  longitude?: number | string;
  photos?: string[];
  types?: string[] | string;
  [key: string]: unknown;
};

export type UploadedFileItem = {
  id?: number | string;
  name?: string;
  file_url?: string;
  uploaded_at?: string;
  size?: number;
  type?: string;
  [key: string]: unknown;
};

