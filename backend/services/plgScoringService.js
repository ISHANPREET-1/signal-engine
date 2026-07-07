// PLG (product-led growth) scoring — the product-qualified-lead counterpart to
// the outbound scoringService.js. Instead of scoring a company from external
// buying signals, it scores a single signed-up USER from their in-product usage
// behavior, using the same design philosophy:
//   - one weighted contribution per *category* (not per raw number), so a huge
//     raw count in one dimension can't run away with the whole score;
//   - graduated tiers within a category (mirroring Hiring's "surge" threshold),
//     so "hit the free limit once" and "hit it repeatedly" score differently;
//   - only categories that actually cross a threshold appear in the breakdown
//     (the analog of "Other" / unscored categories being dropped);
//   - the final score is capped at 100 and returned with a parallel breakdown
//     of which factors contributed how many points.
//
// Weight rationale (strongest → weakest upgrade intent):
//   Hit Usage Ceiling   — repeatedly bumping the free-tier limit is the single
//                         clearest "I've outgrown free" signal → weighted highest.
//   Team Expansion      — inviting teammates turns one user into seats/collab,
//                         the classic PLG paid trigger → weighted heavily.
//   Heavy Usage         — lots of created content = real value realized, but on
//                         its own doesn't imply intent to pay → moderate.
//   Sustained Engagement— active many days = sticky habit, supporting evidence
//                         rather than a purchase trigger → moderate.

const scoreTiers = (value, tiers) => {
  // tiers: [{ min, points, label }] ordered high→low; first threshold the value
  // meets wins. Returns null when nothing is met (category omitted entirely).
  for (const tier of tiers) {
    if (value >= tier.min) return tier;
  }
  return null;
};

const CATEGORY_SCORERS = [
  {
    category: 'Hit Usage Ceiling',
    field: 'freeTierLimitHits',
    unit: 'free-tier limit hit',
    tiers: [
      { min: 3, points: 35, label: 'Repeatedly hit free-tier limit' },
      { min: 2, points: 25, label: 'Hit free-tier limit multiple times' },
      { min: 1, points: 15, label: 'Hit free-tier limit' },
    ],
  },
  {
    category: 'Team Expansion',
    field: 'teammatesInvited',
    unit: 'teammate invited',
    tiers: [
      { min: 3, points: 30, label: 'Invited several teammates' },
      { min: 1, points: 20, label: 'Invited teammates' },
    ],
  },
  {
    category: 'Heavy Usage',
    field: 'visualsCreated',
    unit: 'visual/action created',
    tiers: [
      { min: 20, points: 20, label: 'Created many visuals/actions' },
      { min: 5, points: 10, label: 'Created several visuals/actions' },
    ],
  },
  {
    category: 'Sustained Engagement',
    field: 'daysActive',
    unit: 'day active in last 30',
    tiers: [
      { min: 15, points: 20, label: 'Active most days this month' },
      { min: 7, points: 10, label: 'Active regularly this month' },
    ],
  },
];

// Coerce a possibly-string/undefined form value into a non-negative integer.
const toCount = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
};

const scorePlgUser = (signup = {}) => {
  const breakdown = [];

  CATEGORY_SCORERS.forEach(({ category, field, unit, tiers }) => {
    const value = toCount(signup[field]);
    const tier = scoreTiers(value, tiers);
    if (!tier) return; // below the lowest threshold — category omitted

    breakdown.push({
      signal: category,
      points: tier.points,
      detail: tier.label,
      value,
      unit,
    });
  });

  const rawScore = breakdown.reduce((sum, item) => sum + item.points, 0);
  const score = Math.min(100, rawScore);

  return { score, breakdown };
};

module.exports = { scorePlgUser };
