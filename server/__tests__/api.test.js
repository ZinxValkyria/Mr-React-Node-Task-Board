const request = require('supertest');
const app = require('../index.js');

describe('Tasks API - Advanced Features', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter by status', async () => {
      const response = await request(app).get('/api/tasks?status=Done');
      expect(response.status).toBe(200);
      response.body.forEach(task => {
        expect(task.status).toBe('Done');
      });
    });

    it('should filter by priority', async () => {
      const response = await request(app).get('/api/tasks?priority=High');
      expect(response.status).toBe(200);
      response.body.forEach(task => {
        expect(task.priority).toBe('High');
      });
    });

    it('should search by title', async () => {
      const response = await request(app).get('/api/tasks?search=React');
      expect(response.status).toBe(200);
      response.body.forEach(task => {
        expect(task.title.toLowerCase().includes('react')).toBe(true);
      });
    });
  });

  describe('GET /api/tasks/analytics/summary', () => {
    it('should return analytics summary', async () => {
      const response = await request(app).get('/api/tasks/analytics/summary');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('byStatus');
      expect(response.body).toHaveProperty('byPriority');
      expect(response.body).toHaveProperty('byCategory');
      expect(response.body).toHaveProperty('completionRate');
      expect(response.body).toHaveProperty('totalTimeSpent');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create task with time estimate', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Advanced Task',
          category: 'Testing',
          priority: 'High',
          estimatedTime: 240
        });
      expect(response.status).toBe(201);
      expect(response.body.estimatedTime).toBe(240);
      expect(response.body.status).toBe('To Do');
      expect(response.body.notes).toEqual([]);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update task status', async () => {
      const getTasks = await request(app).get('/api/tasks');
      const taskId = getTasks.body[0].id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ status: 'In Progress' });
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('In Progress');
    });

    it('should update time spent', async () => {
      const getTasks = await request(app).get('/api/tasks');
      const taskId = getTasks.body[0].id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send({ timeSpent: 150 });
      expect(response.status).toBe(200);
      expect(response.body.timeSpent).toBe(150);
    });
  });

  describe('POST /api/tasks/:id/notes', () => {
    it('should add note to task', async () => {
      const getTasks = await request(app).get('/api/tasks');
      const taskId = getTasks.body[0].id;

      const response = await request(app)
        .post(`/api/tasks/${taskId}/notes`)
        .send({ text: 'Great progress!', author: 'Dev' });
      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Great progress!');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should return 400 without note text', async () => {
      const getTasks = await request(app).get('/api/tasks');
      const taskId = getTasks.body[0].id;

      const response = await request(app)
        .post(`/api/tasks/${taskId}/notes`)
        .send({ author: 'Dev' });
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to delete' });
      const taskId = createRes.body.id;

      const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
      expect(deleteRes.status).toBe(200);

      const getRes = await request(app).get(`/api/tasks`);
      expect(getRes.body.some(t => t.id === taskId)).toBe(false);
    });
  });
});
