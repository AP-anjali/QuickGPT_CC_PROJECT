// /server/controllers/messageController.js

import Chat from '../models/Chat.js';
import User from '../models/User.js';
import axios from 'axios';
import imageKit from '../configs/imageKit.js';
import openai from '../configs/openai.js';

// TEXT message generation
export const textMessageController = async (req, res, next) => {
  try 
  {
    const userId = req.user._id;
    const { chatId, prompt } = req.body;

    if (!prompt || !chatId) return res.status(400).json({ success: false, message: 'chatId and prompt required' });

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false });

    // call to Gemini API
    const { choices } = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false };

    chat.messages.push(reply);
    await chat.save();

    // decrement of credit
    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.status(200).json({ success: true, reply });
  } 
  catch (error) 
  {
    next(error);
  }
};

// IMAGE message generation
export const imageMessageController = async (req, res, next) => {
  try 
  {
    const userId = req.user._id;
    const { chatId, prompt, isPublished = false } = req.body;
    if (!prompt || !chatId) return res.status(400).json({ success: false, message: 'chatId and prompt required' });

    const chat = await Chat.findOne({ userId, _id: chatId });
    if (!chat) return res.status(404).json({ success: false, message: 'Chat not found' });

    chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false });

    // generate via ImageKit AI endpoint
    const encodedPrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

    const aiImageResponse = await axios.get(generatedImageUrl, { responseType: 'arraybuffer' });
    const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, 'binary').toString('base64')}`;

    const uploadResponse = await imageKit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: 'quickgpt',
    });

    const reply = { role: 'assistant', content: uploadResponse.url, timestamp: Date.now(), isImage: true, isPublished };

    chat.messages.push(reply);
    await chat.save();
    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });

    res.status(200).json({ success: true, reply });
  } 
  catch (error) 
  {
    next(error);
  }
};
