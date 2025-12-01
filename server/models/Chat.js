// /server/models/Chat.js

import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    userId : {type : String, ref : "User", required : true},
    userName : {type : String, required : true},
    name : {type : String, required : true},    // chat name he.. not the user name
    messages : [
        {
            isImage : {type : Boolean, required : true},
            isPublished : {type : Boolean, required : false},
            role : {type : String, required : true},
            content : {type : String, required : true},
            timestamp : {type : Number, required : true},
            default: []
        }
    ]
}, {timestamps : true});

const Chat = mongoose.model('Chat', ChatSchema);
export default Chat;