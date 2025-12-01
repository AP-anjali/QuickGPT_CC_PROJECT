// /server/controllers/chatController.js

import Chat from '../models/Chat.js';

// POST : /api/chats
export const createChat = async (req, res, next) => {
  try 
  {
    const userId = req.user._id;
    const newChat = await Chat.create({
      userId,
      messages: [],
      name: 'New Chat',
      userName: req.user.name,
    });
    res.status(201).json({ success: true, chat: newChat });
  } 
  catch (error) 
  {
    next(error);
  }
};

// GET : /api/chats
export const getChats = async (req, res, next) => {
  try 
  {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });
    res.status(200).json({ success: true, chats });
  } 
  catch (error) {
    next(error);
  }
};

// GET : /api/chats/:id
export const getChatById = async (req, res, next) => {
  try 
  {
    const chat = await Chat.findOne({ _id: req.params.id, userId: req.user._id });
    if (!chat) 
    {
      return res.status(404).json({ success: false, message: 'Chat not found' });
    }

    res.status(200).json({ success: true, chat });
  } 
  catch (error) 
  {
    next(error);
  }
};

// PUT : /api/chats/:id
export const updateChat = async (req, res, next) => {
  try 
  {
    const { name } = req.body;
    const chat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { name } },
      { new: true }
    );

    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    res.status(200).json({ success: true, chat });
  } 
  catch (error) 
  {
    next(error);
  }
};

// DELETE : /api/chats/:id
export const deleteChat = async (req, res, next) => {
  try 
  {
    const result = await Chat.deleteOne({ _id: req.params.id, userId: req.user._id });
    if (result.deletedCount === 0) 
    {
      return res.status(404).json({ success: false, message: 'Chat not found or already deleted' });
    }

    res.status(200).json({ success: true, message: 'Chat deleted' });
  } 
  catch (error) 
  {
    next(error);
  }
};
