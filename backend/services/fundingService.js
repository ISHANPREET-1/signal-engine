const axios = require('axios');

const getFundingSignals = async (companyName) => {
  try {
   const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

const response = await axios.get('https://newsapi.org/v2/everything', {
  params: {
    q: `"${companyName}" funding OR raises OR "series A" OR "series B" OR "series C" OR investment`,
    sortBy: 'publishedAt',
    language: 'en',
    pageSize: 5,
    from: fromDate,
    apiKey: process.env.NEWS_API_KEY,
  },
});

    const articles = response.data.articles;

    if (!articles || articles.length === 0) {
      return [];
    }

   const signals = articles.map((article) => ({
  company: companyName,
 signalType: 'funding',
  signalDetail: article.title,
  description: article.description,
  source: article.source.name,
  url: article.url,
  date: article.publishedAt,
}));
    return signals;
  } catch (error) {
    console.error('❌ Funding signals error:', error.message);
    return [];
  }
};

module.exports = { getFundingSignals };

