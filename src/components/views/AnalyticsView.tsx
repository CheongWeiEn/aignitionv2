import { Heart, MessageCircle, Share2, Eye, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockAnalytics } from '../../utils/mockData';

export function AnalyticsView() {
  const { posts, selectedBrandId } = useApp();

  const postedPosts = posts.filter(
    post => post.brand_id === selectedBrandId && post.status === 'posted'
  );

  const totalLikes = Object.values(mockAnalytics).reduce((sum, a) => sum + a.likes, 0);
  const totalComments = Object.values(mockAnalytics).reduce((sum, a) => sum + a.comments, 0);
  const totalShares = Object.values(mockAnalytics).reduce((sum, a) => sum + a.shares, 0);
  const totalReach = Object.values(mockAnalytics).reduce((sum, a) => sum + a.reach, 0);
  const avgEngagement = Object.values(mockAnalytics).reduce((sum, a) => sum + a.engagement_rate, 0) / Object.values(mockAnalytics).length;

  const stats = [
    { label: 'Total Likes', value: totalLikes.toLocaleString(), icon: Heart, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
    { label: 'Total Comments', value: totalComments.toLocaleString(), icon: MessageCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Total Shares', value: totalShares.toLocaleString(), icon: Share2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    { label: 'Total Reach', value: totalReach.toLocaleString(), icon: Eye, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { label: 'Avg Engagement', value: `${avgEngagement.toFixed(2)}%`, icon: TrendingUp, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track your social media performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bg} mb-3`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Post Performance</h3>
        <div className="space-y-4">
          {postedPosts.map(post => {
            const analytics = mockAnalytics[post.id];
            if (!analytics) return null;

            return (
              <div key={post.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 transition-colors">
                <p className="text-slate-900 dark:text-white mb-3 line-clamp-2">{post.caption}</p>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded">
                    {post.platform.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>{new Date(post.posted_at!).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Likes</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{analytics.likes}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Comments</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{analytics.comments}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Shares</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{analytics.shares}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Reach</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{analytics.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Engagement</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{analytics.engagement_rate}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
