import { useMemo, useState } from 'react';
import { AppProvider, useAppState } from './state/AppContext.jsx';

const navItems = [
  { label: 'Dashboard', id: 'dashboard' },
  { label: 'Tasks', id: 'tasks' },
  { label: 'Wallet', id: 'wallet' },
  { label: 'Profile', id: 'profile' },
];

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg shadow-black/30">
      <div className="text-sm text-slate-400">{title}</div>
      <div className="text-2xl font-semibold text-white mt-1">{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
    'in-progress': 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/30',
    completed: 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30',
  };
  const text = status === 'in-progress' ? 'In Progress' : status[0].toUpperCase() + status.slice(1);
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}>{text}</span>;
}

function TasksSection() {
  const { tasks, addTask, openFeedback } = useAppState();
  const [newTask, setNewTask] = useState('');
  const orderedTasks = useMemo(() => tasks, [tasks]);

  return (
    <section id="tasks" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Tasks</p>
          <h2 className="text-xl font-semibold text-white">AI-Ready Acting Drills</h2>
          <p className="text-sm text-slate-400">Stubbed tasks; AI feedback modal opens per task.</p>
        </div>
        <button
          onClick={openFeedback}
          className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 hover:border-cyan-400"
        >
          Open AI Feedback
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {orderedTasks.map((task) => (
          <div key={task.id} className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-semibold text-white">{task.title}</div>
              <div className="text-sm text-slate-400">Due: {task.due}</div>
            </div>
            <StatusBadge status={task.status} />
          </div>
        ))}
      </div>
      <form
        className="mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newTask.trim()) return;
          addTask(newTask.trim());
          setNewTask('');
        }}
      >
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new drill or acting note"
          className="flex-1 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
        >
          Add Task
        </button>
      </form>
    </section>
  );
}

function WalletSection() {
  const { wallet, deposit, withdraw } = useAppState();
  return (
    <section id="wallet" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Wallet</p>
          <h2 className="text-xl font-semibold text-white">Instant deposit/withdraw (placeholder)</h2>
          <p className="text-sm text-slate-400">Future AI production services can draw from here.</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">${wallet.balance.toFixed(2)}</div>
          <div className="text-sm text-slate-400">{wallet.currency}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => deposit(25)} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
          + $25
        </button>
        <button onClick={() => withdraw(15)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-white hover:border-slate-500">
          Withdraw $15
        </button>
      </div>
    </section>
  );
}

function ProfileSection() {
  const { actorStatus } = useAppState();
  return (
    <section id="profile" className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl shadow-black/30">
      <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">Profile</p>
      <h2 className="text-xl font-semibold text-white">Actor Status</h2>
      <p className="mt-2 text-sm text-slate-300">{actorStatus}</p>
      <ul className="mt-3 grid gap-2 text-sm text-slate-400">
        <li>• Screen acting subtlety block unlocked</li>
        <li>• Audition prep queued for next sprint</li>
        <li>• AI notes placeholder ready for Day 2+</li>
      </ul>
    </section>
  );
}

function AiFeedbackModal() {
  const { aiFeedbackOpen, closeFeedback } = useAppState();
  if (!aiFeedbackOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur">
      <div className="w-[95%] max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">AI Feedback</p>
            <h3 className="text-lg font-semibold text-white">Placeholder for Day 2+</h3>
          </div>
          <button onClick={closeFeedback} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Here we will surface AI critiques for line reads, tempo-rhythm, and camera eyeline consistency. Copilot or future agents can wire model outputs into this modal.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200">
          <span className="text-cyan-300">Tip:</span> attach takes, select beat shifts, and request precision notes.
        </div>
        <div className="mt-4 flex justify-end">
          <button onClick={closeFeedback} className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { tasks, wallet } = useAppState();
  const activeTasks = tasks.filter((t) => t.status !== 'completed').length;
  const completedTasks = tasks.length - activeTasks;

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">ActorFlow</p>
          <h1 className="text-3xl font-bold text-white">Day 1 Dashboard</h1>
          <p className="text-sm text-slate-400">React + Tailwind scaffold with placeholders for AI, tasks, wallet, and auth.</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-full border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-cyan-500/60"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <section id="dashboard" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Tasks" value={activeTasks} hint="AI generated tasks arrive later" />
        <StatCard title="Completed" value={completedTasks} hint="Track rehearsal throughput" />
        <StatCard title="Wallet" value={`$${wallet.balance.toFixed(2)}`} hint="Instant transfer placeholder" />
        <StatCard title="Status" value="Leveling Screen Acting" hint="Next: Audition prep" />
      </section>

      <TasksSection />
      <div className="grid gap-4 lg:grid-cols-2">
        <WalletSection />
        <ProfileSection />
      </div>
      <AiFeedbackModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
