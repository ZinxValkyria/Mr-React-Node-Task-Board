import { useEffect, useMemo, useState } from 'react';

const priorityColors = {
  High: 'bg-red-500/15 text-red-300 ring-1 ring-red-500/30',
  Medium: 'bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/30',
  Low: 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/30',
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    priority: 'Medium',
  });

  useEffect(() => {
    fetch('http://localhost:3001/api/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error(err));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((task) => task.done).length;
    const open = total - done;
    const high = tasks.filter((task) => task.priority === 'High').length;
    return { total, done, open, high };
  }, [tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) return;

    const res = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
    setForm({ title: '', category: 'General', priority: 'Medium' });
  };

  const toggleTask = async (id) => {
    const res = await fetch(`http://localhost:3001/api/tasks/${id}/toggle`, {
      method: 'PATCH',
    });

    const updatedTask = await res.json();
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">
              React + Express
            </p>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              Project Command Center
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              A more polished full-stack starter with a Tailwind UI, live stats,
              and task management backed by your Express API.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300 shadow-2xl shadow-cyan-950/30">
            API: <span className="font-semibold text-cyan-300">localhost:3001</span>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <StatCard label="Total tasks" value={stats.total} />
          <StatCard label="Open" value={stats.open} />
          <StatCard label="Completed" value={stats.done} />
          <StatCard label="High priority" value={stats.high} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-xl font-semibold">Add task</h2>
            <p className="mt-2 text-sm text-slate-400">
              Create a new task and send it straight to your Node API.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Ship dashboard UI"
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none focus:border-cyan-400"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Create task
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Active tasks</h2>
              <p className="mt-1 text-sm text-slate-400">
                Toggle completion state and watch the UI update instantly.
              </p>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className={`rounded-2xl border p-4 transition ${
                    task.done
                      ? 'border-emerald-500/20 bg-emerald-500/10'
                      : 'border-white/10 bg-slate-900/80'
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-lg font-semibold ${
                            task.done ? 'text-slate-400 line-through' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h3>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${priorityColors[task.priority]}`}
                        >
                          {task.priority}
                        </span>
                        <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
                          {task.category}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-slate-400">
                        Task ID: {task.id}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                        task.done
                          ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                          : 'bg-emerald-400 text-slate-950 hover:bg-emerald-300'
                      }`}
                    >
                      {task.done ? 'Mark as open' : 'Mark as done'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

export default App;