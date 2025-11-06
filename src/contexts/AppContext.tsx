import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Brand, Post } from '../types';
import { mockBrands, mockPosts } from '../utils/mockData';

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
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(mockBrands[0]?.id || null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = (post: Post) => setPosts(prev => [...prev, post]);
  const updatePost = (id: string, updates: Partial<Post>) => setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePost = (id: string) => setPosts(prev => prev.filter(p => p.id !== id));
  const approvePost = (id: string, scheduledAt: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'approved', scheduled_at: scheduledAt } : p));
  const declinePost = (id: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, status: 'declined' } : p));
  const addBrand = (brand: Brand) => setBrands(prev => [...prev, brand]);
  const updateBrand = (id: string, updates: Partial<Brand>) => setBrands(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));

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

      // Load posts & brands from n8n response
      if (data.posts?.length > 0) setPosts(data.posts);
      if (data.brands?.length > 0) {
        setBrands(data.brands);
        setSelectedBrandId(data.brands[0].id); // select first brand by default
      }
    } catch (err) {
      console.error('❌ Failed to load user data:', err);
    }
  };

  // On mount, optionally load brands/posts from localStorage
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
