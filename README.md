# ActorFlow

Day 1 scaffold for the acting app with React + Tailwind front-end and Node.js/Express + MongoDB back-end.

## Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (or `npm run build`)

Includes dashboard, tasks, wallet placeholders, AI feedback modal stub, and responsive navigation.

## Backend
1. `cd backend`
2. `npm install`
3. Create `.env` with:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/actorflow
   MONGODB_DB=actorflow
   JWT_SECRET=change-me
   ```
4. `npm run dev` or `npm start`

API routes: `/api/register`, `/api/login`, `/api/tasks`, `/api/wallet`, plus `/health`. Tasks and wallet responses are placeholder-friendly and ready for future AI integrations.

### API shape (Day 1 placeholders)
- `/api/tasks` → `{ tasks: Task[], aiFeedbackPlaceholder: boolean, note: string }` where `Task` includes `title`, `status`, `notes`, `userId`, timestamps. `aiFeedbackPlaceholder` marks the slot for future AI critiques.
- `/api/wallet` → `{ balance: number, currency: string, history: [{ id, type, amount, note }], instantTransferPlaceholder: boolean }` to be replaced with persisted balances/transactions later.
