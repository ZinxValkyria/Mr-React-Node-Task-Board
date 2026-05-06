const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: 'Set up WSL',
    category: 'DevOps',
    priority: 'High',
    status: 'Done',
    notes: [],
    timeSpent: 120,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    dependencies: [],
    estimatedTime: 120
  },
  {
    id: 2,
    title: 'Connect React to Express',
    category: 'Frontend',
    priority: 'Medium',
    status: 'In Progress',
    notes: [{ text: 'Use axios for API calls', author: 'Dev', timestamp: new Date() }],
    timeSpent: 45,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    dependencies: [1],
    estimatedTime: 120
  },
  {
    id: 3,
    title: 'Style app with Tailwind',
    category: 'UI',
    priority: 'High',
    status: 'To Do',
    notes: [],
    timeSpent: 0,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    dependencies: [2],
    estimatedTime: 180
  },
  {
    id: 4,
    title: 'Setup testing framework',
    category: 'DevOps',
    priority: 'Medium',
    status: 'To Do',
    notes: [],
    timeSpent: 30,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    dependencies: [],
    estimatedTime: 90
  }
];

app.get('/api/tasks', (req, res) => {
  const { status, priority, category, search } = req.query;
  let filtered = [...tasks];

  if (status) filtered = filtered.filter(t => t.status === status);
  if (priority) filtered = filtered.filter(t => t.priority === priority);
  if (category) filtered = filtered.filter(t => t.category === category);
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.title.toLowerCase().includes(term) ||
      t.notes.some(n => n.text.toLowerCase().includes(term))
    );
  }

  res.json(filtered);
});

app.get('/api/tasks/analytics/summary', (req, res) => {
  const summary = {
    total: tasks.length,
    byStatus: {
      'To Do': tasks.filter(t => t.status === 'To Do').length,
      'In Progress': tasks.filter(t => t.status === 'In Progress').length,
      'Done': tasks.filter(t => t.status === 'Done').length
    },
    byPriority: {
      'High': tasks.filter(t => t.priority === 'High').length,
      'Medium': tasks.filter(t => t.priority === 'Medium').length,
      'Low': tasks.filter(t => t.priority === 'Low').length
    },
    byCategory: tasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {}),
    totalTimeSpent: tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0),
    completionRate: Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100),
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Done').length
  };
  res.json(summary);
});

app.post('/api/tasks', (req, res) => {
  const { title, category, priority, estimatedTime, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: Date.now(),
    title,
    category: category || 'General',
    priority: priority || 'Medium',
    status: 'To Do',
    notes: [],
    timeSpent: 0,
    createdAt: new Date(),
    dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    dependencies: [],
    estimatedTime: estimatedTime || 120
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const { status, priority, category, timeSpent, dueDate, dependencies, estimatedTime } = req.body;

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (status) task.status = status;
  if (priority) task.priority = priority;
  if (category) task.category = category;
  if (timeSpent !== undefined) task.timeSpent = timeSpent;
  if (dueDate) task.dueDate = new Date(dueDate);
  if (dependencies) task.dependencies = dependencies;
  if (estimatedTime) task.estimatedTime = estimatedTime;

  res.json(task);
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);

  if (!task) return res.status(404).json({ error: 'Task not found' });

  task.status = task.status === 'Done' ? 'To Do' : 'Done';
  res.json(task);
});

app.post('/api/tasks/:id/notes', (req, res) => {
  const id = Number(req.params.id);
  const { text, author } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Note text is required' });
  }

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const note = {
    text,
    author: author || 'Anonymous',
    timestamp: new Date()
  };

  task.notes.push(note);
  res.status(201).json(note);
});

app.delete('/api/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  res.json({ success: true });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => {
    console.log('API running on http://localhost:3001');
  });
}

module.exports = app;