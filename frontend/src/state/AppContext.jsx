import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

const seedTasks = [
  { id: 't1', title: 'Vocal warmup ladder', status: 'in-progress', due: 'Today' },
  { id: 't2', title: '2-min scene with obstacles', status: 'pending', due: 'Tomorrow' },
  { id: 't3', title: 'Camera eyeline drill', status: 'pending', due: 'Fri' },
];

const createTaskId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(seedTasks);
  const [wallet, setWallet] = useState({ balance: 120, currency: 'USD' });
  const [actorStatus] = useState('Building screen acting subtlety and audition readiness.');
  const [aiFeedbackOpen, setAiFeedbackOpen] = useState(false);

  const value = useMemo(() => ({
    tasks,
    wallet,
    actorStatus,
    aiFeedbackOpen,
    openFeedback: () => setAiFeedbackOpen(true),
    closeFeedback: () => setAiFeedbackOpen(false),
    addTask: (title) => {
      setTasks((prev) => [...prev, { id: createTaskId(), title, status: 'pending', due: 'Soon' }]);
    },
    deposit: (amount) => setWallet((prev) => ({ ...prev, balance: prev.balance + amount })),
    withdraw: (amount) => setWallet((prev) => ({ ...prev, balance: Math.max(0, prev.balance - amount) })),
  }), [tasks, wallet, actorStatus, aiFeedbackOpen]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
