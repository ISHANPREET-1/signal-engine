const axios = require('axios');

const getLinkedInJobSignals = async (companyName) => {
  try {
    const url = `https://r.jina.ai/https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(companyName)}&f_TPR=r604800`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/plain',
      },
      timeout: 15000,
    });

    const text = response.data;

    // Look for hiring signals in the scraped text
    const hiringKeywords = ['VP of Sales', 'Head of Marketing', 'Sales Manager', 'Account Executive', 'Business Development', 'Revenue'];
    
    const foundSignals = hiringKeywords
      .filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()))
      .map(keyword => ({
        company: companyName,
        signalType: 'hiring',
        signalDetail: `${companyName} is hiring — ${keyword} role detected`,
        description: `${companyName} posted a ${keyword} job, indicating active sales/revenue team expansion`,
        source: 'LinkedIn Jobs',
        date: new Date().toISOString(),
      }));

    return foundSignals;
  } catch (error) {
    console.error('❌ LinkedIn jobs scraping error:', error.message);
    return [];
  }
};

const getG2CompetitorSignals = async (companyName) => {
  try {
    const url = `https://r.jina.ai/https://www.g2.com/products/${companyName.toLowerCase().replace(/\s+/g, '-')}/reviews`;

    const response = await axios.get(url, {
      headers: {
        'Accept': 'text/plain',
      },
      timeout: 15000,
    });

    const text = response.data;

    // Look for pain point keywords in reviews
    const painKeywords = ['slow', 'expensive', 'missing', 'lack', 'wish', 'problem', 'issue', 'difficult', 'hard to use', 'bad support'];

    const foundSignals = painKeywords
      .filter(keyword => text.toLowerCase().includes(keyword.toLowerCase()))
      .map(keyword => ({
        company: companyName,
        signalType: 'competitor_pain',
        signalDetail: `Competitor pain detected — users complaining about "${keyword}"`,
        description: `G2 reviews for ${companyName} mention "${keyword}" — potential opening for outreach`,
        source: 'G2 Reviews',
        date: new Date().toISOString(),
      }));

    // Return max 3 pain signals to keep it clean
    return foundSignals.slice(0, 3);
  } catch (error) {
    console.error('❌ G2 scraping error:', error.message);
    return [];
  }
};

module.exports = { getLinkedInJobSignals, getG2CompetitorSignals };