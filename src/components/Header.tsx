import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const { brands, selectedBrandId, setSelectedBrandId } = useApp();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 transition-colors">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Brand:</label>
        <select
          value={selectedBrandId || ''}
          onChange={(e) => setSelectedBrandId(e.target.value)}
          className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          {brands.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.name}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400">{user?.email}</p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
