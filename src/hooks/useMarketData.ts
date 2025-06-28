import { useState, useCallback } from 'react';
import { generateProfessionalPDFReport } from '../utils/reportGenerator';

interface LogEntry {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface MonitoringData {
  trends: any[];
  competitors: any[];
  sentiment: any[];
  alerts: any[];
  reports: any[];
}

export const useMarketData = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    trends: [],
    competitors: [],
    sentiment: [],
    alerts: [],
    reports: []
  });
  
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((type: LogEntry['type'], message: string) => {
    const log = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toISOString()
    };
    setLogs(prev => [log, ...prev.slice(0, 49)]); // Keep last 50 logs
  }, []);

  const updateMonitoringData = useCallback((dataType: keyof MonitoringData, newData: any[]) => {
    setMonitoringData(prev => ({
      ...prev,
      [dataType]: [...newData, ...prev[dataType]].slice(0, 25)
    }));
  }, []);

  const generateReport = useCallback((activeIndustry: string, industries: any[]) => {
    const currentData = monitoringData;
    const industry = industries.find(i => i.id === activeIndustry);
    
    // Calculate key metrics
    const totalTrends = currentData.trends.length;
    const positiveTrends = currentData.trends.filter((t: any) => t.sentiment === 'positive').length;
    const highImpactCompetitors = currentData.competitors.filter((c: any) => c.impact === 'High').length;
    const criticalAlerts = currentData.alerts.filter((a: any) => a.priority === 'high').length;
    
    // Generate insights
    const topTrends = currentData.trends
      .sort((a: any, b: any) => {
        const aGrowth = parseInt(a.growth?.replace(/[^\d]/g, '')) || 0;
        const bGrowth = parseInt(b.growth?.replace(/[^\d]/g, '')) || 0;
        return bGrowth - aGrowth;
      })
      .slice(0, 5);

    const keyCompetitorMoves = currentData.competitors
      .filter((c: any) => c.impact === 'High')
      .slice(0, 3);

    const report = {
      id: Date.now(),
      industry: activeIndustry,
      industryName: industry?.name || activeIndustry,
      generatedAt: new Date().toISOString(),
      period: 'Weekly Analysis',
      summary: {
        trendsFound: totalTrends,
        positiveTrends: positiveTrends,
        competitorUpdates: currentData.competitors.length,
        highImpactMoves: highImpactCompetitors,
        alertsRaised: currentData.alerts.length,
        criticalAlerts: criticalAlerts,
        sentimentAnalyzed: currentData.sentiment?.length || 0
      },
      topTrends: topTrends.map((trend: any) => ({
        keyword: trend.keyword,
        growth: trend.growth,
        sentiment: trend.sentiment,
        source: trend.source
      })),
      keyCompetitorMoves: keyCompetitorMoves.map((move: any) => ({
        company: move.name,
        action: move.action,
        details: move.details,
        impact: move.impact
      })),
      marketSentiment: currentData.sentiment ? {
        positive: currentData.sentiment.filter((s: any) => s.sentiment === 'positive').length,
        negative: currentData.sentiment.filter((s: any) => s.sentiment === 'negative').length,
        neutral: currentData.sentiment.filter((s: any) => s.sentiment === 'neutral').length
      } : { positive: 0, negative: 0, neutral: 0 },
      recommendations: generateRecommendations(currentData),
      riskFactors: identifyRiskFactors(currentData),
      opportunities: identifyOpportunities(currentData)
    };

    setMonitoringData(prev => ({
      ...prev,
      reports: [report, ...prev.reports].slice(0, 10)
    }));
    
    // Generate and download professional PDF report
    generateProfessionalPDFReport(report);

    return report;
  }, [monitoringData]);

  // Generate strategic recommendations
  const generateRecommendations = (data: MonitoringData) => {
    const recommendations = [];
    
    // Trend-based recommendations
    const highGrowthTrends = data.trends.filter((t: any) => {
      const growth = parseInt(t.growth?.replace(/[^\d]/g, '')) || 0;
      return growth > 35;
    });
    
    if (highGrowthTrends.length > 0) {
      recommendations.push({
        type: 'strategic',
        priority: 'high',
        title: 'Capitalize on High-Growth Trends',
        description: `Consider investing in ${highGrowthTrends[0].keyword} (${highGrowthTrends[0].growth} growth)`
      });
    }

    // Competitor-based recommendations
    const majorMoves = data.competitors.filter((c: any) => c.impact === 'High');
    if (majorMoves.length > 0) {
      recommendations.push({
        type: 'competitive',
        priority: 'high',
        title: 'Respond to Competitor Actions',
        description: `Monitor ${majorMoves[0].name}'s ${majorMoves[0].action} strategy closely`
      });
    }

    return recommendations;
  };

  // Identify risk factors
  const identifyRiskFactors = (data: MonitoringData) => {
    const risks = [];
    
    // High competitor activity
    const highImpactMoves = data.competitors.filter((c: any) => c.impact === 'High').length;
    if (highImpactMoves > 2) {
      risks.push({
        factor: 'Increased Competition',
        severity: 'high',
        description: `${highImpactMoves} major competitor moves detected`
      });
    }

    return risks;
  };

  // Identify opportunities
  const identifyOpportunities = (data: MonitoringData) => {
    const opportunities: any[] = [];
    
    // High-growth trends with low competition
    const emergingTrends = data.trends.filter((t: any) => {
      const growth = parseInt(t.growth?.replace(/[^\d]/g, '')) || 0;
      return growth > 30 && t.sentiment === 'positive';
    });

    emergingTrends.forEach((trend: any) => {
      opportunities.push({
        area: trend.keyword,
        potential: 'high',
        description: `${trend.growth} growth with positive sentiment`,
        source: trend.source
      });
    });

    return opportunities;
  };

  // Download report as JSON
  const downloadReport = (report: any) => {
    const dataStr = JSON.stringify(report, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `market-intelligence-${report.industry}-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return {
    monitoringData,
    logs,
    addLog,
    updateMonitoringData,
    generateReport
  };
};
