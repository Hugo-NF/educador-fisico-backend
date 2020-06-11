const request = require('supertest');
const app = require('../src/app');

// Login feature
describe('Login', () => {
    it('should login the user successfully', async (done) => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugonfonseca@hotmail.com",
                password: "123456789"
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("auth-token");
        done();
    }),

    it('should return wrong credentials', async (done) => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugonfonseca@hotmail.com",
                password: "12345678"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("Wrong credentials");
        done();
    }),

    it('should return validation error', async(done) => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "hugonfonseca",
            password: "12345678"
        });

        expect(response.status).toBe(400);
        done();
    })
});