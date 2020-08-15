const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');
const errors = require('../src/config/errorCodes');

beforeAll(async () => {
  const response = await request(app)
    .post('/api/users/login')
    .send({
      email: 'ailamar.sedentaria@hotmail.com',
      password: '123456789',
    });
  authToken = response.body.data['auth-token'];
});

// Health feature
describe('Health', () => {
  it('should add a checkpoint successfully', async (done) => {
    const userBefore = await User.find({ email: 'ailamar.sedentaria@hotmail.com' });

    const response = await request(app)
      .post('/api/health/create')
      .set({
        'auth-token': authToken,
      })
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

    const userAfter = await User.find({ email: 'ailamar.sedentaria@hotmail.com' });

    expect(userAfter.healthCheckpoints.length).toBe(userBefore.healthCheckpoints.length + 1);

    done();
  });

  // Show method - No date filter
  it('should return all checkpoints', async (done) => {
    const user = await User.find({ email: 'ailamar.sedentaria@hotmail.com' });

    const response = await request(app)
      .post('/api/health/')
      .set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);
    expect(response.body.data.length).toBe(user.healthCheckpoints.length);
    done();
  });

  // Para os testes com data, lembrar de colocar as entradas no seed.js para que você saiba quais datas testar
  it('should return health checkpoints between two dates', async (done) => {
    const response = await request(app)
      .post('/api/health')
      .set({
        'auth-token': authToken,
      })
      .send({
        startDate: new Date(1998, 6, 15), // Mudar a data
        endDate: new Date(1998, 6, 15), // Mudar a data
      });

    // Colocar os expects de quantos checkpoints estão entre as duas datas testadas
    done();
  });

  it('should return health checkpoints between one date and now', async (done) => {
    const response = await request(app)
      .post('/api/health')
      .set({
        'auth-token': authToken,
      })
      .send({
        startDate: new Date(1998, 6, 15), // Mudar a data
      });

    // Colocar os expects de quantos checkpoints estão entre as datas testadas
    done();
  });

  // Lembrar de colocar as entradas no seed.js para que você saiba qual IDs usar para deletar
  // Delete method - Checkpoint exists
  it('should delete the health checkpoint successfully', async (done) => {
    const response = await request(app)
      .delete('/api/health/PEGAR DO SEED.JS')
      .set({
        'auth-token': authToken,
      });

    // Colocar os expects para verificar se o ID sumiu da collection health e se o healthCheckpoints do usuário diminuiu em 1
    done();
  });

  // Delete method - Checkpoint DO NOT exist
  it('should NOT delete the health checkpoint, a.k.a Not Found (404)', async (done) => {
    const response = await request(app)
      .delete('/api/health/5713809576185')
      .set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });
});
