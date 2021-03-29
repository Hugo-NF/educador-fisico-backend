const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorCodes');

describe('Authorization', () => {
  it('should authorize - role based', async (done) => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'hugonfonseca@hotmail.com', // Admin (ETSP)
        password: '123456789',
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('authToken');

    const response1 = await request(app)
      .post('/api/exercises/')
      .set({ Authorization: response.body.data.authToken });

    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post('/api/exercises/')
      .set({ Authorization: `Bearer ${response.body.data.authToken}` });

    expect(response2.status).toBe(200);
    done();
  });

  it('should reject - jwt missing', async (done) => {
    const responseRoute1 = await request(app)
      .post('/api/exercises/');

    expect(responseRoute1.status).toBe(401);
    expect(responseRoute1.body.errorCode).toBe(errors.MISSING_AUTH_TOKEN);
    done();
  });

  it('should reject - jwt payload compromissed', async (done) => {
    const responseRoute1 = await request(app)
      .post('/api/exercises/')
      .set({ Authorization: 'Bearer yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4NzE5ZDA4ZS03OGNlLTRjODAtYjkzNi03MWIyYTI1OGNiZDUiLCJpYXQiOjE1OTIwMTA4NzcsImV4cCI6MTU5NDYwMjg3N30.w5Ap6DoAIlmUolHgh5ZmsR8nNjRBOOXTtJiXBdqq1Gk' });

    expect(responseRoute1.status).toBe(401);
    expect(responseRoute1.body.errorCode).toBe(errors.JWT_FORGED);
    done();
  });

  it('should reject - unauthorized', async (done) => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'hugopermissions@hotmail.com', // Admin (ETSP)
        password: '123456789',
      });

    const responseRoute1 = await request(app)
      .post('/api/exercises/')
      .set({ Authorization: response.body.data.authToken });

    expect(responseRoute1.status).toBe(403);
    expect(responseRoute1.body.errorCode).toBe(errors.UNAUTHORIZED_ROUTE);

    done();
  });

  it('should authorize - self content', async (done) => {
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'hugopermissions@hotmail.com', // Admin (ETSP)
        password: '123456789',
      });

    const responseRoute1 = await request(app)
      .post('/api/health/')
      .set({ Authorization: response.body.data.authToken });

    expect(responseRoute1.status).toBe(200);
    expect(responseRoute1.body).toHaveProperty('data');
    expect(responseRoute1.body.data).toHaveLength(0);

    const responseLogin1 = await request(app)
      .post('/api/users/login')
      .send({
        email: 'ailamar.sedentaria@hotmail.com', // Admin (ETSP)
        password: '123456789',
      });

    const responseRoute2 = await request(app)
      .post('/api/health/')
      .set({ Authorization: responseLogin1.body.data.authToken });

    expect(responseRoute2.status).toBe(200);
    expect(responseRoute2.body).toHaveProperty('data');
    expect(responseRoute2.body.data).toHaveLength(1);

    done();
  });
});
