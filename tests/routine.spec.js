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

// Routine feature
describe('Routine CRUD', () => {
  it('should return all routines successfully', async (done) => {
    const response = await request(app)
      .post('/api/routines/')
      .set({ Authorization: authToken });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    done();
  });

  it('should register a new routine successfully', async (done) => {
    const response = await request(app)
      .post('/api/routines/create')
      .set({ Authorization: authToken })
      .send({
        name: 'Ombros',
        interval: 60,
        circuits: [{
          circuit: '5eed3320725afd09805b72c6',
        }],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.routine).toHaveProperty('_id');
    done();
  });

  it('should state bad request on create', async (done) => {
    const response = await request(app)
      .post('/api/routines/create')
      .set({ Authorization: authToken })
      .send({
        name: 'Rotine fail',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('validation');
    done();
  });

  it('should return the routine successfully', async (done) => {
    const response = await request(app)
      .get('/api/routines/604c18192b542e08846365ab')
      .set({ Authorization: authToken });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('routine');
    done();
  });

  it('should return route not found (aka 404) on show', async (done) => {
    const response = await request(app)
      .get('/api/routines/604c18192b542e08846365ac')
      .set({ Authorization: authToken });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });

  it('should edit the circuit successfully', async (done) => {
    const response = await request(app)
      .get('/api/routines/604c18192b542e08846365ab')
      .set({ Authorization: authToken });

    const response2 = await request(app)
      .put('/api/routines/604c18192b542e08846365ab')
      .set({ Authorization: authToken })
      .send({
        name: 'Ombro Avançado - Editado',
        interval: 50,
        circuits: [{
          circuit: '5eed3320725afd09805b72c6',
        }],
      });

    expect(response2.status).toBe(200);
    expect(response2.body.data.routine._id).toBe(response.body.data.routine._id);
    expect(response2.body.data.routine.name).not.toBe(response.body.data.routine.name);
    done();
  });

  it('should return route not found (aka 404) on edit', async (done) => {
    const response = await request(app)
      .put('/api/routines/604c18192b542e08846365ac')
      .set({ Authorization: authToken })
      .send({
        name: 'Ombro Avançado - Editado',
        interval: 50,
        circuits: [{
          circuit: '5eed3320725afd09805b72c6',
        }],
      });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });

  it('should delete the circuit successfully', async (done) => {
    const response = await request(app)
      .get('/api/routines/604c18192b542e08846365ab').set({ Authorization: authToken });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .delete('/api/routines/604c18192b542e08846365ab').set({ Authorization: authToken });

    expect(response2.status).toBe(200);

    const response3 = await request(app)
      .get('/api/routines/604c18192b542e08846365ab').set({ Authorization: authToken });

    expect(response3.status).toBe(404);

    done();
  });

  it('should return route not found (aka 404) on delete', async (done) => {
    const response = await request(app)
      .delete('/api/routines/604c18192b542e08846365ac').set({ Authorization: authToken });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);

    done();
  });
});
