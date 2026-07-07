const express = require('express');
const router = express.Router();

const { scorePlgUser } = require('../services/plgScoringService');
const { generatePlgSummary } = require('../services/plgSummaryService');

// PLG Mode — a fully separate, additive path from the outbound pipeline. It
// scores a single simulated sign-up user (product-qualified lead) from manually
// entered usage behavior, rather than researching a company from external
// signals. No contact lookup, no outreach generation, no HubSpot/Slack, and no
// persistence: this is a prototype demonstrating that the same weighted-scoring
// architecture applies to PLG, not just outbound.
router.post('/run-plg', async (req, res) => {
  const {
    userName,
    userEmail,
    companyName,
    visualsCreated,
    teammatesInvited,
    freeTierLimitHits,
    daysActive,
  } = req.body;

  // At least an identifier is required so the result means something; the usage
  // numbers themselves are optional and default to 0 (a legitimately low-intent
  // signup, not an error).
  if (!userName && !userEmail) {
    return res.status(400).json({
      error: 'A user name or email is required',
    });
  }

  const signup = {
    userName,
    userEmail,
    companyName,
    visualsCreated,
    teammatesInvited,
    freeTierLimitHits,
    daysActive,
  };

  try {
    console.log(`\n🧪 Running PLG scoring for: ${userName || userEmail}`);

    const { score, breakdown } = scorePlgUser(signup);
    console.log(`✅ PQL score: ${score}`);

    const plgSummary = await generatePlgSummary({ signup, score, breakdown });
    console.log('✅ PLG summary generated');

    return res.json({
      success: true,
      mode: 'plg',
      signup,
      score,
      breakdown,
      plgSummary,
    });
  } catch (error) {
    console.error('❌ PLG error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
