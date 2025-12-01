// /server/middlewares/creditCheck.js

import User from '../models/User.js';

export const requireCredits = (minCredits) => {
  return async (req, res, next) => {
    try 
    {
      if (!req.user) 
      {
        return res.status(401).json({ success: false, message: 'Not authorized' });
      }

      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (user.credits < minCredits) 
      {
        return res.status(402).json({ success: false, message: 'Insufficient credits' });
      }
      next();
    } 
    catch (error) 
    {
      next(error);
    }
  };
};
