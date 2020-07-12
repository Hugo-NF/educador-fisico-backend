const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorsEnum');

beforeAll(async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'hugonfonseca@hotmail.com',
      password: '123456789',
    });
  authToken = response.body.data['auth-token'];
});

// Health feature
describe('Health', () => {
  it('should a measures added successfully', async (done) => {
    const response = await request(app)
      .post('/api/health/create')
      .send({
        height: 180,
        weight: 85,
        chest: 100,
        waist: 70,
        abdomen: 75,
        hip: 83,
        forearm: 25,
        arm: 31,
        thigh: 73,
        calf: 35,
        objective: 'Definicao corporal',
      });

    expect(response.status).toBe(409);
    expect(response.body.errorCode).toBe(errors.USER_NOT_IN_DATABASE);
    
    done();
  }); 