import { TrendingUp, Activity } from 'lucide-react';
import { mockTrends } from '../../utils/mockData';

export function TrendsView() {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Trending Topics</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Stay ahead with current trends across platforms</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {mockTrends.map((trend, index) => (
          <div key={trend.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 transition-colors hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-bold text-sm">
                    #{index + 1}
                  </span>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{trend.topic}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-3">{trend.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Activity className="w-4 h-4" />
                    {trend.volume.toLocaleString()} mentions
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full font-medium">
                    {trend.platform}
                  </span>
                </div>
              </div>
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 transition-colors">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Pro Tip:</strong> These trends are updated in real-time through the N8N Trend Hunter workflow. Click on any trend to generate content ideas based on the topic.
        </p>
      </div>
    </div>
  );
}
