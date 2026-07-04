const axios = require('axios');

// NewsAPI's `q` syntax ORs top-level clauses, so an unparenthesized
// `"X" company OR software OR startup` matches ANY article containing just
// "software" or "startup" — with no requirement that the company itself be
// mentioned. That's how unrelated articles (keyboard reviews, archaeology
// stories, etc.) end up back as "signals".
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
  // Case-sensitive, word-boundary match on the proper-noun form of the name.
  // Case-insensitive substring matching alone false-positives on companies
  // whose name is also a common English word — e.g. "Ramp" matched "...loose
  // ends ramp up to a..." in an unrelated TV recap.
  const escaped = properName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\b${escaped}\\b`);
  return re.test(haystack);
};

const getNewsSignals = async (companyName) => {
  try {
   const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

const response = await axios.get('https://newsapi.org/v2/everything', {
  params: {
    q: `"${companyName}" AND (company OR software OR startup OR SaaS OR funding OR hiring OR launch)`,
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

    // Belt-and-suspenders: even with the query fixed, require the company
    // name to actually appear before trusting an article as a real signal.
    // If nothing survives, returning [] is correct — no backfill with
    // generic/unrelated news just to have something to show.
    const relevantArticles = articles.filter((article) => isCompanyMentioned(article, companyName));

   const signals = relevantArticles.map((article) => ({
  company: companyName,
  signalType: 'news',
  signalDetail: article.title,
  description: article.description,
  source: article.source.name,
  url: article.url,
  date: article.publishedAt,
}));
    return signals;
  } catch (error) {
    console.error('❌ NewsAPI error:', error.message);
    return [];
  }
};

module.exports = { getNewsSignals };
