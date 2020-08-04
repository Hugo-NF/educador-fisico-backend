const request = require('supertest');
const app = require('../src/app');

// Register feature
describe('Register', () => {
  it('should register a new user successfully', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@gmail.com',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: 'Male',
        phone: { type: 'Mobile', number: '+55 (61) 99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('_id');
    done();
  });

  it('should return database uniqueness error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@hotmail.com',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: 'Male',
        phone: { type: 'Mobile', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should return validation error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: 'Masculino',
        phone: { type: 'Mobile', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should return validation error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@hotmail.com',
        password: '123456',
        birthDate: new Date(1998, 6, 15),
        sex: 'Masculino',
        phone: { type: 'Movel', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should return validation error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@gmail.com',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: '',
        phone: { type: 'Mobile', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should return validation error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@gmail.com',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: 'Male',
        phone: { type: 'Mobile', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'AR',
      });

    expect(response.status).toBe(400);
    done();
  });

  it('should return validation error', async (done) => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Hugo Fonseca',
        email: 'hugonfonseca@gmail.com',
        password: '123456789',
        birthDate: new Date(1998, 6, 15),
        sex: 'Male',
        phone: { type: 'Mobiles', number: '+55(61)99110-1515' },
        city: 'Ceilândia',
        state: 'DF',
      });

    expect(response.status).toBe(400);
    done();
  });
});
