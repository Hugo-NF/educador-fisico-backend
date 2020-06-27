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

// Exercise feature
describe('Exercise CRUD', () => {
  it('should register a new exercise successfully', async (done) => {
    const response = await request(app)
      .post('/api/exercises/create')
      .set({
        'auth-token': authToken,
      })
      .send({
        name: 'Elevação Lateral',
        video: 'youtube.com/elevacao-lateral',
      });

    expect(response.status).toBe(200);
    expect(response.body.data.exercise).toHaveProperty('_id');
    done();
  });

  it('should return the exercise successfully', async (done) => {
    const response = await request(app)
      .get('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('exercise');
    done();
  });

  it('should edit the exercise successfully', async (done) => {
    const response = await request(app)
      .get('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .put('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      })
      .send({
        name: response.body.data.exercise.name + 10,
        video: response.body.data.exercise.video + 5,
      });

    expect(response2.status).toBe(200);
    expect(response2.body.data.exercise._id).toBe(response.body.data.exercise._id);
    expect(response2.body.data.exercise.name).not.toBe(response.body.data.exercise.name);
    expect(response2.body.data.exercise.video).not.toBe(response.body.data.exercise.video);
    done();
  });

  it('should delete the exercise successfully', async (done) => {
    const response = await request(app)
      .get('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      });

    expect(response.status).toBe(200);

    const response2 = await request(app)
      .delete('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      });

    expect(response2.status).toBe(200);

    const response3 = await request(app)
      .get('/api/exercises/5eed3320725afd09805b72c6')
      .set({
        'auth-token': authToken,
      });

    expect(response3.status).toBe(404);

    done();
  });
});
