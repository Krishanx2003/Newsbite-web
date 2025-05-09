export interface Author {
    name: string;
    avatar: string;
  }
  
  export interface FormData {
    title: string;
    subtitle: string;
    author: Author;
    date: string;
    readTime: string;
    category: string;
    content: string;
    tags: string[];
    imageFile: File | null;
    imageUrl: string;
  }

  // types/article.ts
export interface Article {
  id: string;
  title: string;
  subtitle: string;
  author_name: string;
  author_avatar: string;
  date: string;
  read_time: string;
  category: string;
  content: string;
  tags: string[];
  image_url: string;
  // Add any other optional fields if needed
  [key: string]: any; // This allows for additional properties if your articles vary
}

export type CategoryType = string;