const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: 'Set up WSL', category: 'DevOps', priority: 'High', done: true },
  { id: 2, title: 'Connect React to Express', category: 'Frontend', priority: 'Medium', done: false },
  { id: 3, title: 'Style app with Tailwind', category: 'UI', priority: 'High', done: false }
];

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, category, priority } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: Date.now(),
    title,
    category: category || 'General',
    priority: priority || 'Medium',
    done: false
  };

  tasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const id = Number(req.params.id);
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );

  const updatedTask = tasks.find(task => task.id === id);
  res.json(updatedTask);
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => {
    console.log('API running on http://localhost:3001');
  });
}

module.exports = app;