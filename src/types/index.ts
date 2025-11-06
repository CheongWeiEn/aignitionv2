export interface Brand {
  id: string;
  name: string;
  product_description: string;
  brand_voice: string;
}

export interface Post {
  id: string;
  user_id: string;
  brand_id: string;
  caption: string;
  platform: 'linkedin' | 'instagram' | string;
  status: 'draft' | 'approved' | 'declined' | string;
  created_at: string;
  scheduled_at: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
}


export type PostStatus = 'draft' | 'approved' | 'scheduled' | 'posted' | 'declined';

export type Platform = 'linkedin' | 'instagram_feed' | 'instagram_story' | 'tiktok' | 'facebook';

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
