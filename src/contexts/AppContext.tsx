import { createContext, useContext, useState, ReactNode } from 'react';
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [brands, setBrands] = useState<Brand[]>(mockBrands);
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(mockBrands[0]?.id || null);
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const addPost = (post: Post) => {
    setPosts(prev => [...prev, post]);
  };

  const updatePost = (id: string, updates: Partial<Post>) => {
    setPosts(prev => prev.map(post => post.id === id ? { ...post, ...updates } : post));
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(post => post.id !== id));
  };

  const approvePost = (id: string, scheduledAt: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id ? { ...post, status: 'approved', scheduled_at: scheduledAt } : post
    ));
  };

  const declinePost = (id: string) => {
    setPosts(prev => prev.map(post =>
      post.id === id ? { ...post, status: 'declined' } : post
    ));
  };

  const addBrand = async (brand: Brand) => {
    try {
      // 1️⃣ Update local state / mockData
      setBrands(prev => [...prev, brand]);
      mockBrands.push(brand);
  
      // 2️⃣ Send the new brand to n8n
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_BRAND, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: brand.user_id,
          name: brand.name,
          product_description: brand.product_description,
          brand_voice: brand.brand_voice,
        }),
      });
  
      if (!res.ok) {
        console.error('n8n webhook returned error:', res.status);
        // Optionally: remove brand from state if n8n fails
      } else {
        const data = await res.json();
        console.log('✅ n8n brand webhook response:', data);
      }
    } catch (err) {
      console.error('❌ Failed to contact n8n webhook:', err);
    }
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands(prev => prev.map(brand => brand.id === id ? { ...brand, ...updates } : brand));
  };

  const loadUserData = async (userId: string) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_N8N_WEBHOOK_URL_USERDATA}?user_id=${userId}`);
      if (!res.ok) throw new Error(`Failed to load user data (${res.status})`);
  
      const data = await res.json();
      console.log("✅ Loaded user data:", data);
  
      if (data.brands?.length > 0) setBrands(data.brands);
      if (data.posts?.length > 0) setPosts(data.posts);
  
    } catch (err) {
      console.error("❌ Failed to load user data:", err);
      // Fallback to mock data
    }
  };
  
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
      addBrand,
      updateBrand,
      loadUserData, // 👈 add this
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
