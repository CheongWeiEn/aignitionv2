import { useState } from 'react';
import { CheckCircle, XCircle, Clock, CheckCheck, Send } from 'lucide-react';
import { Post, PostStatus } from '../../types';

interface QueueViewProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  selectedBrandId?: string;
}

export function QueueView({ posts: externalPosts, setPosts, selectedBrandId }: QueueViewProps) {
  const [filter, setFilter] = useState<PostStatus | 'all'>('all');

  // Filter posts by selected brand
  const brandPosts = selectedBrandId
    ? externalPosts.filter(post => post.brand_id === selectedBrandId)
    : externalPosts;

  const filteredPosts = filter === 'all'
    ? brandPosts
    : brandPosts.filter(post => post.status === filter);

  const getStatusBadge = (status: PostStatus) => {
    const badges = {
      draft: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-700 dark:text-slate-300', icon: Clock },
      approved: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: CheckCheck },
      scheduled: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', icon: Clock },
      posted: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', icon: Send },
      declined: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', icon: XCircle },
    };
    const badge = badges[status];
    const Icon = badge.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleApprove = async (postId: string) => {
    const updatedPosts = externalPosts.map(p => p.id === postId ? { ...p, status: 'approved' } : p);
    setPosts(updatedPosts);
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts));

    const post = updatedPosts.find(p => p.id === postId);
    if (!post) return;

    try {
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_APPROVE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, status: 'approved' }),
      });
      if (!res.ok) console.error("n8n webhook returned error:", res.status);
      else console.log("✅ n8n webhook response:", await res.json());
    } catch (err) {
      console.error("❌ Failed to contact n8n webhook:", err);
    }
  };

  const handleDecline = (postId: string) => {
    const updatedPosts = externalPosts.map(p => p.id === postId ? { ...p, status: 'declined' } : p);
    setPosts(updatedPosts);
    localStorage.setItem("userPosts", JSON.stringify(updatedPosts));
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Content Queue</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Review and manage your content pipeline</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {['all', 'draft', 'approved', 'scheduled', 'posted', 'declined'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as PostStatus | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === status
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center transition-colors shadow-sm">
            <p className="text-slate-600 dark:text-slate-400">No posts found for this filter</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(post.status)}
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase">
                      {post.platform.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white leading-relaxed">{post.caption}</p>
                </div>
              </div>

              {post.scheduled_at && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Scheduled for: {new Date(post.scheduled_at).toLocaleString()}
                </p>
              )}

              {post.status === 'draft' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleDecline(post.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
