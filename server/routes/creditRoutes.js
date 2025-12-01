// /server/routes/creditRoutes.js

import express from 'express';
import { getPlans, purchasePlan, getTransactions, updateTransaction, getMyCredits } from '../controllers/creditController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/plans', getPlans);             
router.post('/purchase', protect, purchasePlan); 
router.get('/transactions', protect, getTransactions); 
router.patch('/transactions/:id', protect, updateTransaction); 
router.get('/me', protect, getMyCredits);

export default router;
