import { Brand, Post, Trend, Analytics, User } from '../types';

export const mockUser: User = {
  id: 'user_1',
  email: 'demo@example.com',
  name: 'Demo User',
};

export const mockBrands: Brand[] = [
  {
    id: 'brand_1',
    user_id: 'user_1',
    name: 'TechCo',
    product_description: 'AI-powered productivity tools for modern teams',
    brand_voice: 'Professional yet approachable, focusing on innovation and efficiency',
    created_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'brand_2',
    user_id: 'user_1',
    name: 'FitLife',
    product_description: 'Wellness and fitness coaching platform',
    brand_voice: 'Energetic, motivational, and empowering',
    created_at: '2025-02-01T10:00:00Z',
  },
];

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    user_id: 'user_1',
    brand_id: 'brand_1',
    caption: '🚀 Excited to announce our new AI features that will revolutionize your workflow! Stay tuned for the big reveal next week. #Innovation #AI #Productivity',
    platform: 'linkedin',
    status: 'draft',
    created_at: '2025-11-02T14:30:00Z',
  },
  {
    id: 'post_2',
    user_id: 'user_1',
    brand_id: 'brand_1',
    caption: 'Behind the scenes at TechCo HQ 💻✨ Our team is hard at work building the future of productivity tools.',
    platform: 'instagram_feed',
    status: 'draft',
    created_at: '2025-11-02T15:00:00Z',
  },
  {
    id: 'post_3',
    user_id: 'user_1',
    brand_id: 'brand_1',
    caption: 'Quick tip: Did you know you can boost your productivity by 40% with our smart scheduling feature? Try it today! 🎯',
    platform: 'linkedin',
    status: 'approved',
    scheduled_at: '2025-11-06T09:00:00Z',
    created_at: '2025-11-01T10:00:00Z',
  },
  {
    id: 'post_4',
    user_id: 'user_1',
    brand_id: 'brand_2',
    caption: '💪 Your Monday motivation: Every workout counts, no matter how small. Let\'s crush this week together! #FitnessMotivation #Wellness',
    platform: 'instagram_feed',
    status: 'scheduled',
    scheduled_at: '2025-11-04T07:00:00Z',
    created_at: '2025-11-01T16:00:00Z',
  },
  {
    id: 'post_5',
    user_id: 'user_1',
    brand_id: 'brand_2',
    caption: 'Check out Sarah\'s incredible transformation journey! 🌟 Read her full story on our blog.',
    platform: 'facebook',
    status: 'posted',
    scheduled_at: '2025-10-28T12:00:00Z',
    posted_at: '2025-10-28T12:01:00Z',
    created_at: '2025-10-27T10:00:00Z',
  },
  {
    id: 'post_6',
    user_id: 'user_1',
    brand_id: 'brand_1',
    caption: 'Join us for our live webinar: "AI in the Modern Workplace" 🎓 Register now, limited spots available!',
    platform: 'linkedin',
    status: 'posted',
    scheduled_at: '2025-10-30T14:00:00Z',
    posted_at: '2025-10-30T14:00:00Z',
    created_at: '2025-10-28T11:00:00Z',
  },
];

export const mockTrends: Trend[] = [
  {
    id: 'trend_1',
    topic: 'AI Productivity Tools',
    volume: 125000,
    platform: 'Twitter',
    description: 'Discussion around AI-powered workplace automation and efficiency tools',
  },
  {
    id: 'trend_2',
    topic: 'Remote Work Culture',
    volume: 98000,
    platform: 'LinkedIn',
    description: 'Companies sharing remote work best practices and culture building',
  },
  {
    id: 'trend_3',
    topic: 'Wellness Wednesday',
    volume: 87000,
    platform: 'Instagram',
    description: 'Weekly wellness tips and mental health awareness',
  },
  {
    id: 'trend_4',
    topic: 'Tech Layoffs 2025',
    volume: 156000,
    platform: 'Twitter',
    description: 'Discussion about tech industry workforce changes',
  },
  {
    id: 'trend_5',
    topic: 'Sustainable Business',
    volume: 72000,
    platform: 'LinkedIn',
    description: 'Companies showcasing environmental initiatives and sustainable practices',
  },
];

export const mockAnalytics: { [postId: string]: Analytics } = {
  post_5: {
    post_id: 'post_5',
    likes: 342,
    comments: 28,
    shares: 45,
    reach: 8920,
    engagement_rate: 4.65,
  },
  post_6: {
    post_id: 'post_6',
    likes: 891,
    comments: 67,
    shares: 124,
    reach: 15400,
    engagement_rate: 7.03,
  },
};
