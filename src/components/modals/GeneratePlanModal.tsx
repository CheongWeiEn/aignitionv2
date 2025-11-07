import { useState } from "react";
import { X, Upload, Sparkles } from "lucide-react";

export default function GenerateWithAI({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const platformOptions = [
    { label: "Instagram", value: "instagram" },
    { label: "Facebook", value: "facebook" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "TikTok", value: "tiktok" },
  ];

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrandId || !user) return;
  
    setIsGenerating(true);
  
    try {
      // prepare form data (for file upload)
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("brand", selectedBrand?.name || "");
      formData.append("brandId", selectedBrandId);
      formData.append("user_id", user.id);
      formData.append("user_name", user.name);
      formData.append("user_email", user.email);
      platforms.forEach((p) => formData.append("platforms[]", p));
      if (imageFile) formData.append("image", imageFile);
  
      // call your n8n webhook
      const response = await fetch("https://hongyiii.app.n8n.cloud/webhook/generate-post", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to generate post");
  
      const result = await response.json();
  
      // Use AI-generated caption and image
      const aiCaption = result?.data?.caption || "";
      const aiImage = result?.data?.image_url || "";
  
      // Redirect user to Create Post page with AI-generated content
      window.location.href = `/create?brand=${selectedBrandId}&caption=${encodeURIComponent(aiCaption)}&image=${encodeURIComponent(aiImage)}`;
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 z-10">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Generate with AI
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Prompt Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Content Goal
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
              rows={4}
              placeholder="Describe what you want to achieve..."
              required
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 gap-3">
              {platformOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => togglePlatform(option.value)}
                  className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                    platforms.includes(option.value)
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {platforms.length > 0 && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                {platforms.length} platform
                {platforms.length !== 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Upload Image
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
                  {imageFile ? imageFile.name : "Click to upload or drag and drop"}
                </p>
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="mt-3 max-h-40 mx-auto rounded-lg object-cover"
                  />
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Images will be automatically optimized for each platform
                </p>
              </label>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>AI Magic:</strong> Our workflow will use your brand voice and
              uploaded image to generate optimized captions and visuals.
            </p>
          </div>

          {/* Actions */}
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
