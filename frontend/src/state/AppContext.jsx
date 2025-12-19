import { createContext, useContext, useState } from 'react';
import { createTaskId } from '../utils/id.js';

const AppContext = createContext(null);

const seedTasks = [
  { id: 't1', title: 'Vocal warmup ladder', status: 'in-progress', due: 'Today' },
  { id: 't2', title: '2-min scene with obstacles', status: 'pending', due: 'Tomorrow' },
  { id: 't3', title: 'Camera eyeline drill', status: 'pending', due: 'Fri' },
];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(seedTasks);
  const [wallet, setWallet] = useState({ balance: 120, currency: 'USD' });
  const [actorStatus] = useState('Building screen acting subtlety and audition readiness.');
  const [aiFeedbackOpen, setAiFeedbackOpen] = useState(false);

  const value = {
    tasks,
    wallet,
    actorStatus,
    aiFeedbackOpen,
    openFeedback: () => setAiFeedbackOpen(true),
    closeFeedback: () => setAiFeedbackOpen(false),
    addTask: (title) => {
      const due = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());
      setTasks((prev) => [...prev, { id: createTaskId(), title, status: 'pending', due }]);
    },
    deposit: (amount) => setWallet((prev) => ({ ...prev, balance: prev.balance + amount })),
    withdraw: (amount) => setWallet((prev) => ({ ...prev, balance: Math.max(0, prev.balance - amount) })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
