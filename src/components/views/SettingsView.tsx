import { useState } from 'react';
import { Plus, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { Brand } from '../../types';

export function SettingsView() {
  const { brands, addBrand, updateBrand } = useApp();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    product_description: '',
    brand_voice: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      updateBrand(editingId, formData);
      setEditingId(null);
    } else {
      const newBrand: Brand = {
        id: `brand_${Date.now()}`,
        user_id: user!.id,
        ...formData,
        created_at: new Date().toISOString(),
      };
      addBrand(newBrand);
      setIsCreating(false);
    }

    setFormData({ name: '', product_description: '', brand_voice: '' });
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setFormData({
      name: brand.name,
      product_description: brand.product_description,
      brand_voice: brand.brand_voice,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({ name: '', product_description: '', brand_voice: '' });
  };

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Brand Settings</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Manage your brand profiles and voice</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Brand</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6 transition-colors">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {editingId ? 'Edit Brand' : 'Create New Brand'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Brand Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
                placeholder="e.g., TechCo"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Product Description
              </label>
              <textarea
                value={formData.product_description}
                onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
                rows={3}
                placeholder="Describe your product or service..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Brand Voice & Tone
              </label>
              <textarea
                value={formData.brand_voice}
                onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white transition-colors"
                rows={4}
                placeholder="Describe your brand's personality, communication style, and tone..."
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Save Changes' : 'Create Brand'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {brands.map(brand => (
          <div key={brand.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{brand.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Created {new Date(brand.created_at).toLocaleDateString()}
                </p>
              </div>
              {editingId !== brand.id && (
                <button
                  onClick={() => handleEdit(brand)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg font-medium transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Description</p>
                <p className="text-slate-600 dark:text-slate-400">{brand.product_description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand Voice</p>
                <p className="text-slate-600 dark:text-slate-400">{brand.brand_voice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
