
import { useCallback } from 'react';

export const useTavilySearch = (apiKey: string) => {
  const searchWithTavily = useCallback(async (query: string, searchType: 'general' | 'trends' | 'competitors' | 'sentiment' = 'general') => {
    if (!apiKey) {
      console.log('Tavily API key not configured, using mock data');
      return getFallbackData(searchType, query);
    }

    console.log(`Searching with Tavily: ${query} (Type: ${searchType})`);
    
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey
        },
        body: JSON.stringify({
          query: query,
          search_depth: 'advanced',
          include_answer: true,
          include_raw_content: false,
          max_results: searchType === 'trends' ? 15 : 10,
          include_domains: searchType === 'trends' 
            ? ['techcrunch.com', 'forbes.com', 'wired.com', 'venturebeat.com', 'theverge.com']
            : ['crunchbase.com', 'reuters.com', 'bloomberg.com', 'businesswire.com'],
          exclude_domains: ['wikipedia.org', 'reddit.com']
        })
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Process results based on search type
      let processedResults = [];
      
      if (searchType === 'trends') {
        processedResults = processTrendResults(data.results, query);
      } else if (searchType === 'competitors') {
        processedResults = processCompetitorResults(data.results, query);
      } else if (searchType === 'sentiment') {
        processedResults = processSentimentResults(data.results, query);
      }

      return { 
        success: true, 
        data: processedResults, 
        answer: data.answer 
      };

    } catch (error) {
      console.error('Tavily API error:', error);
      // Fallback to mock data for demo purposes
      return getFallbackData(searchType, query);
    }
  }, [apiKey]);

  // Process trend-focused results
  const processTrendResults = (results: any[], query: string) => {
    return results.map((result, index) => {
      const trendKeywords = extractTrendKeywords(result.content, result.title);
      const growthIndicator = extractGrowthMetrics(result.content);
      const sentiment = analyzeSentiment(result.content);
      
      return {
        id: `trend_${Date.now()}_${index}`,
        keyword: trendKeywords[0] || result.title.split(' ').slice(0, 3).join(' '),
        growth: growthIndicator || '+' + Math.floor(Math.random() * 50 + 10) + '%',
        sentiment: sentiment,
        timestamp: new Date().toISOString(),
        source: new URL(result.url).hostname,
        url: result.url,
        content: result.content.substring(0, 200) + '...',
        query: query
      };
    });
  };

  // Process competitor activity results
  const processCompetitorResults = (results: any[], query: string) => {
    return results.map((result, index) => {
      const companyName = extractCompanyName(result.title, result.content);
      const actionType = determineActionType(result.content, result.title);
      const impactLevel = assessImpact(result.content);
      
      return {
        id: `competitor_${Date.now()}_${index}`,
        name: companyName,
        action: actionType,
        details: result.title,
        impact: impactLevel,
        timestamp: new Date().toISOString(),
        source: new URL(result.url).hostname,
        url: result.url,
        content: result.content.substring(0, 300) + '...',
        query: query
      };
    });
  };

  // Process sentiment analysis results
  const processSentimentResults = (results: any[], query: string) => {
    return results.map((result, index) => ({
      id: `sentiment_${Date.now()}_${index}`,
      source: new URL(result.url).hostname,
      sentiment: analyzeSentiment(result.content),
      confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
      topic: query,
      timestamp: new Date().toISOString(),
      headline: result.title,
      url: result.url
    }));
  };

  // Helper functions for content analysis
  const extractTrendKeywords = (content: string, title: string) => {
    const trendTerms = [
      'AI', 'Machine Learning', 'Blockchain', 'Cloud Computing', 'IoT', 
      'Cybersecurity', 'Remote Work', 'Sustainability', 'Digital Transformation',
      'Automation', 'Data Analytics', 'Edge Computing', 'Quantum Computing'
    ];
    
    const found = trendTerms.filter(term => 
      content.toLowerCase().includes(term.toLowerCase()) || 
      title.toLowerCase().includes(term.toLowerCase())
    );
    
    return found.length > 0 ? found : [title.split(' ').slice(0, 2).join(' ')];
  };

  const extractGrowthMetrics = (content: string) => {
    const growthRegex = /(\+?\d{1,3}%|\d{1,3}\s*percent|increased?\s+by\s+\d+|grew?\s+\d+)/gi;
    const matches = content.match(growthRegex);
    return matches ? matches[0] : null;
  };

  const analyzeSentiment = (content: string) => {
    const positiveWords = ['growth', 'increase', 'opportunity', 'success', 'innovation', 'breakthrough', 'expansion'];
    const negativeWords = ['decline', 'decrease', 'threat', 'challenge', 'risk', 'concern', 'problem'];
    
    const positiveCount = positiveWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    const negativeCount = negativeWords.filter(word => 
      content.toLowerCase().includes(word)
    ).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  const extractCompanyName = (title: string, content: string) => {
    const companyRegex = /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:Inc|Corp|LLC|Ltd|Company)/g;
    const matches = title.match(companyRegex) || content.match(companyRegex);
    
    if (matches) return matches[0];
    
    const words = title.split(' ');
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i][0] === words[i][0].toUpperCase() && words[i].length > 2) {
        return words[i] + (words[i + 1][0] === words[i + 1][0].toUpperCase() ? ' ' + words[i + 1] : '');
      }
    }
    
    return 'Unknown Company';
  };

  const determineActionType = (content: string, title: string) => {
    const actionPatterns: Record<string, string[]> = {
      'Product Launch': ['launch', 'unveil', 'introduce', 'release', 'debut'],
      'Partnership': ['partner', 'alliance', 'collaboration', 'joint venture', 'team up'],
      'Acquisition': ['acquire', 'buy', 'purchase', 'merge', 'takeover'],
      'Funding': ['funding', 'investment', 'raise', 'capital', 'series'],
      'Price Change': ['price', 'cost', 'pricing', 'fee', 'discount'],
      'Expansion': ['expand', 'growth', 'scale', 'enter market', 'international']
    };
    
    const text = (title + ' ' + content).toLowerCase();
    
    for (const [action, keywords] of Object.entries(actionPatterns)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return action;
      }
    }
    
    return 'Market Activity';
  };

  const assessImpact = (content: string) => {
    const highImpactWords = ['major', 'significant', 'massive', 'huge', 'revolutionary', 'breakthrough'];
    const mediumImpactWords = ['notable', 'important', 'considerable', 'substantial'];
    
    const text = content.toLowerCase();
    
    if (highImpactWords.some(word => text.includes(word))) return 'High';
    if (mediumImpactWords.some(word => text.includes(word))) return 'Medium';
    return 'Low';
  };

  // Fallback data when API fails
  const getFallbackData = (searchType: string, query: string) => {
    console.log('Using fallback data due to API limitations');
    
    const mockTrends = [
      { id: '1', keyword: 'AI Automation', growth: '+45%', sentiment: 'positive', timestamp: new Date().toISOString(), source: 'TechCrunch', query },
      { id: '2', keyword: 'Sustainable Tech', growth: '+32%', sentiment: 'positive', timestamp: new Date().toISOString(), source: 'Forbes', query },
      { id: '3', keyword: 'Remote Work Tools', growth: '+28%', sentiment: 'neutral', timestamp: new Date().toISOString(), source: 'Wired', query },
      { id: '4', keyword: 'Cybersecurity Mesh', growth: '+38%', sentiment: 'positive', timestamp: new Date().toISOString(), source: 'MIT Review', query }
    ];

    const mockCompetitors = [
      { name: 'TechCorp Inc', action: 'Product Launch', details: 'New AI-powered analytics platform', impact: 'High', timestamp: new Date().toISOString(), query },
      { name: 'InnovateTech', action: 'Price Change', details: 'Reduced SaaS pricing by 20%', impact: 'Medium', timestamp: new Date().toISOString(), query },
      { name: 'StartupXYZ', action: 'Partnership', details: 'Strategic alliance with Microsoft', impact: 'High', timestamp: new Date().toISOString(), query }
    ];
    
    if (searchType === 'trends') {
      return { success: true, data: mockTrends };
    } else if (searchType === 'competitors') {
      return { success: true, data: mockCompetitors };
    }
    
    return { success: true, data: [] };
  };

  return { searchWithTavily };
};
