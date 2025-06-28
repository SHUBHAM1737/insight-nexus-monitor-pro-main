
import React from 'react';
import { Zap } from 'lucide-react';

interface LogEntry {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface ActivityLogProps {
  logs: LogEntry[];
  isRunning: boolean;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs, isRunning }) => {
  const getLogTypeStyle = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-900/50 text-red-300';
      case 'success': return 'bg-green-900/50 text-green-300';
      case 'warning': return 'bg-yellow-900/50 text-yellow-300';
      default: return 'bg-blue-900/50 text-blue-300';
    }
  };

  return (
    <div className="mt-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          Agent Activity Log
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className="text-sm text-slate-400">{isRunning ? 'Running' : 'Stopped'}</span>
        </div>
      </div>
      
      <div className="bg-slate-900/50 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center space-x-3 py-1">
            <span className="text-slate-500">
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
            <span className={`px-2 py-1 rounded text-xs ${getLogTypeStyle(log.type)}`}>
              {log.type.toUpperCase()}
            </span>
            <span className="text-slate-300">{log.message}</span>
          </div>
        ))}
        
        {logs.length === 0 && (
          <div className="text-center py-4 text-slate-500">
            No activity yet. Start monitoring to see agent logs.
          </div>
        )}
      </div>
    </div>
  );
};
