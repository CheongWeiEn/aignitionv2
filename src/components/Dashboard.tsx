import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CalendarView } from './views/CalendarView';
import { CreatePostView } from './views/CreatePostView';
import { QueueView } from './views/QueueView';
import { TrendsView } from './views/TrendsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';
import { mockPosts, mockBrands } from '../utils/mockData';
import { Post, Brand } from '../types';

export function Dashboard() {
  const [currentView, setCurrentView] = useState('calendar');

  const [posts, setPosts] = useState<Post[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Called when a new post is created
  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => {
      const updated = [...prev, newPost];
      localStorage.setItem("userPosts", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    // Load real user data from localStorage
    const storedPosts = localStorage.getItem("userPosts");
    const storedBrands = localStorage.getItem("userBrands");

    if (storedPosts && storedBrands) {
      const parsedPosts: Post[] = JSON.parse(storedPosts);
      const parsedBrands: Brand[] = JSON.parse(storedBrands);

      if (parsedPosts.length > 0 || parsedBrands.length > 0) {
        setPosts(parsedPosts);
        setBrands(parsedBrands);
        return;
      }
    }

    // Fallback to mock data
    setPosts(mockPosts);
    setBrands(mockBrands);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView posts={posts} brands={brands} />;
      case 'create':
        return <CreatePostView brands={brands} onPostCreated={handlePostCreated} />;
      case 'queue':
        return <QueueView posts={posts} setPosts={setPosts} />;
      case 'trends':
        return <TrendsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CalendarView posts={posts} brands={brands} />;
    }
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
}
