const axios = require('axios');

const generateOutreach = async (signal, contact, userProduct) => {
  try {
    const prompt = `
You are an expert B2B sales copywriter. Based on the buying signal below, write hyper-personalized outreach.

SIGNAL:
- Company: ${signal.company}
- Signal Type: ${signal.signalType}
- Signal Detail: ${signal.signalDetail}
- Source: ${signal.source}

CONTACT:
- Name: ${contact.firstName || 'there'}
- Role: ${contact.role || 'Decision Maker'}
- Email: ${contact.email}

USER'S PRODUCT:
${userProduct}

Write TWO things:

1. COLD EMAIL:
- Subject line (max 8 words, curiosity-driven)
- Email body (max 100 words, reference the exact signal, no fluff, end with a soft CTA)

2. LINKEDIN MESSAGE:
- Max 50 words
- Conversational tone
- Reference the signal naturally

3. WHY THIS SIGNAL MATTERS:
- One sentence explaining why this signal = buying intent

Format your response as JSON exactly like this:
{
  "email": {
    "subject": "...",
    "body": "..."
  },
  "linkedin": "...",
  "whyItMatters": "..."
}
`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = response.data.choices[0].message.content;

    // Clean and parse JSON response
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return parsed;
  } catch (error) {
    console.error('❌ Groq error:', error.message);
    return null;
  }
};

module.exports = { generateOutreach };
