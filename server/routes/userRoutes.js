// /server/routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUser, getPublishedImages, getUserById, updateUserCredits } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/published-images', getPublishedImages);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUser);
router.get('/:id', protect, getUserById);
router.patch('/:id/credits', protect, updateUserCredits);

export default router;
