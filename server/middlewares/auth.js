// /server/middlewares/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try 
  {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    if (token.startsWith('Bearer ')) token = token.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    req.user = user;
    next();
  } 
  catch (error) 
  {
    res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
