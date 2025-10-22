// /server/controllers/chatController.js

import Chat from "../models/Chat.js";


// API controller for creating a new chat
export const createChat = async (req, res) => {
    try 
    {
        const userId = req.user._id;

        const chatData = {
            userId,
            messages : [],
            name : "New Chat",
            userName : req.user.name
        };

        const newChat = await Chat.create(chatData);
        res.status(201).json({success : true, message : "Chat created successfully", chat: newChat});
    } 
    catch (error) 
    {
        res.status(500).json({success : false, message : error.message});
    }
}

// API controller for getting all chats
export const getChats = async (req, res) => {
    try 
    {
        const userId = req.user._id;

        const chats = await Chat.find({userId}).sort({updatedAt : -1});

        res.status(200).json({success : true, chats});
    } 
    catch (error) 
    {
        res.status(500).json({success : false, message : error.message});
    }
}

// API controller for delete chat
export const deleteChat = async (req, res) => {
    try 
    {
        const userId = req.user._id;

        const {chatId} = req.body;

        await Chat.deleteOne({ _id : chatId, userId});

        res.status(200).json({success : true, message : "Chat deleted"});
    } 
    catch (error) 
    {
        res.status(500).json({success : false, message : error.message});
    }
}