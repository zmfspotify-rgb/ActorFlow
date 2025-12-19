import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from './models/User.js';
import { Task } from './models/Task.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/actorflow';
const DB_NAME = process.env.MONGODB_DB || 'actorflow';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Missing JWT_SECRET environment variable (e.g., set JWT_SECRET=your-strong-secret in .env).');
}

if (!/^[a-zA-Z0-9-_]+$/.test(DB_NAME)) {
  throw new Error('Invalid MONGODB_DB value. Use alphanumeric characters, dash, or underscore.');
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed (continuing with limited features):', error.message);
  }
}

connectDB();

function createToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'User already exists.' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    const token = createToken(user._id);
    res.status(201).json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials.' });
    const token = createToken(user._id);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.get('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    // TODO: Replace placeholder flags with real AI feedback payload once integrated and document the contract.
    res.json({
      tasks,
      aiFeedbackPlaceholder: true,
      note: 'AI feedback will attach per task in future iterations.',
    });
  } catch (error) {
    console.error('Tasks fetch error', error);
    res.status(500).json({ error: 'Could not fetch tasks.' });
  }
});

app.post('/api/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, status = 'pending', notes = '' } = req.body;
    const task = await Task.create({ title, status, notes, userId: req.userId });
    res.status(201).json(task);
  } catch (error) {
    console.error('Task create error', error);
    res.status(500).json({ error: 'Could not create task.' });
  }
});

app.get('/api/wallet', authMiddleware, async (req, res) => {
  try {
    // TODO: Replace stubbed wallet values with persisted balances and transaction history.
    res.json({
      balance: 120,
      currency: 'USD',
      history: [
        { id: 'w1', type: 'deposit', amount: 50, note: 'Starter credit' },
        { id: 'w2', type: 'deposit', amount: 70, note: 'Referral bonus' },
      ],
      instantTransferPlaceholder: true,
    });
  } catch (error) {
    console.error('Wallet fetch error', error);
    res.status(500).json({ error: 'Could not fetch wallet.' });
  }
});

app.post('/api/wallet', authMiddleware, async (req, res) => {
  try {
    const { action, amount } = req.body;
    if (!['deposit', 'withdraw'].includes(action)) return res.status(400).json({ error: 'Invalid action.' });
    if (typeof amount !== 'number' || amount <= 0) return res.status(400).json({ error: 'Invalid amount.' });
    res.status(201).json({ status: 'ok', action, amount, note: 'Placeholder wallet operation.' });
  } catch (error) {
    console.error('Wallet update error', error);
    res.status(500).json({ error: 'Could not update wallet.' });
  }
});

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`ActorFlow backend running on port ${PORT}`);
});
