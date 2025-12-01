// /server/server.js

import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js';
import logger from './middlewares/logger.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

const app = express();
app.use(express.json());

// connect to db
await connectDB();

// stripe webhooks endpoint - raw body
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhooks);

// middlewares
app.use(cors());
app.use(morgan('dev'));        
app.use(logger);  // custom logger

// EJS view engine for server-side rendering demo
app.set('view engine', 'ejs');
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// simple server-side pages
app.get('/', (req, res) => {
  res.render('index', { title: "QuickGPT - Server" });
});

app.get("/pricing", (req, res) => {
  const plans = [
    {
      name: "Basic",
      price: 0,
      description: "For beginners",
      features: ["10 prompts/day", "Basic speed", "Email support"],
    },
    {
      name: "Pro",
      price: 199,
      description: "For regular users",
      features: ["100 prompts/day", "Fast speed", "Priority support"],
    },
    {
      name: "Premium",
      price: 499,
      description: "Unlimited usage",
      features: ["Unlimited prompts", "Ultra fast", "24/7 support"],
    },
  ];

  res.render("pricing", { title: "Pricing", plans });
});

// api routes
app.use('/api/users', userRouter);
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use('/api/credits', creditRouter);

// 404 + central error handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
