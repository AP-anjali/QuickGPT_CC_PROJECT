// /server/routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUser, getPublishedImages } from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const userRoutes = express.Router();

userRoutes.post('/register', registerUser);
userRoutes.post('/login', loginUser);
userRoutes.get('/data', protect, getUser);
userRoutes.get('/published-images', getPublishedImages);

export default userRoutes;
