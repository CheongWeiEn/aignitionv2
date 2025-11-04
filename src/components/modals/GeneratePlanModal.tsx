import { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Platform, Post } from '../../types';

interface GeneratePlanModalProps {
  onClose: () => void;
}

export function GeneratePlanModal({ onClose }: GeneratePlanModalProps) {
  const { selectedBrandId, addPost, brands } = useApp();
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedBrand = brands.find(b => b.id === selectedBrandId);

  const platformOptions: { value: Platform; label: string }[] = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'instagram_feed', label: 'Instagram Feed' },
    { value: 'instagram_story', label: 'Instagram Story' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'facebook', label: 'Facebook' },
  ];

  const togglePlatform = (platform: Platform) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId || !user) return;

    setIsGenerating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const captions = [
      `🚀 ${prompt} - Exciting developments ahead for ${selectedBrand?.name}! Stay tuned for updates. #Innovation #Growth`,
      `✨ ${prompt} - We're pushing boundaries and redefining excellence. Join us on this journey! #Excellence #Vision`,
      `💡 ${prompt} - Transform your experience with our latest innovations. The future is here! #Future #Technology`,
    ];

    platforms.forEach((platform, index) => {
      const newPost: Post = {
        id: `post_${Date.now()}_${index}`,
        user_id: user.id,
        brand_id: selectedBrandId,
        caption: captions[index % captions.length],
        platform,
        status: 'draft',
        created_at: new Date().toISOString(),
      };
      addPost(newPost);
    });

    setIsGenerating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Generate Content Plan</h2>
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
              Content Goal
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              rows={4}
              placeholder="Describe what you want to achieve with this content... e.g., 'Promote our new product launch' or 'Build brand awareness around sustainability'"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {platformOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePlatform(option.value)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    platforms.includes(option.value)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {platforms.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {platforms.length} platform{platforms.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

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
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                  Images will be automatically optimized for each platform
                </p>
              </label>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>AI Magic:</strong> Our N8N workflow will use your brand voice from settings to generate platform-optimized captions and process images to the perfect dimensions.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!prompt || platforms.length === 0 || isGenerating}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Posts
                </>
              )}
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
