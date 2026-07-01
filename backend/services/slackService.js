const axios = require('axios');

const sendSlackNotification = async (signal, contact, outreach) => {
  try {
    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🚀 New Buying Signal Detected!',
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Company:*\n${signal.company}`,
            },
            {
              type: 'mrkdwn',
              text: `*Signal Type:*\n${signal.signalType.toUpperCase()}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Signal Detail:*\n${signal.signalDetail}`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Contact:*\n${contact.firstName || 'Unknown'} ${contact.lastName || ''}`,
            },
            {
              type: 'mrkdwn',
              text: `*Role:*\n${contact.role || 'Decision Maker'}`,
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Email:*\n${contact.email}`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*✉️ Generated Email Subject:*\n${outreach.email.subject}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*📝 Why This Matters:*\n${outreach.whyItMatters}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Source:* ${signal.source} | *Date:* ${new Date(signal.date).toDateString()}`,
          },
        },
      ],
    };

    await axios.post(process.env.SLACK_WEBHOOK_URL, message);
    console.log('✅ Slack notification sent');
    return { success: true };
  } catch (error) {
    console.error('❌ Slack error:', error.message);
    return { success: false };
  }
};

module.exports = { sendSlackNotification };