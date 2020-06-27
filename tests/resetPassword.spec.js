const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorsEnum');

const User = require('../src/models/User');

describe('Reset Password', () => {
  it('should reset password successfully', async (done) => {
    // Request password reset e-mail
    let response = await request(app)
      .post('/api/users/password/reset')
      .send({
        email: 'hugonfonseca@hotmail.com',
        sandboxMode: true,
      });

    expect(response.status).toBe(200);

    const user = await User.findOne({ email: 'hugonfonseca@hotmail.com' });
    response = await request(app)
      .post(`/api/users/password/reset/${user.resetPasswordToken}`)
      .send({
        password: 'ABCDEFGH',
      });
    expect(response.status).toBe(200);

    response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'hugonfonseca@hotmail.com',
        password: 'ABCDEFGH',
      });

    expect(response.status).toBe(200);

    done();
  });

  it('should return unknown token', async (done) => {
    // Request password reset e-mail
    let response = await request(app)
      .post('/api/users/password/reset')
      .send({
        email: 'hugomanual@hotmail.com',
        sandboxMode: true,
      });

    expect(response.status).toBe(200);

    const user = await User.findOne({ email: 'hugomanual@hotmail.com' });
    response = await request(app)
      .post(`/api/users/password/reset/${user.resetPasswordToken}wrong`)
      .send({
        password: 'ABCDEFGH',
      });
    expect(response.status).toBe(409);
    expect(response.body.errorCode).toBe(errors.TOKEN_NOT_GENERATED);

    done();
  });

  it('should return invalid token', async (done) => {
    // Request password reset e-mail
    let response = await request(app)
      .post('/api/users/password/reset')
      .send({
        email: 'hugomixado@hotmail.com',
        sandboxMode: true,
      });

    expect(response.status).toBe(200);

    const user = await User.findOne({ email: 'hugomixado@hotmail.com' });
    response = await request(app)
      .post(`/api/users/password/reset/${user.resetPasswordToken}`)
      .send({
        password: 'ABCDEFGH',
      });
    expect(response.status).toBe(200);

    response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'hugomixado@hotmail.com',
        password: 'ABCDEFGH',
      });

    expect(response.status).toBe(200);

    response = await request(app)
      .post(`/api/users/password/reset/${user.resetPasswordToken}`)
      .send({
        password: 'ABCDEFGHIJ',
      });
    expect(response.status).toBe(403);
    expect(response.body.errorCode).toBe(errors.TOKEN_EXPIRED);

    done();
  });
});
