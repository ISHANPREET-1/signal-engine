const CATEGORY_RULES = [
  {
    category: 'Security Incident',
    keywords: [
      'data breach', 'breach', 'hacked', 'hack', 'vulnerability', 'data leak',
      'leaked data', 'cyberattack', 'cyber attack', 'ransomware', 'security incident',
      'exposed data', 'compromised',
    ],
  },
  {
    category: 'Acquisition',
    keywords: [
      'acquires', 'acquired', 'acquisition', 'to acquire', 'acquiring',
      'buys', 'merger', 'merges with', 'bought by',
    ],
  },
  {
    category: 'Executive Change',
    keywords: [
      'appoints', 'names new', 'names ceo', 'names cfo', 'names cto', 'names coo',
      'new ceo', 'new cfo', 'new cto', 'new coo', 'new chief',
      'steps down', 'resigns', 'joins as ceo', 'joins as cfo', 'joins as chief',
      'promoted to', 'chief executive officer', 'chief financial officer',
      'chief technology officer', 'chief revenue officer', 'chief marketing officer',
    ],
  },
  {
    category: 'Partnership',
    keywords: [
      'partners with', 'partnership with', 'strategic partnership', 'teams up with',
      'collaborates with', 'joint venture', 'integration with', 'announces partnership',
    ],
  },
  {
    category: 'Expansion',
    keywords: [
      'expands to', 'expansion into', 'opens new office', 'opens office in',
      'enters the market', 'expanding operations', 'expands into', 'new headquarters',
      'international expansion',
    ],
  },
  {
    category: 'Product Launch',
    keywords: [
      'launches', 'launch of', 'unveils', 'introduces', 'announces new',
      'rolls out', 'now available', 'debuts', 'new product', 'new feature',
      'general availability', 'ships',
    ],
  },
  {
    category: 'Funding',
    keywords: [
      'raises', 'raised', 'funding round', 'series a', 'series b', 'series c',
      'series d', 'seed round', 'seed funding', 'venture capital', 'closes funding',
      'secures funding', 'valuation', 'backed by', 'in funding',
    ],
  },
  {
    category: 'Hiring',
    keywords: [
      'is hiring', 'hiring for', 'job posting', 'open roles', 'growing team',
      "we're hiring", 'vp of sales', 'head of marketing', 'account executive',
      'business development', 'sales manager', 'expanding its team', 'new hires',
    ],
  },
  {
    category: 'Competitor Pain',
    keywords: [
      'hard to use', 'bad support', 'poor support', 'customers complain',
      'users complain', 'switching from', 'looking for alternative',
      'wish it had', 'missing feature', 'lacks',
    ],
  },
];

const CATEGORIES = CATEGORY_RULES.map((rule) => rule.category);

// Signals sourced from scrapingService already know their category from the
// scrape itself (LinkedIn jobs vs G2 reviews) — trust that over keyword matching.
const classifySignal = (signal = {}) => {
  const { signalType, signalDetail = '', description = '' } = signal;

  if (signalType === 'hiring') return 'Hiring';
  if (signalType === 'competitor_pain') return 'Competitor Pain';

  const text = `${signalDetail} ${description}`.toLowerCase();

  for (const { category, keywords } of CATEGORY_RULES) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  // Both newsService and fundingService cast a fairly broad net at the NewsAPI
  // query level, so plenty of hits won't actually be a real funding/company
  // story — don't assume unmatched fundingService results are Funding just
  // because of which endpoint they came from.
  return 'Other';
};

module.exports = { classifySignal, CATEGORIES };
