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

  const addBrand = (brand: Brand) => {
    setBrands(prev => [...prev, brand]);
  };

  const updateBrand = (id: string, updates: Partial<Brand>) => {
    setBrands(prev => prev.map(brand => brand.id === id ? { ...brand, ...updates } : brand));
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
      declinePost,
      addBrand,
      updateBrand,
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
