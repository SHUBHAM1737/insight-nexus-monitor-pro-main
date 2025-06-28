
import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, AlertTriangle, BarChart3, Eye, Settings, Play, Pause, Download, Bell, Calendar, Users, DollarSign, Target, Zap } from 'lucide-react';
import { ConfigurationModal } from './ConfigurationModal';
import { StatusCards } from './StatusCards';
import { TrendsPanel } from './TrendsPanel';
import { CompetitorPanel } from './CompetitorPanel';
import { AlertsPanel } from './AlertsPanel';
import { IndustrySelector } from './IndustrySelector';
import { useTavilySearch } from '../hooks/useTavilySearch';
import { useMarketData } from '../hooks/useMarketData';
import { useToast } from '../hooks/use-toast';

export const MarketResearchAgent = () => {
  const [apiKey, setApiKey] = useState('0x12121212121212');
  const [isRunning, setIsRunning] = useState(false);
  const [activeIndustry, setActiveIndustry] = useState('technology');
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [searchInterval, setSearchInterval] = useState(300); // 5 minutes
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();
  const { searchWithTavily } = useTavilySearch(apiKey);
  const { monitoringData, logs, addLog, updateMonitoringData, generateReport } = useMarketData();

  const industries = [
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥' },
    { id: 'fintech', name: 'FinTech', icon: '💰' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
    { id: 'automotive', name: 'Automotive', icon: '🚗' },
    { id: 'real-estate', name: 'Real Estate', icon: '🏠' }
  ];

  const runMarketResearch = async () => {
    if (!apiKey) {
      addLog('error', 'Please configure Tavily API key first');
      toast({
        title: "Configuration Required",
        description: "Please configure your Tavily API key first",
        variant: "destructive"
      });
      return;
    }

    addLog('info', `Starting comprehensive market research for ${activeIndustry} industry`);

    try {
      // 1. Search for industry trends
      const trendsQuery = `${activeIndustry} industry trends 2024 2025 emerging technologies innovation`;
      const trendsResult = await searchWithTavily(trendsQuery, 'trends');
      
      if (trendsResult?.success && trendsResult.data) {
        updateMonitoringData('trends', trendsResult.data);
        addLog('success', `Found ${trendsResult.data.length} new market trends`);
      }

      // 2. Search for competitor activities
      const competitorQuery = `${activeIndustry} companies product launches partnerships acquisitions 2024 2025`;
      const competitorResult = await searchWithTavily(competitorQuery, 'competitors');
      
      if (competitorResult?.success && competitorResult.data) {
        updateMonitoringData('competitors', competitorResult.data);
        addLog('success', `Found ${competitorResult.data.length} competitor updates`);
      }

      // 3. Search for market sentiment
      const sentimentQuery = `${activeIndustry} market sentiment customer satisfaction reviews 2024`;
      const sentimentResult = await searchWithTavily(sentimentQuery, 'sentiment');
      
      if (sentimentResult?.success && sentimentResult.data) {
        updateMonitoringData('sentiment', sentimentResult.data);
        addLog('success', `Analyzed ${sentimentResult.data.length} sentiment indicators`);
      }

      // 4. Generate intelligent alerts
      const alerts = generateIntelligentAlerts(trendsResult?.data, competitorResult?.data, sentimentResult?.data);
      
      if (alerts.length > 0) {
        updateMonitoringData('alerts', alerts);
        addLog('info', `Generated ${alerts.length} intelligent alerts`);
      }

      toast({
        title: "Research Complete",
        description: `Market research cycle completed for ${activeIndustry}`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      addLog('error', `Research failed: ${errorMessage}`);
      toast({
        title: "Research Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const generateIntelligentAlerts = (trendsData?: any[], competitorData?: any[], sentimentData?: any[]) => {
    const alerts = [];
    const now = new Date().toISOString();

    // Trend-based alerts
    if (trendsData && trendsData.length > 0) {
      const highGrowthTrends = trendsData.filter(trend => {
        const growth = parseInt(trend.growth?.replace(/[^\d]/g, '')) || 0;
        return growth > 40;
      });

      if (highGrowthTrends.length > 0) {
        alerts.push({
          id: `alert_trend_${Date.now()}`,
          type: 'opportunity',
          title: 'High-Growth Trend Detected',
          description: `${highGrowthTrends[0].keyword} showing ${highGrowthTrends[0].growth} growth - potential market opportunity`,
          priority: 'high',
          timestamp: now,
          source: 'Trend Analysis',
          actionable: true,
          data: highGrowthTrends[0]
        });
      }
    }

    // Competitor-based alerts
    if (competitorData && competitorData.length > 0) {
      const highImpactMoves = competitorData.filter(comp => comp.impact === 'High');
      
      if (highImpactMoves.length > 0) {
        alerts.push({
          id: `alert_competitor_${Date.now()}`,
          type: 'threat',
          title: 'Major Competitor Move',
          description: `${highImpactMoves[0].name} - ${highImpactMoves[0].action}: ${highImpactMoves[0].details}`,
          priority: 'high',
          timestamp: now,
          source: 'Competitor Intelligence',
          actionable: true,
          data: highImpactMoves[0]
        });
      }
    }

    return alerts;
  };

  const startMonitoring = () => {
    if (!apiKey) {
      addLog('error', 'Please configure Tavily API key first');
      toast({
        title: "Configuration Required",
        description: "Please configure your Tavily API key first",
        variant: "destructive"
      });
      return;
    }

    setIsRunning(true);
    addLog('info', `Starting continuous monitoring (${searchInterval}s intervals)`);
    
    // Run initial search
    runMarketResearch();
    
    // Set up interval
    intervalRef.current = setInterval(() => {
      runMarketResearch();
    }, searchInterval * 1000);

    toast({
      title: "Monitoring Started",
      description: `Continuous monitoring activated for ${activeIndustry}`,
    });
  };

  const stopMonitoring = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    addLog('info', 'Monitoring stopped');
    
    toast({
      title: "Monitoring Stopped",
      description: "Market monitoring has been deactivated",
    });
  };

  const handleGenerateReport = () => {
    const report = generateReport(activeIndustry, industries);
    addLog('success', `Comprehensive market intelligence report generated for ${activeIndustry}`);
    
    toast({
      title: "Report Generated",
      description: "Market intelligence report has been generated and downloaded",
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Market Research Agent</h1>
                <p className="text-sm text-slate-400">Autonomous Intelligence for Market Insights</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <IndustrySelector
                industries={industries}
                activeIndustry={activeIndustry}
                onIndustryChange={setActiveIndustry}
              />
              
              <button
                onClick={() => setIsConfigOpen(true)}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              
              {!isRunning ? (
                <button
                  onClick={startMonitoring}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Monitoring</span>
                </button>
              ) : (
                <button
                  onClick={stopMonitoring}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Pause className="w-4 h-4" />
                  <span>Stop Monitoring</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        apiKey={apiKey}
        searchInterval={searchInterval}
        onApiKeyChange={setApiKey}
        onIntervalChange={setSearchInterval}
      />

      <div className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full">
        {/* Status Cards */}
        <StatusCards data={monitoringData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 h-[calc(100vh-320px)]">
          {/* Trends Panel - Expanded */}
          <div className="h-full">
            <TrendsPanel trends={monitoringData.trends} />
          </div>

          {/* Competitor Analysis - Expanded */}
          <div className="h-full">
            <CompetitorPanel competitors={monitoringData.competitors} />
          </div>

          {/* Alerts Panel - Expanded */}
          <div className="h-full">
            <AlertsPanel 
              alerts={monitoringData.alerts} 
              onGenerateReport={handleGenerateReport}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
