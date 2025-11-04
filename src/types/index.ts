export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  product_description: string;
  brand_voice: string;
  created_at: string;
}

export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'posted' | 'declined';

export type Platform = 'linkedin' | 'instagram_feed' | 'instagram_story' | 'tiktok' | 'facebook';

export interface Post {
  id: string;
  user_id: string;
  brand_id: string;
  caption: string;
  platform: Platform;
  status: PostStatus;
  scheduled_at?: string;
  posted_at?: string;
  image_url?: string;
  created_at: string;
}

export interface Trend {
  id: string;
  topic: string;
  volume: number;
  platform: string;
  description: string;
}

export interface Analytics {
  post_id: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement_rate: number;
}
