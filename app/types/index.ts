// comeunity/app/types/index.ts
export interface Post {
  id: string;
  user_id: string;  // Changed from author_id
  author_name: string;
  author_avatar: string;
  content: string;
  link: string | null;
  link_domain?: string | null;  // Added from your schema
  link_title?: string | null;   // Added from your schema
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
}

export interface PostWithInteraction extends Post {
  is_liked: boolean;
  is_following: boolean;
}

// ... rest of types remain the same