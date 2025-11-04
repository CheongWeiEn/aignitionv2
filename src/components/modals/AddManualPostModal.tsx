import { useState } from 'react';
import { X, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Platform, Post } from '../../types';

interface AddManualPostModalProps {
  onClose: () => void;
}

export function AddManualPostModal({ onClose }: AddManualPostModalProps) {
  const { selectedBrandId, addPost } = useApp();
  const { user } = useAuth();
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const platformOptions: { value: Platform; label: string }[] = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram_feed', label: 'Instagram Feed' },
    { value: 'instagram_story', label: 'Instagram Story' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId || !user) return;

    const scheduledAt = scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      : undefined;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      user_id: user.id,
      brand_id: selectedBrandId,
      caption,
      platform,
      status: scheduledAt ? 'approved' : 'draft',
      scheduled_at: scheduledAt,
      created_at: new Date().toISOString(),
    };

    addPost(newPost);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Add Manual Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              rows={6}
              placeholder="Write your post caption here..."
              required
            />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {caption.length} characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
            >
              {platformOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Schedule Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Schedule Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              />
            </div>
          </div>

          {scheduledDate && scheduledTime && (
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <CalendarIcon className="w-4 h-4" />
              <span>
                Scheduled for: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
              </span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Upload Image (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
                id="manual-image-upload"
              />
              <label htmlFor="manual-image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Image will be optimized for {platform.replace('_', ' ')}
                </p>
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {scheduledDate && scheduledTime ? 'Schedule Post' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
