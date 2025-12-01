// /server/routes/messageRoutes.js

import express from 'express';
import { protect } from '../middlewares/auth.js';
import { textMessageController, imageMessageController } from '../controllers/messageController.js';
import { requireCredits } from '../middlewares/creditCheck.js';

const router = express.Router();

router.post('/text', protect, requireCredits(1), textMessageController);

router.post('/image', protect, requireCredits(2), imageMessageController);

export default router;
