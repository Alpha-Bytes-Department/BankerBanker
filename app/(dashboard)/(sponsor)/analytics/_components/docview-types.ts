export interface DocviewDocument {
  id: number;
  file_url: string;
  uploaded_at: string;
  name?: string;
  file_name?: string;
  file?: string;
  size?: number;
}

export interface DocviewProperty {
  id: number;
  property_name: string;
  property_address?: string;
  property_type?: string;
  property_image_url?: string;
  thumbnail_url?: string | null;
}

export interface PropertyDocumentGroup {
  property: DocviewProperty;
  documents: DocviewDocument[];
}

export interface ChatSession {
  id: number;
  property: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant" | "typing";
  content: string;
  created_at?: string;
}
