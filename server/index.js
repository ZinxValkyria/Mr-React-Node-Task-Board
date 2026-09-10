const express = require('express');
const cors = require('cors');

const app = express();
const allowedPriorities = new Set(['High', 'Medium', 'Low']);
const allowedOrigin = process.env.CORS_ORIGIN;

app.disable('x-powered-by');
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : undefined));
app.use(express.json({ limit: '32kb' }));

let tasks = [
  { id: 1, title: 'Set up WSL', category: 'DevOps', priority: 'High', done: true },
  { id: 2, title: 'Connect React to Express', category: 'Frontend', priority: 'Medium', done: false },
  { id: 3, title: 'Style app with Tailwind', category: 'UI', priority: 'High', done: false }
];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  const category = typeof req.body.category === 'string' ? req.body.category.trim() : '';
  const priority = req.body.priority || 'Medium';

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (title.length > 120) {
    return res.status(400).json({ error: 'Title must be 120 characters or fewer' });
  }
  if (!allowedPriorities.has(priority)) {
    return res.status(400).json({ error: 'Priority must be High, Medium, or Low' });
  }

  const newTask = {
    id: Date.now(),
    title,
    category: category || 'General',
    priority,
    done: false
  };

  tasks.unshift(newTask);
  return res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id)) {
    return res.status(400).json({ error: 'Task ID must be a valid integer' });
  }

  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[taskIndex] = { ...tasks[taskIndex], done: !tasks[taskIndex].done };
  return res.json(tasks[taskIndex]);
});

if (require.main === module) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
}

module.exports = app;
