const axios = require('axios');

// Same fix as newsService.js: an unparenthesized `"X" funding OR raises OR...`
// query ORs top-level clauses, so any article containing just "raises" or
// "investment" matches with no requirement that the company itself be
// mentioned (e.g. an unrelated DRAM pricing story got scored as this
// company's "Funding" signal).
const toProperCase = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const isCompanyMentioned = (article, companyName) => {
  const properName = toProperCase(companyName);
  if (!properName) return false;
  const haystack = `${article.title || ''} ${article.description || ''} ${article.content || ''}`;
  const escaped = properName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${escaped}\\b`);
  return re.test(haystack);
};

const getFundingSignals = async (companyName) => {
  try {
   const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

const response = await axios.get('https://newsapi.org/v2/everything', {
  params: {
    q: `"${companyName}" AND (funding OR raises OR "series A" OR "series B" OR "series C" OR investment)`,
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

    const relevantArticles = articles.filter((article) => isCompanyMentioned(article, companyName));

   const signals = relevantArticles.map((article) => ({
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

