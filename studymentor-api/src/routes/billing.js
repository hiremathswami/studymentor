/**
 * @file src/routes/billing.js
 * @description POST /api/billing/checkout & POST /api/billing/webhook
 *              Uses Stripe API for checkout + signature-verified webhooks.
 */

const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const requireAuth = require('../middleware/auth');
const Stripe = require('stripe');

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' }) : null;

// Use these fallback prices or add real Stripe Price IDs to your .env
const PRICE_MAP = {
  pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly_placeholder',
  pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly_placeholder',
  team_monthly: process.env.STRIPE_PRICE_TEAM_MONTHLY || 'price_team_monthly_placeholder',
  team_yearly: process.env.STRIPE_PRICE_TEAM_YEARLY || 'price_team_yearly_placeholder'
};

/**
 * POST /api/billing/checkout
 * Body: { plan: 'pro' | 'team', interval: 'monthly' | 'yearly' }
 */
router.post('/checkout', requireAuth, async (req, res) => {
  const { plan, interval } = req.body;

  if (!['pro', 'team'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "team".' });
  }

  if (!['monthly', 'yearly'].includes(interval)) {
    return res.status(400).json({ error: 'Invalid interval. Must be "monthly" or "yearly".' });
  }

  const priceKey = `${plan}_${interval}`;
  const priceId = PRICE_MAP[priceKey];

  try {
    // If Stripe is configured, call the real API
    if (stripe) {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${FRONTEND_URL}/dashboard?upgraded=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${FRONTEND_URL}/upgrade`,
        customer_email: req.user.email,
        metadata: {
          user_id: req.user.id,
          plan: plan
        }
      });

      return res.status(200).json({ checkoutUrl: session.url });
    }

    // Fallback: simulated checkout for development
    res.status(200).json({
      checkoutUrl: `${FRONTEND_URL}/dashboard?upgraded=true&plan=${plan}&simulated=true`,
      sessionId: `sim_${Date.now()}`,
    });
  } catch (err) {
    console.error(`[Billing Checkout] ${err.message}`);
    res.status(500).json({ error: 'Failed to create checkout session. ' + err.message });
  }
});

/**
 * POST /api/billing/webhook
 * NOTE: This route uses express.raw() — see server.js for middleware config.
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    
    let event = req.body;

    // 1. Verify signature if Stripe is configured
    if (stripe && STRIPE_WEBHOOK_SECRET) {
      try {
        event = stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        console.warn(`[Billing Webhook] Signature mismatch: ${err.message}`);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }
    } else {
      // For local testing without real webhooks, we parse manually
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    }

    // 2. Handle checkout.session.completed
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { user_id, plan } = session.metadata || {};

      if (user_id && plan) {
        // Upgrade the user to the new plan
        const { error } = await supabase
          .from('users')
          .update({ plan: plan })
          .eq('id', user_id);

        if (error) {
          console.error(`[Billing Webhook] Supabase update error:`, error);
        } else {
          console.log(`[Billing Webhook] Upgraded user ${user_id} → ${plan}`);
        }
      }
    }

    // 3. ALWAYS return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`[Billing Webhook] ${err.message}`);
    // Still return 200 to avoid infinite retries from Stripe, though error indicates an issue
    res.status(200).json({ received: true, error: err.message });
  }
});

module.exports = router;
