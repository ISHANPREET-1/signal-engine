const axios = require('axios');

const pushToHubspot = async (contact, signal, outreach) => {
  try {
    const headers = {
      Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
      'Content-Type': 'application/json',
    };

    // Step 1 — Create or update contact
    const contactPayload = {
      properties: {
        firstname: contact.firstName || 'Unknown',
        lastname: contact.lastName || '',
        email: contact.email,
        jobtitle: contact.role || '',
        company: signal.company,
      },
    };

    let contactId;

    try {
      const createResponse = await axios.post(
        'https://api.hubapi.com/crm/v3/objects/contacts',
        contactPayload,
        { headers }
      );
      contactId = createResponse.data.id;
      console.log('✅ HubSpot contact created:', contactId);
    } catch (err) {
      // Contact already exists — search for it
      if (err.response?.status === 409) {
        const searchResponse = await axios.post(
          'https://api.hubapi.com/crm/v3/objects/contacts/search',
          {
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: contact.email,
                  },
                ],
              },
            ],
          },
          { headers }
        );
        contactId = searchResponse.data.results[0].id;
        console.log('✅ HubSpot contact found:', contactId);
      } else {
        throw err;
      }
    }

    

    return { success: true, contactId };
  } catch (error) {
    console.error('❌ HubSpot error:', error.response?.data || error.message);
    return { success: false };
  }
};

module.exports = { pushToHubspot };