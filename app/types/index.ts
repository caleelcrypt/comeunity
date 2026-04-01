export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  link: string | null;
  link_domain?: string | null;
  link_title?: string | null;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
}

export interface PostWithInteraction extends Post {
  is_liked: boolean;
  is_following: boolean;
  is_own_post?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_avatar: string;
  content: string;
  parent_id: string | null;
  likes_count: number;
  created_at: string;
}

export interface CommentWithInteraction extends Comment {
  is_liked: boolean;
  replies?: CommentWithInteraction[];
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string | null;
  xp: number;
  coins: number;
  level: number;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at?: string;
  onboarding_completed?: boolean;
}

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  category?: string;
  icon?: string;
  title?: string;
  message?: string;
  actor_id: string;
  actor_name?: string;
  actor_avatar?: string;
  post_id?: string | null;
  comment_id?: string | null;
  read: boolean;
  data?: any;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'xp' | 'coin';
  duration?: number;
}

export interface CreatePostInput {
  content: string;
  link?: string;
  category: string;
}

export interface CommentInput {
  post_id: string;
  content: string;
  parent_id?: string | null;
  is_own_post?: boolean;
}

export interface Tip {
  id: string;
  sender_id: string;
  recipient_id: string;
  post_id: string;
  amount: number;
  message: string | null;
  created_at: string;
}

export type ShowToastFunction = (message: string, type?: ToastMessage['type']) => void;