const express = require('express');
const router = express.Router();

const { getNewsSignals } = require('../services/newsService');
const { getFundingSignals } = require('../services/fundingService');
const { getLinkedInJobSignals, getG2CompetitorSignals } = require('../services/scrapingService');
const { findContact } = require('../services/hunterService');
const { generateOutreach } = require('../services/groqService');
const { pushToHubspot } = require('../services/hubspotService');
const { sendSlackNotification } = require('../services/slackService');
const { classifySignal } = require('../services/classificationService');
const { calculateBuyingIntent } = require('../services/scoringService');
const Run = require('../models/Run');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Pipeline route is working 🚀' });
});

// Main pipeline route
router.post('/run-pipeline', async (req, res) => {
  const { companyName, companyDomain, userProduct } = req.body;

  if (!companyName || !companyDomain || !userProduct) {
    return res.status(400).json({
      error: 'companyName, companyDomain and userProduct are required',
    });
  }

  try {
    console.log(`\n🚀 Running pipeline for: ${companyName}`);

    // Step 1 — Fetch all signals in parallel
    console.log('📡 Fetching signals...');
    const [newsSignals, fundingSignals, hiringSignals, competitorSignals] =
      await Promise.all([
        getNewsSignals(companyName),
        getFundingSignals(companyName),
        getLinkedInJobSignals(companyName),
        getG2CompetitorSignals(companyName),
      ]);

    const allSignals = [
      ...newsSignals,
      ...fundingSignals,
      ...hiringSignals,
      ...competitorSignals,
    ];

    console.log(`✅ Found ${allSignals.length} signals`);

    if (allSignals.length === 0) {
      return res.status(404).json({
        error: 'No signals found for this company',
      });
    }

    // Step 1.5 — Classify signals and score buying intent
    const classifiedSignals = allSignals.map((signal) => ({
      ...signal,
      category: classifySignal(signal),
    }));

    const { score, breakdown } = calculateBuyingIntent(classifiedSignals);
    console.log(`✅ Buying intent score: ${score}`);

    // Step 2 — Find contact
    console.log('🔍 Finding contact...');
    const contact = await findContact(companyDomain) || {
      firstName: 'Decision',
      lastName: 'Maker',
      email: `contact@${companyDomain}`,
      role: 'Executive',
    };
    console.log(`✅ Contact: ${contact.email}`);

    // Step 3 — Generate outreach for top 3 signals
    console.log('✍️ Generating outreach...');
    // Anchor outreach on real classified signals before falling back to
    // "Other" ones — otherwise whichever noisy news article happened to be
    // fetched first becomes the entire email/HubSpot/Slack payload.
    const topSignals = [...classifiedSignals]
      .sort((a, b) => (a.category === 'Other' ? 1 : 0) - (b.category === 'Other' ? 1 : 0))
      .slice(0, 3);

    const outreachRaw = await Promise.all(
      topSignals.map(async (signal, index) => {
        // Only ask for the company-level reasoning summary once (on the top
        // signal's call) instead of once per signal — same Groq round-trip
        // count as before, just repurposing the first call's response.
        const { outreach, companySummary } = await generateOutreach({
          signal,
          contact,
          userProduct,
          companyName,
          contextSignals: classifiedSignals,
          includeSummary: index === 0,
        });
        return { signal, outreach, companySummary };
      })
    );

    const outreachResults = outreachRaw.map(({ signal, outreach }) => ({ signal, outreach }));
    const companySummary = outreachRaw.find((r) => r.companySummary)?.companySummary || null;

    console.log('✅ Outreach generated');

    // Step 4 — Push to HubSpot
    console.log('📊 Pushing to HubSpot...');
    const hubspotResult = await pushToHubspot(
      contact,
      topSignals[0],
      outreachResults[0].outreach
    );

    // Step 5 — Send Slack notification
    console.log('💬 Sending Slack notification...');
    await sendSlackNotification(
      topSignals[0],
      contact,
      outreachResults[0].outreach
    );

    // Step 6 — Save run to MongoDB
    console.log('💾 Saving to MongoDB...');
    const run = new Run({
      companyName,
      companyDomain,
      userProduct,
      signals: classifiedSignals,
      contact,
      outreach: outreachResults,
      score,
      breakdown,
      companySummary,
      hubspotContactId: hubspotResult.contactId,
      createdAt: new Date(),
    });
    await run.save();

    console.log('✅ Pipeline complete!\n');

    // Return everything to frontend
    return res.json({
      success: true,
      companyName,
      contact,
      signals: classifiedSignals,
      score,
      breakdown,
      companySummary,
      outreach: outreachResults,
      hubspot: hubspotResult,
    });
  } catch (error) {
    console.error('❌ Pipeline error:', error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Get all past runs
router.get('/runs', async (req, res) => {
  try {
    const runs = await Run.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ runs });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;