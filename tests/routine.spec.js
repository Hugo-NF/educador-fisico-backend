const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorCodes');

beforeAll(async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'hugonfonseca@hotmail.com',
      password: '123456789',
    });
  authToken = response.body.data.authToken;
});

// Exercise feature
describe('Exercise CRUD', () => {
  it('should return all routines successfully', async (done) => {
    const response = await request(app)
      .post('/api/routines/')
      .set({ authToken });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    done();
  });

  it('should return the routine successfully', async (done) => {
    const response = await request(app)
      .get('/api/routines/604c18192b542e08846365ab')
      .set({ authToken });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('routine');
    done();
  });
});
