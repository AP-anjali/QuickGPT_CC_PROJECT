// /server/controllers/userController.js
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Chat from '../models/Chat.js';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const registerUser = async (req, res, next) => {
  try 
  {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'All fields are required' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, credits: user.credits } });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try 
  {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid email or password' });

    const token = generateToken(user._id);
    res.status(200).json({ success: true, token });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try 
  {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try 
  {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const updateUserCredits = async (req, res, next) => {
  try 
  {
    const { credits } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.credits = credits ?? user.credits;
    await user.save();
    res.status(200).json({ success: true, user });
  } 
  catch (error) 
  {
    next(error);
  }
};

export const getPublishedImages = async (req, res, next) => {
  try 
  {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: '$messages' },
      { $match: { 'messages.isImage': true, 'messages.isPublished': true } },
      { $project: { _id: 0, imageUrl: '$messages.content', userName: '$userName', createdAt: '$messages.timestamp' } },
      { $sort: { createdAt: -1 } },
    ]); 
    res.status(200).json({ success: true, images: publishedImageMessages });
  } 
  catch (error) 
  {
    next(error);
  }
};
