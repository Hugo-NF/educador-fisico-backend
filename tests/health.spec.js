const request = require('supertest');
const app = require('../src/app');

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
      .post('/api/health/create/322c582d-ed39-4f90-8e0c-5b2409736bda')
      .send({
        measures: {
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
        },
        bodyStats: {
          vo2max: 5,
          fatPercentage: 20,
        },
        objective: 'Definicao corporal',
      });

    expect(response.status).toBe(200);

    done();
  });

  // show method
  it('should return the health checkpoint successfully', async (done) => {
    const response = await request(app)
      .get('/api/health/?').set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('health');
    done();
  });

  it('should return health checkpoint route not found (aka 404)', async (done) => {
    const response = await request(app)
      .get('/api/health/?').set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });

  // delete method
  it('should delete the health checkpoint successfully', async (done) => {
    const response = await request(app)
      .get('/api/health/?').set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .delete('/api/health/?').set({
        'auth-token': authToken,
      });

    expect(response2.status).toBe(200);

    const response3 = await request(app)
      .get('/api/health/?').set({
        'auth-token': authToken,
      });

    expect(response3.status).toBe(404);

    done();
  });
});
