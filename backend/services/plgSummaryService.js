const axios = require('axios');

// Groq-backed reasoning summary for a product-qualified lead — the PLG analog
// of groqService.js's companySummary. Kept in its own file so the outbound Groq
// integration stays untouched; it follows the same call pattern (same model,
// clean-and-parse JSON, swallow errors and fall back rather than throw).
//
// Honesty is the whole point: when the usage signals are weak the summary must
// say so plainly rather than manufacture upgrade intent that isn't there. When
// there are no scored signals at all we don't even call the model — there is
// nothing for it to reason from, so inventing a narrative would be fabrication.

const buildPrompt = ({ signup, score, breakdown }) => {
  const factsList = breakdown
    .map((b) => `- ${b.signal}: ${b.detail} (${b.value} ${b.unit}${b.value === 1 ? '' : 's'}) → +${b.points}`)
    .join('\n');

  const name = signup.userName || signup.userEmail || 'This user';
  const company = signup.companyName ? ` at ${signup.companyName}` : '';

  return `
You are a PLG (product-led growth) analyst assessing whether a signed-up free user looks like a product-qualified lead worth a sales/upgrade nudge. Judge ONLY from the usage facts below — do not invent behavior that isn't listed.

USER: ${name}${company}
PQL SCORE: ${score}/100

SCORED USAGE FACTORS (these are the ONLY signals detected):
${factsList}

Write a 1-2 sentence, third-person reasoning summary explaining why this user is a strong OR weak upgrade candidate, in this honest, specific style:
- Strong example: "Dana repeatedly hit the free-tier limit and invited three teammates, a classic seat-expansion pattern that points to clear upgrade intent."
- Weak example: "This user has created only a handful of visuals and hasn't invited anyone or hit any limits, so there's little evidence of upgrade intent yet."
Reference the actual factors above by name. If the signals are weak, say so directly — do not overstate. No marketing fluff, no fabricated details.

Respond as JSON exactly like this:
{
  "plgSummary": "..."
}
`;
};

const generatePlgSummary = async ({ signup, score, breakdown }) => {
  // No scored factors — the outbound path skips its Groq call in the same
  // situation. Return a plain, honest line instead of prompting the model to
  // narrate an upgrade story from nothing.
  if (!breakdown || breakdown.length === 0) {
    const name = signup.userName || signup.userEmail || 'This user';
    return `${name} shows no strong usage signals — no repeated limit hits, teammate invites, heavy creation, or sustained activity — so there's little evidence of upgrade intent yet.`;
  }

  try {
    const prompt = buildPrompt({ signup, score, breakdown });

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
        max_tokens: 400,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const raw = response.data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return parsed.plgSummary || null;
  } catch (error) {
    console.error('❌ PLG summary (Groq) error:', error.message);
    return null;
  }
};

module.exports = { generatePlgSummary };
