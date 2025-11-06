import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Brand, Post } from '../types';

interface AppContextType {
  brands: Brand[];
  selectedBrandId: string | null;
  setSelectedBrandId: (id: string | null) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  updatePost: (id: string, updates: Partial<Post>) => void;
  deletePost: (id: string) => void;
  approvePost: (id: string, scheduledAt: string) => void;
  declinePost: (id: string) => void;
  addBrand: (brand: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  loadUserData: (userId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (post: Post) => setPosts(prev => [...prev, post]);
  const updatePost = (id: string, updates: Partial<Post>) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  const approvePost = (id: string, scheduledAt: string) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', scheduled_at: scheduledAt } : p));
  const declinePost = (id: string) =>
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'declined' } : p));
    
  const addBrand = async (brand: Brand) => {
    // 1️⃣ Immediately update UI
    setBrands(prev => {
      const updated = [...prev, brand];
      localStorage.setItem('userBrands', JSON.stringify(updated));
      return updated;
    });
  
    // 2️⃣ Send new brand data to n8n webhook
    try {
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_BRAND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: brand.id,
          user_id: brand.user_id,
          name: brand.name,
          product_description: brand.product_description,
          brand_voice: brand.brand_voice,
        }),
      });
  
      if (!res.ok) {
        console.error('❌ n8n webhook returned error:', res.status);
        alert('Failed to save brand to database.');
        return;
      }
  
      const data = await res.json();
      console.log('✅ Brand successfully sent to n8n:', data);
  
    } catch (err) {
      console.error('❌ Failed to contact n8n webhook:', err);
    }
  };
  
  const updateBrand = (id: string, updates: Partial<Brand>) =>
    setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

  // Load posts & brands from webhook
  const loadUserData = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_URL_FETCH_USER_DATA}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
  
      if (!res.ok) throw new Error(`Failed to load user data (${res.status})`);
      const data = await res.json();
      console.log('✅ Loaded user data:', data);
  
      // ✅ Extract first element
      const payload = data[0] || { posts: [], brands: [] };
  
      setPosts(payload.posts);
      setBrands(payload.brands);
      setSelectedBrandId(payload.brands[0]?.id || null);
  
    } catch (err) {
      console.error('❌ Failed to load user data:', err);
    }
  };
  
  

  // Load saved data from localStorage on mount (optional fallback)
  useEffect(() => {
    const savedPosts = localStorage.getItem('userPosts');
    const savedBrands = localStorage.getItem('userBrands');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedBrands) {
      const brandsData: Brand[] = JSON.parse(savedBrands);
      setBrands(brandsData);
      setSelectedBrandId(brandsData[0]?.id || null);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      brands,
      selectedBrandId,
      setSelectedBrandId,
      posts,
      addPost,
      updatePost,
      deletePost,
      approvePost,
      declinePost,
      addBrand,
      updateBrand,
      loadUserData,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
