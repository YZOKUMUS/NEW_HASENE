const request = require('supertest');
const app = require('./server');

describe('Server.js API Endpoints', () => {
  it('should respond to GET / with 200', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
  // Add more endpoint tests here as needed
});
