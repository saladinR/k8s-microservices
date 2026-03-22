const request = require('supertest');
const app = require('../server');

describe('Service Users API', () => {

  // Test health check
  test('GET /health doit retourner OK', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test liste users
  test('GET /api/users doit retourner un tableau', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

});
