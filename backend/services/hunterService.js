const axios = require('axios');

const titleIncludesAny = (title, keywords) =>
  keywords.some((kw) => title.includes(kw));

// Ordered most to least GTM-relevant. A contact's rank is the index of the
// first tier its title matches. Contacts matching no tier fall through to
// the stable sort's default order (Hunter's own first result), satisfying
// the "fall back to first result" rule without a special case.
const ROLE_TIERS = [
  // 1. VP Sales / VP Revenue / CRO
  (title) =>
    (titleIncludesAny(title, ['vp', 'vice president']) &&
      titleIncludesAny(title, ['sales', 'revenue'])) ||
    title.includes('chief revenue officer') ||
    /\bcro\b/.test(title),

  // 2. Head of Growth / Growth Lead / Head of GTM
  (title) =>
    (title.includes('growth') &&
      titleIncludesAny(title, ['head', 'lead', 'vp', 'vice president'])) ||
    (title.includes('gtm') && titleIncludesAny(title, ['head', 'vp', 'vice president'])),

  // 3. Marketing Director / Head of Marketing
  (title) =>
    title.includes('marketing') &&
    titleIncludesAny(title, ['director', 'head', 'vp', 'vice president']),

  // 4. Founder / CEO / Co-founder
  (title) =>
    title.includes('founder') ||
    /\bceo\b/.test(title) ||
    title.includes('chief executive officer'),

  // 5. Any other Sales / Business Development role
  (title) => title.includes('sales') || title.includes('business development'),
];

const getRoleRank = (role) => {
  const title = (role || '').toLowerCase();
  const tierIndex = ROLE_TIERS.findIndex((matchesTier) => matchesTier(title));
  return tierIndex === -1 ? ROLE_TIERS.length : tierIndex;
};

const findContact = async (companyDomain) => {
  try {
    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain: companyDomain,
        api_key: process.env.HUNTER_API_KEY,
        limit: 10,
      },
    });

    const data = response.data.data;

    if (!data || !data.emails || data.emails.length === 0) {
      return null;
    }

    const [topContact] = [...data.emails].sort(
      (a, b) => getRoleRank(a.position) - getRoleRank(b.position)
    );

    return {
      firstName: topContact.first_name,
      lastName: topContact.last_name,
      email: topContact.value,
      role: topContact.position,
      confidence: topContact.confidence,
      companyDomain,
    };
  } catch (error) {
    console.error('❌ Hunter.io error:', error.message);
    return null;
  }
};

module.exports = { findContact, getRoleRank };
