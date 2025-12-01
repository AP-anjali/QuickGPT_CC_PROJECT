// /server/routes/chatRoutes.js

import express from 'express';
import {
  createChat,
  getChats,
  getChatById,
  updateChat,
  deleteChat,
} from '../controllers/chatController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getChats);
router.post('/', protect, createChat);
router.get('/:id', protect, getChatById);
router.put('/:id', protect, updateChat);
router.delete('/:id', protect, deleteChat);

export default router;
