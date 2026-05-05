const request = require('supertest');
const app = require('../index.js');

describe('Tasks API', () => {
  describe('GET /api/tasks', () => {
    it('should return an array of tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return tasks with required fields', async () => {
      const response = await request(app).get('/api/tasks');
      const task = response.body[0];
      expect(task).toHaveProperty('id');
      expect(task).toHaveProperty('title');
      expect(task).toHaveProperty('category');
      expect(task).toHaveProperty('priority');
      expect(task).toHaveProperty('done');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task',
        category: 'Testing',
        priority: 'High'
      };
      const response = await request(app).post('/api/tasks').send(newTask);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Task');
      expect(response.body.done).toBe(false);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ category: 'Testing' });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should use default category if not provided', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task without category' });
      expect(response.status).toBe(201);
      expect(response.body.category).toBe('General');
    });
  });

  describe('PATCH /api/tasks/:id/toggle', () => {
    it('should toggle task done status', async () => {
      const getTasks = await request(app).get('/api/tasks');
      const taskId = getTasks.body[0].id;
      const initialDone = getTasks.body[0].done;

      const response = await request(app).patch(`/api/tasks/${taskId}/toggle`);
      expect(response.status).toBe(200);
      expect(response.body.done).toBe(!initialDone);
    });
  });
});
