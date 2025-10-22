import Chat from "../models/Chat.js";
import User from "../models/User.js";
import axios from "axios";
import imageKit from "../configs/imageKit.js";
import openai from "../configs/openai.js";

// text-based message controller : text based message mate 1 credit kapase
export const textMessageController = async (req, res) => {
    try 
    {
        const userId = req.user._id;

        // checking credits
        if (req.user.credits < 1) 
        {
            return res.json({success: false, message: "you don't have enough credits to use this feature!"});
        }

        const { chatId, prompt } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId });
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        const reply = {...choices[0].message, timestamp: Date.now(), isImage: false};   // reply from OpenAI

        res.json({success: true, reply});

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id : userId}, {$inc: {credits: -1}});
    } 
    catch (error) 
    {
        res.json({success: false, message: error.message});
    }
}

// Image generation message controller : image-based message mate 2 credit kapay
export const imageMessageController = async (req, res) => {
    try 
    {
        const userId = req.user._id;

        // checking credits
        if (req.user.credits < 2) 
        {
            return res.json({success: false, message: "you don't have enough credits to use this feature!"});
        }

        const { prompt, chatId, isPublished } = req.body;

        // find chat
        const chat = await Chat.findOne({ userId, _id: chatId });
        
        // push user message
        chat.messages.push({ role: "user", content: prompt, timestamp: Date.now(), isImage: false });

        // encode the prompt
        const encodedPrompt = encodeURIComponent(prompt);

        // construct imageKit AI generation URL
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;  // aama quickgpt chhe ae project[folder] name chhe

        // trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, {responseType : "arraybuffer"});

        // covert img to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        // upload img to ImageKit media library
        const uploadResponse = await imageKit.upload({
            file: base64Image,
            fileName : `${Date.now()}.png`,
            folder: "quickgpt"  // project folder
        });

        const reply = {role: 'assistant', content: uploadResponse.url, timestamp: Date.now(), isImage: true, isPublished};   // reply from OpenAI

        res.status(200).json({success: true, reply});

        chat.messages.push(reply);
        await chat.save();
        await User.updateOne({_id : userId}, {$inc: {credits: -2}});
    } 
    catch (error) 
    {
        res.status(500).json({success: false, message: error.message});
    }
}