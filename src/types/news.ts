export interface News {
  id: string;
  title: string;
  content: string;
  category_id?: string;
  category?: { id: string; name: string };
  created_at: string;
  updated_at: string;
  published_at?: string;
  is_published: boolean;
  author_id: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}