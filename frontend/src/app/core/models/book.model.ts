export interface Book {
  id: number;
  title: string;
  author: string;
  publication_year: number;
  isbn: string | null;
  created_at?: string;
  updated_at?: string;
}

export type BookPayload = Omit<Book, 'id' | 'created_at' | 'updated_at'>;