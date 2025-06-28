
import React from 'react';
import { Users } from 'lucide-react';

interface Competitor {
  name: string;
  action: string;
  details: string;
  impact: 'High' | 'Medium' | 'Low';
  timestamp: string;
  url?: string;
  source?: string;
}

interface CompetitorPanelProps {
  competitors: Competitor[];
}

export const CompetitorPanel: React.FC<CompetitorPanelProps> = ({ competitors }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2 text-blue-400" />
          Competitor Activity
        </h3>
        <span className="text-sm text-slate-400">{competitors.length} updates</span>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {competitors.map((competitor, index) => (
          <div key={index} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm truncate">{competitor.name}</h4>
              <span className={`text-xs px-2 py-1 rounded text-white ${getImpactColor(competitor.impact)}`}>
                {competitor.impact}
              </span>
            </div>
            <p className="text-xs text-slate-300 mb-2">{competitor.action}: {competitor.details}</p>
            {competitor.source && (
              <p className="text-xs text-slate-400 mb-1">
                Source: {competitor.url ? (
                  <a 
                    href={competitor.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 transition-colors underline"
                  >
                    {competitor.source}
                  </a>
                ) : (
                  competitor.source
                )}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                {new Date(competitor.timestamp).toLocaleString()}
              </span>
              {competitor.url && (
                <a 
                  href={competitor.url} 
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
        
        {competitors.length === 0 && (
          <div className="text-center py-8 text-slate-400 flex-1 flex flex-col justify-center">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No competitor updates yet</p>
            <p className="text-xs">Start monitoring to see results</p>
          </div>
        )}
      </div>
    </div>
  );
};
