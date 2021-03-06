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

// Circuit feature
describe('Circuit CRUD', () => {
  it('should return all circuits successfully', async (done) => {
    const response = await request(app)
      .post('/api/circuits/')
      .set({ authToken });

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    done();
  });

  it('should register a new circuit successfully', async (done) => {
    const response = await request(app)
      .post('/api/circuits/create')
      .set({ authToken })
      .send({
        name: 'Elevação Frontal - Avançado',
        exercises: [{
          exercise: '5eed3be55d28c2255016b868',
          repetitions: 15,
          weight: 120,
        }],
      });

    expect(response.status).toBe(200);
    expect(response.body.data.circuit).toHaveProperty('_id');
    done();
  });

  it('should state bad request on create', async (done) => {
    const response = await request(app)
      .post('/api/circuits/create')
      .set({ authToken })
      .send({
        name: 'Elevação Lateral - Avançado',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('validation');
    done();
  });

  it('should return the circuit successfully', async (done) => {
    const response = await request(app)
      .get('/api/circuits/5eed3357725afd09805b72c7').set({ authToken });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('circuit');
    done();
  });

  it('should return route not found (aka 404) on show', async (done) => {
    const response = await request(app)
      .get('/api/circuits/5eed3357725afd09805b72c4').set({ authToken });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });

  it('should edit the circuit successfully', async (done) => {
    const response = await request(app)
      .get('/api/circuits/5eed3357725afd09805b72c7').set({ authToken });
    expect(response.status).toBe(200);

    const response2 = await request(app)
      .put('/api/circuits/5eed3357725afd09805b72c7')
      .set({ authToken })
      .send({
        name: 'Elevação Lateral - Editado',
        exercises: [{
          exercise: '5ef790361968bd468a6f9ddb',
          repetitions: 25,
          weight: 100,
        }],
      });

    expect(response2.status).toBe(200);
    expect(response2.body.data.circuit._id).toBe(response.body.data.circuit._id);
    expect(response2.body.data.circuit.name).toBe('Elevação Lateral - Editado');
    expect(response2.body.data.circuit.name).not.toBe(response.body.data.circuit.name);
    done();
  });

  it('should return route not found (aka 404) on edit', async (done) => {
    const response = await request(app)
      .put('/api/circuits/5eed3357725afd09805b72c9')
      .set({ authToken })
      .send({
        name: 'Bodybuilder Editado',
        exercises: [{
          exercise: '5ef790361968bd468a6f9ddb',
          repetitions: 25,
          weight: 100,
        }],
      });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);
    done();
  });

  it('should delete the circuit successfully', async (done) => {
    const response = await request(app)
      .get('/api/circuits/5eed3357725afd09805b72c7').set({ authToken });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .delete('/api/circuits/5eed3357725afd09805b72c7').set({ authToken });

    expect(response2.status).toBe(200);

    const response3 = await request(app)
      .get('/api/circuits/5eed3357725afd09805b72c7').set({ authToken });

    expect(response3.status).toBe(404);

    done();
  });

  it('should return route not found (aka 404) on delete', async (done) => {
    const response = await request(app)
      .delete('/api/circuits/5eed3357725afd09805b72c4').set({ authToken });

    expect(response.status).toBe(404);
    expect(response.body.errorCode).toBe(errors.RESOURCE_NOT_IN_DATABASE);

    done();
  });
});
