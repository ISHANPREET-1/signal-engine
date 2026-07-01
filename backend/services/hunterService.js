const axios = require('axios');

const findContact = async (companyDomain) => {
  try {
    const response = await axios.get('https://api.hunter.io/v2/domain-search', {
      params: {
        domain: companyDomain,
        api_key: process.env.HUNTER_API_KEY,
        limit: 1,
      },
    });

    const data = response.data.data;

    if (!data || !data.emails || data.emails.length === 0) {
      return null;
    }

    const topContact = data.emails[0];

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

module.exports = { findContact };
