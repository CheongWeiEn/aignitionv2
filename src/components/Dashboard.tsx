import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { CalendarView } from './views/CalendarView';
import { CreatePostView } from './views/CreatePostView';
import { QueueView } from './views/QueueView';
import { TrendsView } from './views/TrendsView';
import { AnalyticsView } from './views/AnalyticsView';
import { SettingsView } from './views/SettingsView';

export function Dashboard() {
  const [currentView, setCurrentView] = useState('calendar');

  const renderView = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView />;
      case 'create':
        return <CreatePostView />;
      case 'queue':
        return <QueueView />;
      case 'trends':
        return <TrendsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CalendarView />;
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
