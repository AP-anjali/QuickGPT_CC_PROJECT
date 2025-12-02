# QuickGPT | MERN stack based AI chatbot application inspired by ChatGPT

## Project summary
QuickGPT is a MERN stack based AI chatbot application inspired by ChatGPT. It enables users to chat, ask questions, and get instant responses using AI. The app includes a credit-based access system where users can purchase more credits through payments.

## Features
- chat with AI (text & image)
- credit-based usage & stripe payments
- community published images
- JWT authentication
- server-side rendered demo pages (EJS)
- third-party API : Official Joke API

## Setup
1. clone repo by `git clone https://github.com/AP-anjali/QuickGPT_WMD_PROJECT.git` command
2. create `.env` from `.env.example` and fill values
3. dependencies installation :
   - server side : `cd server && npm install`
   - client side : `cd client && npm install`
4. run :
   - server dev: `cd server && npm run dev`
   - client: `cd client && npm run dev`
5. use postman collection (postman_collection.json) to test endpoints.

## APIs

### AUTH
- `POST /api/users/register` : register a new user  
- `POST /api/users/login` : login user  
- `GET /api/users/me` : get logged-in user details  

### CHATS
- `POST /api/chats` : create a new chat  
- `GET /api/chats` : get all chats  
- `GET /api/chats/:chatId` : get chat by ID  
- `PUT /api/chats/:chatId` : update chat name  
- `DELETE /api/chats/:chatId` : delete chat  

### MESSAGES
- `POST /api/messages/text` : send text message (requires 1 credit)  
- `POST /api/messages/image` : generate image (requires 2 credits)  

### CREDITS
- `GET /api/credits/plans` : get all credit plans  
- `POST /api/credits/purchase` : purchase a plan via Stripe  
- `GET /api/credits/transactions` : get my transactions  
- `PUT /api/credits/transactions/:transactionId` : update transaction (manual by admin)  

### USER EXTRA
- `GET /api/users/:userId` : get user by ID  
- `PATCH /api/users/:userId/credits` : update user credits  
- `GET /api/users/published-images` : get all published images  

### THIRD PARTY API
- `GET https://official-joke-api.appspot.com/jokes/random` : get a random joke  

## Notes
- server side code is hosted on `https://quick-gpt-server-plum.vercel.app/`
- EJS pages at `/` and `/pricing` on server side...
