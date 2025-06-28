
import React from 'react';
import { TrendingUp, Users, AlertTriangle, BarChart3 } from 'lucide-react';

interface StatusCardsProps {
  data: {
    trends: any[];
    competitors: any[];
    alerts: any[];
    reports: any[];
  };
}

export const StatusCards: React.FC<StatusCardsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Active Trends</p>
            <p className="text-2xl font-bold text-green-400">{data.trends.length}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-green-400" />
        </div>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Competitor Updates</p>
            <p className="text-2xl font-bold text-blue-400">{data.competitors.length}</p>
          </div>
          <Users className="w-8 h-8 text-blue-400" />
        </div>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Active Alerts</p>
            <p className="text-2xl font-bold text-red-400">{data.alerts.length}</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
      </div>
      
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Reports Generated</p>
            <p className="text-2xl font-bold text-purple-400">{data.reports.length}</p>
          </div>
          <BarChart3 className="w-8 h-8 text-purple-400" />
        </div>
      </div>
    </div>
  );
};
