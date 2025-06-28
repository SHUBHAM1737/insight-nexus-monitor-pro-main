
import React from 'react';
import { AlertTriangle, Bell, Target, TrendingUp, Download } from 'lucide-react';

interface Alert {
  id: string;
  type: 'opportunity' | 'threat' | 'trend';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onGenerateReport: () => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onGenerateReport }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Target className="w-4 h-4 text-green-600" />;
      case 'threat': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'trend': return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
          Smart Alerts
        </h3>
        <button
          onClick={onGenerateReport}
          className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg transition-colors flex items-center space-x-1"
        >
          <Download className="w-3 h-3" />
          <span>Report</span>
        </button>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
        {alerts.map((alert) => (
          <div key={alert.id} className="bg-slate-700/50 rounded-lg p-3 border border-slate-600 hover:border-slate-500 transition-colors">
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-sm truncate">{alert.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(alert.priority)}`}>
                    {alert.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-2">{alert.description}</p>
                <span className="text-xs text-slate-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-slate-400 flex-1 flex flex-col justify-center">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No alerts yet</p>
            <p className="text-xs">Alerts will appear as patterns are detected</p>
          </div>
        )}
      </div>
    </div>
  );
};
