export interface DocviewDocument {
  id: number;
  file_url: string;
  uploaded_at: string;
}

export interface DocviewProperty {
  id: number;
  property_name: string;
  property_address?: string;
  property_type?: string;
  property_image_url?: string;
}

export interface PropertyDocumentGroup {
  property: DocviewProperty;
  documents: DocviewDocument[];
}
