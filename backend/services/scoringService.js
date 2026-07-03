const WEIGHTS = {
  Funding: 30,
  'Product Launch': 25,
  Acquisition: 25,
  'Executive Change': 15,
  Partnership: 15,
  Expansion: 15,
  'Competitor Pain': 10,
  'Security Incident': 10,
};

const HIRING_SURGE_THRESHOLD = 2;

// Scores once per category present (not once per article) so five funding
// articles about the same raise don't inflate the score past one real signal.
const calculateBuyingIntent = (signals = []) => {
  const byCategory = {};

  signals.forEach((signal) => {
    const category = signal.category || 'Other';
    if (!byCategory[category]) byCategory[category] = [];
    byCategory[category].push(signal);
  });

  const breakdown = [];

  Object.entries(byCategory).forEach(([category, group]) => {
    if (category === 'Hiring') {
      const isSurge = group.length >= HIRING_SURGE_THRESHOLD;
      breakdown.push({
        signal: isSurge ? 'Hiring surge' : 'Hiring',
        points: isSurge ? 20 : 10,
        contributingSignals: group.map((s) => s.signalDetail),
      });
      return;
    }

    const points = WEIGHTS[category];
    if (!points) return; // unscored category (e.g. "Other")

    breakdown.push({
      signal: category,
      points,
      contributingSignals: group.map((s) => s.signalDetail),
    });
  });

  const rawScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const score = Math.min(100, rawScore);

  return { score, breakdown };
};

module.exports = { calculateBuyingIntent };
