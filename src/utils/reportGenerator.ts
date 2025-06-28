
import jsPDF from 'jspdf';

interface ReportData {
  id: number;
  industry: string;
  industryName: string;
  generatedAt: string;
  period: string;
  summary: {
    trendsFound: number;
    positiveTrends: number;
    competitorUpdates: number;
    highImpactMoves: number;
    alertsRaised: number;
    criticalAlerts: number;
    sentimentAnalyzed: number;
  };
  topTrends: any[];
  keyCompetitorMoves: any[];
  marketSentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  recommendations: any[];
  riskFactors: any[];
  opportunities: any[];
}

export const generateProfessionalPDFReport = (reportData: ReportData) => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let yPosition = 20;

  // Colors
  const primaryColor = '#1e40af';
  const secondaryColor = '#64748b';
  const accentColor = '#10b981';

  // Header Section
  pdf.setFontSize(24);
  pdf.setTextColor(primaryColor);
  pdf.text('MARKET INTELLIGENCE REPORT', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(secondaryColor);
  pdf.text(`${reportData.industryName} Industry Analysis`, pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.text(`Generated: ${new Date(reportData.generatedAt).toLocaleDateString()} | Period: ${reportData.period}`, pageWidth / 2, yPosition, { align: 'center' });

  // Add separator line
  yPosition += 15;
  pdf.setDrawColor(primaryColor);
  pdf.line(20, yPosition, pageWidth - 20, yPosition);
  yPosition += 20;

  // Executive Summary Section
  pdf.setFontSize(16);
  pdf.setTextColor(primaryColor);
  pdf.text('EXECUTIVE SUMMARY', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor('#000000');
  
  const summaryText = `This comprehensive market intelligence report provides strategic insights for the ${reportData.industryName} industry. Our analysis identified ${reportData.summary.trendsFound} market trends, monitored ${reportData.summary.competitorUpdates} competitor activities, and generated ${reportData.summary.alertsRaised} strategic alerts during the reporting period.`;
  
  const summaryLines = pdf.splitTextToSize(summaryText, pageWidth - 40);
  pdf.text(summaryLines, 20, yPosition);
  yPosition += summaryLines.length * 5 + 10;

  // Key Metrics Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('KEY PERFORMANCE INDICATORS', 20, yPosition);
  yPosition += 15;

  // Create metrics grid
  const metrics = [
    ['Market Trends Identified', reportData.summary.trendsFound.toString()],
    ['Positive Trend Signals', reportData.summary.positiveTrends.toString()],
    ['Competitor Activities', reportData.summary.competitorUpdates.toString()],
    ['High-Impact Moves', reportData.summary.highImpactMoves.toString()],
    ['Strategic Alerts', reportData.summary.alertsRaised.toString()],
    ['Critical Alerts', reportData.summary.criticalAlerts.toString()]
  ];

  pdf.setFontSize(10);
  metrics.forEach(([label, value], index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = 20 + (col * (pageWidth - 40) / 2);
    const y = yPosition + (row * 15);
    
    pdf.setTextColor('#000000');
    pdf.text(label + ':', x, y);
    pdf.setTextColor(accentColor);
    pdf.setFont(undefined, 'bold');
    pdf.text(value, x + 80, y);
    pdf.setFont(undefined, 'normal');
  });

  yPosition += Math.ceil(metrics.length / 2) * 15 + 20;

  // Check if we need a new page
  if (yPosition > pageHeight - 50) {
    pdf.addPage();
    yPosition = 20;
  }

  // Market Trends Section
  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('TOP MARKET TRENDS', 20, yPosition);
  yPosition += 15;

  if (reportData.topTrends.length > 0) {
    pdf.setFontSize(10);
    reportData.topTrends.slice(0, 5).forEach((trend, index) => {
      pdf.setTextColor('#000000');
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${trend.keyword}`, 25, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition += 8;
      
      pdf.setTextColor(secondaryColor);
      pdf.text(`Growth: ${trend.growth} | Sentiment: ${trend.sentiment} | Source: ${trend.source}`, 30, yPosition);
      yPosition += 12;
    });
  } else {
    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);
    pdf.text('No significant trends identified in the current reporting period.', 25, yPosition);
    yPosition += 15;
  }

  yPosition += 10;

  // Competitor Analysis Section
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('COMPETITIVE INTELLIGENCE', 20, yPosition);
  yPosition += 15;

  if (reportData.keyCompetitorMoves.length > 0) {
    pdf.setFontSize(10);
    reportData.keyCompetitorMoves.slice(0, 3).forEach((move, index) => {
      pdf.setTextColor('#000000');
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${move.company}`, 25, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition += 8;
      
      pdf.setTextColor(secondaryColor);
      const actionText = `Action: ${move.action} - ${move.details}`;
      const actionLines = pdf.splitTextToSize(actionText, pageWidth - 60);
      pdf.text(actionLines, 30, yPosition);
      yPosition += actionLines.length * 5;
      
      pdf.setTextColor(move.impact === 'High' ? '#dc2626' : move.impact === 'Medium' ? '#f59e0b' : accentColor);
      pdf.text(`Impact Level: ${move.impact}`, 30, yPosition);
      yPosition += 12;
    });
  } else {
    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);
    pdf.text('No significant competitor activities identified in the current reporting period.', 25, yPosition);
    yPosition += 15;
  }

  // Market Sentiment Analysis
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('MARKET SENTIMENT ANALYSIS', 20, yPosition);
  yPosition += 15;

  pdf.setFontSize(10);
  pdf.setTextColor('#000000');
  const totalSentiment = reportData.marketSentiment.positive + reportData.marketSentiment.negative + reportData.marketSentiment.neutral;
  
  if (totalSentiment > 0) {
    const positivePercent = Math.round((reportData.marketSentiment.positive / totalSentiment) * 100);
    const negativePercent = Math.round((reportData.marketSentiment.negative / totalSentiment) * 100);
    const neutralPercent = Math.round((reportData.marketSentiment.neutral / totalSentiment) * 100);
    
    pdf.text(`Positive Sentiment: ${positivePercent}% (${reportData.marketSentiment.positive} indicators)`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Negative Sentiment: ${negativePercent}% (${reportData.marketSentiment.negative} indicators)`, 25, yPosition);
    yPosition += 8;
    pdf.text(`Neutral Sentiment: ${neutralPercent}% (${reportData.marketSentiment.neutral} indicators)`, 25, yPosition);
    yPosition += 15;
  } else {
    pdf.setTextColor(secondaryColor);
    pdf.text('Insufficient sentiment data for comprehensive analysis.', 25, yPosition);
    yPosition += 15;
  }

  // Strategic Recommendations
  if (yPosition > pageHeight - 80) {
    pdf.addPage();
    yPosition = 20;
  }

  pdf.setFontSize(14);
  pdf.setTextColor(primaryColor);
  pdf.text('STRATEGIC RECOMMENDATIONS', 20, yPosition);
  yPosition += 15;

  if (reportData.recommendations.length > 0) {
    pdf.setFontSize(10);
    reportData.recommendations.forEach((rec, index) => {
      pdf.setTextColor('#000000');
      pdf.setFont(undefined, 'bold');
      pdf.text(`${index + 1}. ${rec.title}`, 25, yPosition);
      pdf.setFont(undefined, 'normal');
      yPosition += 8;
      
      pdf.setTextColor(secondaryColor);
      const descLines = pdf.splitTextToSize(rec.description, pageWidth - 60);
      pdf.text(descLines, 30, yPosition);
      yPosition += descLines.length * 5 + 8;
    });
  } else {
    pdf.setFontSize(10);
    pdf.setTextColor(secondaryColor);
    pdf.text('Continue monitoring current trends and competitor activities for emerging opportunities.', 25, yPosition);
    yPosition += 15;
  }

  // Footer
  const footerY = pageHeight - 20;
  pdf.setFontSize(8);
  pdf.setTextColor(secondaryColor);
  pdf.text('Generated by Market Research Agent | Confidential & Proprietary', pageWidth / 2, footerY, { align: 'center' });

  // Save the PDF
  const fileName = `Market-Intelligence-${reportData.industryName}-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};
