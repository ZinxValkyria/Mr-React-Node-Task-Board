import { useEffect, useState, useMemo } from 'react';
import KanbanBoard from './components/KanbanBoard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TaskModal from './components/TaskModal';
import AdvancedFilters from './components/AdvancedFilters';

const API_URL = 'http://localhost:3001';

function App() {
  const [tasks, setTasks] = useState([]);
  const [view, setView] = useState('kanban');
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
    category: null,
    search: ''
  });
  const [form, setForm] = useState({
    title: '',
    category: 'General',
    priority: 'Medium',
    estimatedTime: 120
  });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`${API_URL}/api/tasks?${params}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newTask = await res.json();
      setTasks(prev => [newTask, ...prev]);
      setForm({ title: '', category: 'General', priority: 'Medium', estimatedTime: 120 });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      if (selectedTask?.id === id) setSelectedTask(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (taskId, text) => {
    try {
      await fetch(`${API_URL}/api/tasks/${taskId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author: 'You' }),
      });
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      setTasks(prev => prev.filter(t => t.id !== id));
      setSelectedTask(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">Advanced Task Management</p>
          <h1 className="text-5xl font-bold tracking-tight mt-2">Task Command Center</h1>
          <p className="text-slate-400 mt-3">Full-featured task management with Kanban, analytics, and time tracking</p>
        </div>

        {/* View Toggle */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {['kanban', 'analytics', 'list'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2 rounded-xl font-medium transition-all ${
                view === v
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          {/* Sidebar: Form + Filters */}
          <div className="space-y-6">
            {/* Create Task Form */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-6 backdrop-blur">
              <h2 className="font-semibold text-lg mb-4">Create Task</h2>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({...form, title: e.target.value})}
                  placeholder="Task title..."
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  placeholder="Category..."
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-cyan-400"
                />
                <select
                  value={form.priority}
                  onChange={(e) => setForm({...form, priority: e.target.value})}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-cyan-400"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input
                  type="number"
                  value={form.estimatedTime}
                  onChange={(e) => setForm({...form, estimatedTime: parseInt(e.target.value)})}
                  placeholder="Est. time (mins)..."
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-4 py-2 text-sm outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-slate-950 hover:bg-cyan-400 transition"
                >
                  Create
                </button>
              </form>
            </div>

            {/* Filters */}
            <AdvancedFilters filters={filters} setFilters={setFilters} />
          </div>

          {/* Main View */}
          <div>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : view === 'kanban' ? (
              <KanbanBoard
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onSelectTask={setSelectedTask}
              />
            ) : view === 'analytics' ? (
              <AnalyticsDashboard tasks={tasks} />
            ) : (
              <ListView
                tasks={tasks}
                onUpdateTask={handleUpdateTask}
                onSelectTask={setSelectedTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleUpdateTask}
          onAddNote={handleAddNote}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
}

function ListView({ tasks, onUpdateTask, onSelectTask, onDeleteTask }) {
  const priorityColors = {
    High: 'bg-red-500/20 text-red-300',
    Medium: 'bg-amber-500/20 text-amber-300',
    Low: 'bg-emerald-500/20 text-emerald-300'
  };

  const statusColors = {
    'To Do': 'bg-slate-500/20 text-slate-300',
    'In Progress': 'bg-blue-500/20 text-blue-300',
    'Done': 'bg-emerald-500/20 text-emerald-300'
  };

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <div
          key={task.id}
          onClick={() => onSelectTask(task)}
          className="rounded-xl border border-white/10 bg-slate-900/50 p-4 hover:bg-slate-800/50 transition cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium group-hover:text-cyan-300 transition">{task.title}</h3>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}>
                  {task.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>
                  {task.priority}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-white/5 text-slate-400">
                  {task.category}
                </span>
              </div>
            </div>
            <div className="text-right text-sm text-slate-400">
              <div>{task.timeSpent}m / {task.estimatedTime}m</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                className="text-red-400 hover:text-red-300 text-xs mt-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
