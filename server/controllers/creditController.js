// /server/controllers/creditController.js

import Transaction from '../models/Transactions.js';
import Stripe from 'stripe';
import User from '../models/User.js';

const plans = [
  { _id: 'basic', name: 'Basic', price: 10, credits: 100, features: ['100 text', '50 images'] },
  { _id: 'pro', name: 'Pro', price: 20, credits: 500, features: ['500 text', '200 images'] },
  { _id: 'premium', name: 'Premium', price: 30, credits: 1000, features: ['1000 text', '500 images'] },
];

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// GET : /api/credits/plans
export const getPlans = async (req, res, next) => {
  try 
  {
    res.status(200).json({ success: true, plans });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const getMyCredits = async (req, res, next) => {
  try 
  {
    // yahape req.user is set by `protect` middleware
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ success: false, message: 'Not authorized' });

    const user = await User.findById(userId).select('credits name email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.status(200).json({ success: true, credits: user.credits, user: { _id: user._id, name: user.name, email: user.email } });
  } 
  catch (error) 
  {
    next(error);
  }
};

// POST : /api/credits/purchase
export const purchasePlan = async (req, res, next) => {
  try 
  {
    const { planId } = req.body;
    const userId = req.user._id;
    const plan = plans.find((p) => p._id === planId);

    if (!plan) return res.status(400).json({ success: false, message: 'Invalid plan' });

    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      isPaid: false,
    });

    const origin = req.headers.origin || process.env.FRONTEND_URL;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: plan.price * 100,
            product_data: { name: plan.name },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/loading`,
      cancel_url: `${origin}`,
      metadata: { transactionId: transaction._id.toString(), appId: 'quickgpt' },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    res.status(200).json({ success: true, url: session.url });
  } 
  catch (error) 
  {
    next(error);
  }
};

// get : /api/credits/transactions
export const getTransactions = async (req, res, next) => {
  try 
  {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, transactions });
  } 
  catch (error) 
  {
    next(error);
  }
};

// patch : /api/credits/transactions/:id
export const updateTransaction = async (req, res, next) => {
  try 
  {
    const tx = await Transaction.findOne({ _id: req.params.id, userId: req.user._id });
    if (!tx) return res.status(404).json({ success: false, message: 'Transaction not found' });
    tx.isPaid = req.body.isPaid ?? tx.isPaid;
    await tx.save();
    res.status(200).json({ success: true, transaction: tx });
  } 
  catch (error) 
  {
    next(error);
  }
};
