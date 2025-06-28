
import React from 'react';
import { TrendingUp } from 'lucide-react';

interface Trend {
  id: string;
  keyword: string;
  growth: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  timestamp: string;
  source: string;
  url?: string;
  content?: string;
}

interface TrendsPanelProps {
  trends: Trend[];
}

export const TrendsPanel: React.FC<TrendsPanelProps> = ({ trends }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-400';
      case 'negative': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Market Trends
        </h3>
        <span className="text-sm text-slate-400">{trends.length} trends</span>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {trends.map((trend, index) => (
          <div key={trend.id || index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm truncate">{trend.keyword}</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-green-600 px-2 py-1 rounded">{trend.growth}</span>
                <div className={`w-2 h-2 rounded-full ${getSentimentColor(trend.sentiment)}`}></div>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-1">
              Source: {trend.url ? (
                <a 
                  href={trend.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  {trend.source}
                </a>
              ) : (
                trend.source
              )}
            </p>
            {trend.content && (
              <p className="text-xs text-slate-300 truncate">{trend.content}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-slate-500">
                {new Date(trend.timestamp).toLocaleString()}
              </span>
              {trend.url && (
                <a 
                  href={trend.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View Source
                </a>
              )}
            </div>
          </div>
        ))}
        
        {trends.length === 0 && (
          <div className="text-center py-8 text-slate-400 flex-1 flex flex-col justify-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No trends detected yet</p>
            <p className="text-xs">Start monitoring to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};
