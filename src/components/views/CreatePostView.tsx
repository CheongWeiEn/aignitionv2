import { useState } from 'react';
import { Sparkles, Edit3, Upload, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Platform, Post } from '../../types';

export function CreatePostView() {
  const { selectedBrandId, addPost, brands } = useApp();
  const { user } = useAuth();
  const [mode, setMode] = useState<'generate' | 'custom'>('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [generatePrompt, setGeneratePrompt] = useState('');
  const [generatePlatform, setGeneratePlatform] = useState<Platform>('linkedin');

  const [customCaption, setCustomCaption] = useState('');
  const [customPlatform, setCustomPlatform] = useState<Platform>('linkedin');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  const platformOptions: { value: Platform; label: string }[] = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram_feed', label: 'Instagram Feed' },
    { value: 'instagram_story', label: 'Instagram Story' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId || !user) return;

    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const aiGeneratedCaption = `🚀 ${generatePrompt} - ${selectedBrand?.name} is leading the way with innovative solutions. Join us on this exciting journey! #Innovation #${selectedBrand?.name}`;

    setMode('custom');
    setCustomCaption(aiGeneratedCaption);
    setCustomPlatform(generatePlatform);

    setIsGenerating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId || !user) return;

    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const scheduledAt = scheduledDate && scheduledTime
      ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
      : undefined;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      user_id: user.id,
      brand_id: selectedBrandId,
      caption: customCaption,
      platform: customPlatform,
      status: scheduledAt ? 'approved' : 'draft',
      scheduled_at: scheduledAt,
      created_at: new Date().toISOString(),
    };

    addPost(newPost);

    setCustomCaption('');
    setScheduledDate('');
    setScheduledTime('');
    setImageFile(null);
    setGeneratePrompt('');
    setMode('generate');

    setIsSubmitting(false);
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create Post</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Generate AI-powered content or create your own custom post
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode('generate')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            mode === 'generate'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline">Generate with AI</span>
          <span className="sm:hidden">Generate</span>
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
            mode === 'custom'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Custom Post</span>
          <span className="sm:hidden">Custom</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {mode === 'generate' ? (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
            <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What do you want to post about?
              </label>
              <textarea
                value={generatePrompt}
                onChange={(e) => setGeneratePrompt(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
                rows={4}
                placeholder="E.g., 'Announce our new product feature' or 'Share a productivity tip' or 'Celebrate team milestone'"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Select Platform
              </label>
              <select
                value={generatePlatform}
                onChange={(e) => setGeneratePlatform(e.target.value as Platform)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              >
                {platformOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>AI Magic:</strong> Our social media expert will craft the perfect post using your brand voice and platform best practices. You can edit it before posting!
              </p>
            </div>

              <button
                type="submit"
                disabled={!generatePrompt || isGenerating}
                className="w-full flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Post
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Caption
              </label>
              <textarea
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
                rows={6}
                placeholder="Write your post caption here..."
                required
              />
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {customCaption.length} characters
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Platform
              </label>
              <select
                value={customPlatform}
                onChange={(e) => setCustomPlatform(e.target.value as Platform)}
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
                  Schedule Date (Optional)
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
              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  Will auto-post on: {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
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
                  id="create-post-image-upload"
                />
                <label htmlFor="create-post-image-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Image will be optimized for {customPlatform.replace('_', ' ')}
                  </p>
                </label>
              </div>
            </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={!customCaption || isSubmitting}
                  className="flex-1 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {scheduledDate && scheduledTime ? 'Scheduling...' : 'Saving...'}
                    </div>
                  ) : (
                    scheduledDate && scheduledTime ? 'Schedule & Auto-Post' : 'Save as Draft'
                  )}
                </button>
                {mode === 'custom' && generatePrompt && (
                  <button
                    type="button"
                    onClick={() => setMode('generate')}
                    className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
                  >
                    Back
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
