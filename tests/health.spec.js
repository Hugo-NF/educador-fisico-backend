const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorCodes');

beforeAll(async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'ailamar.sedentaria@hotmail.com',
      password: '123456789',
    });
  authToken = response.body.data.authToken;
  testStarted = new Date();
});

// Health feature
describe('Health', () => {
  it('should add a checkpoint successfully', async (done) => {
    const response = await request(app)
      .post('/api/health/create')
      .set({ Authorization: authToken })
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
        ipaq: {
          walkPerWeek1a: 3,
          walkTimePerDay1b: 100,
          moderateActivityPerWeek2a: 5,
          moderateActivityTimePerDay2b: 120,
          vigorousActivityPerWeek3a: 200,
          vigorousActivityTimePerDay3b: 140,
          seatedTimeWeekday4a: 210,
          seatedTimeWeekend4b: 210,
        },
        objective: 'Definicao corporal',
      });

    expect(response.status).toBe(200);
    done();
  });

  // Show method - No date filter
  it('should return all checkpoints', async (done) => {
    // The user information is retrieved from request headers
    const response = await request(app)
      .post('/api/health/')
      .set({ Authorization: authToken });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(2);
    done();
  });

  it('should return health checkpoints between two dates', async (done) => {
    const response = await request(app)
      .post('/api/health')
      .set({ Authorization: authToken })
      .send({
        startDate: new Date(1998, 6, 15), // Any very early date
        endDate: testStarted,
      });

    // Already in database
    expect(response.body.data.length).toBe(1);
    expect(response.body.endDate).toBe(testStarted.toISOString());
    done();
  });

  it('should return health checkpoints between one date and now', async (done) => {
    const response = await request(app)
      .post('/api/health')
      .set({ Authorization: authToken })
      .send({
        startDate: testStarted, // Mudar a data
      });

    // Added during the test
    expect(response.body.data.length).toBe(1);
    expect(response.body.startDate).toBe(testStarted.toISOString());
    done();
  });

  // Lembrar de colocar as entradas no seed.js para que você saiba qual IDs usar para deletar
  // Delete method - Checkpoint exists
  it('should delete the health checkpoint successfully', async (done) => {
    const response = await request(app)
      .delete('/api/health/5f382c26c21c6b7f70227f5e')
      .set({ Authorization: authToken });

    expect(response.body.data).toHaveProperty('_id');
    expect(response.body.data).toHaveProperty('measures');
    expect(response.body.data).toHaveProperty('bodyStats');
    expect(response.body.data).toHaveProperty('objective');

    done();
  });

  // Delete method - Checkpoint ownership
  it('should NOT delete the health checkpoint, a.k.a Unauthorized (403)', async (done) => {
    const response = await request(app)
      .delete('/api/health/5eed3357725afd0980c272c7')
      .set({ Authorization: authToken });

    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe(errors.RESOURCE_OWNERSHIP_MISMATCH);
    done();
  });

  // Delete method - Checkpoint unknown
  it('should NOT delete the health checkpoint, a.k.a Not Found (404)', async (done) => {
    const response = await request(app)
      .delete('/api/health/5f382b5076119f513dcd055f')
      .set({ Authorization: authToken });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });
});
