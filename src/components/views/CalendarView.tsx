import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function CalendarView() {
  const { posts, selectedBrandId } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);

  const brandPosts = posts.filter(post =>
    post.brand_id === selectedBrandId &&
    (post.status === 'approved' || post.status === 'scheduled' || post.status === 'posted')
  );

  const events = brandPosts.map(post => ({
    id: post.id,
    title: post.caption.substring(0, 50) + '...',
    start: post.scheduled_at || post.posted_at,
    backgroundColor: post.status === 'posted' ? '#10b981' : '#3b82f6',
    borderColor: post.status === 'posted' ? '#10b981' : '#3b82f6',
    extendedProps: {
      platform: post.platform,
      status: post.status,
    }
  }));

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
  
    try {
      // Prepare data for n8n
      const payload = {
        brandId: selectedBrandId,
        totalPosts: brandPosts.length,
        posts: brandPosts.map(p => ({
          id: p.id,
          caption: p.caption,
          platform: p.platform,
          status: p.status,
          scheduled_at: p.scheduled_at,
          posted_at: p.posted_at,
        })),
      };
  
      // Send to n8n
      const res = await fetch(import.meta.env.VITE_N8N_WEBHOOK_URL_PLAN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        console.error("n8n webhook returned error:", res.status);
        alert("❌ Failed to contact n8n workflow.");
        return;
      }
  
      const data = await res.json();
      console.log("✅ n8n response:", data);
  
      // Optional: show reply message or take further action
      alert(data.reply || "✅ Plan generated successfully via n8n!");
  
    } catch (err) {
      console.error("Error calling n8n:", err);
      alert("❌ Error contacting n8n workflow.");
    } finally {
      setIsGenerating(false);
    }
  };
  

  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">Content Calendar</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">View and manage your scheduled posts</p>
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="flex-shrink-0 flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="hidden sm:inline">Generating...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Generate Timeline</span>
              <span className="sm:hidden">Generate</span>
            </>
          )}
        </button>
      </div>

      <div className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden transition-colors">
        <div className="h-full p-4 sm:p-6">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek'
            }}
            height="100%"
            eventClick={(info) => {
              alert(`Post: ${info.event.title}\nPlatform: ${info.event.extendedProps.platform}\nStatus: ${info.event.extendedProps.status}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
