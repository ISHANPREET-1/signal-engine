const axios = require('axios');

const formatSignalLine = (signal) => {
  const category = signal.category || signal.signalType;
  const when = signal.date ? `, ${new Date(signal.date).toDateString()}` : '';
  return `[${category}] ${signal.signalDetail}${
    signal.description ? ` — ${signal.description}` : ''
  } (${signal.source}${when})`;
};

// Picks the primary signal plus a spread of other *distinct-category* signals so
// the prompt has more than one storyline to weave together, not five funding
// articles saying the same thing.
const pickContextSignals = (primarySignal, allSignals = [], limit = 4) => {
  const seenCategories = new Set([primarySignal.category || primarySignal.signalType]);
  const picked = [primarySignal];

  for (const signal of allSignals) {
    if (picked.length >= limit) break;
    if (signal === primarySignal) continue;
    const category = signal.category || signal.signalType;
    // "Other" means the classifier couldn't tie it to a real GTM signal —
    // don't hand it to the model as if it were meaningful context.
    if (category === 'Other') continue;
    if (seenCategories.has(category)) continue;
    seenCategories.add(category);
    picked.push(signal);
  }

  // If the company only has one real classified signal, leave it at that —
  // padding with an "Other" (unclassified/irrelevant) signal just to hit a
  // count would make the model cite something meaningless as if it mattered.
  return picked;
};

const buildPrompt = ({ signal, contact, userProduct, companyName, contextSignals, includeSummary }) => {
  const signalsForPrompt = pickContextSignals(signal, contextSignals);
  const signalsList = signalsForPrompt
    .map((s, i) => `${i + 1}. ${formatSignalLine(s)}`)
    .join('\n');
  const hasMultipleSignals = signalsForPrompt.length >= 2;

  const summaryTask = includeSummary
    ? `
4. COMPANY SUMMARY: 1-2 sentences, third person, in this exact style: "Vercel recently launched new AI features while expanding engineering hiring, suggesting active product growth and potential investment in GTM tooling." Synthesize the strongest signals above into one narrative about what's happening at ${companyName} and what it implies for their priorities.`
    : '';

  const summaryField = includeSummary ? ',\n  "companySummary": "..."' : '';

  return `
You are an expert B2B SDR who actually read the research below before writing — not a mail-merge template.

TARGET COMPANY: ${companyName}

DETECTED BUYING SIGNALS:
${signalsList}

PRIMARY SIGNAL TO ANCHOR THIS OUTREACH ON:
[${signal.category || signal.signalType}] ${signal.signalDetail}

DECISION-MAKER:
- Name: ${contact.firstName || 'there'}
- Role: ${contact.role || 'Decision Maker'}

OUR PRODUCT:
${userProduct}

Write outreach that reads like a human SDR who read the research above. Hard requirements:
- ${hasMultipleSignals
    ? 'Reference at least TWO of the signals listed above by name — not only the primary one — and weave them into one coherent narrative about what\'s happening at ' + companyName + ' right now.'
    : 'Only one real signal was detected for ' + companyName + ' right now — reference it by name and go deep on it rather than padding with vague filler.'}
- Explicitly state why ${hasMultipleSignals ? 'those signals point' : 'that signal points'} to a specific, timely priority for ${companyName} (e.g. new capital → pressure to scale go-to-market; a hiring surge → operational strain; a product launch → need for supporting infrastructure or tooling).
- Explicitly connect that priority to how OUR PRODUCT helps solve it, using specifics from the product description above. Never write a generic line like "helps you grow" — name the actual mechanism.
- No filler openers like "I hope this finds you well" or "I came across your company".

Produce:
1. COLD EMAIL: subject (max 8 words, specific, curiosity-driven) + body (max 120 words, must name ${hasMultipleSignals ? '2+ signals' : 'the signal'}, ends with a soft, low-pressure CTA)
2. LINKEDIN MESSAGE: max 60 words, conversational, references at least one signal naturally
3. WHY THIS MATTERS: 1-2 sentences on why these signals together indicate active buying intent for ${companyName} specifically${summaryTask}

Format your response as JSON exactly like this:
{
  "email": { "subject": "...", "body": "..." },
  "linkedin": "...",
  "whyItMatters": "..."${summaryField}
}
`;
};

const generateOutreach = async ({
  signal,
  contact,
  userProduct,
  companyName,
  contextSignals = [],
  includeSummary = false,
}) => {
  try {
    const prompt = buildPrompt({ signal, contact, userProduct, companyName, contextSignals, includeSummary });

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

    return {
      outreach: {
        email: parsed.email,
        linkedin: parsed.linkedin,
        whyItMatters: parsed.whyItMatters,
      },
      companySummary: parsed.companySummary || null,
    };
  } catch (error) {
    console.error('❌ Groq error:', error.message);
    return { outreach: null, companySummary: null };
  }
};

module.exports = { generateOutreach };
