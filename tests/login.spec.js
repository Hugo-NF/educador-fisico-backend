const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorsEnum');

const User = require('../src/models/User');

// Login feature
describe('Login', () => {
    it('should login the user successfully', async (done) => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugonfonseca@hotmail.com", // Account present in seed.js
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
                password: "12345678" // Wrong password
            });

        expect(response.status).toBe(401);
        expect(response.body.errorCode).toBe(errors.WRONG_PASSWORD);
        done();
    }),

    it('should return validation error', async(done) => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "hugonfonseca", // Not an email
            password: "12345678"
        });

        expect(response.status).toBe(400);
        done();
    }),

    it('should say unknown user', async(done) => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "hugoinexistent@hotmail.com", //Email does not exist
            password: "123456789"
        });

        expect(response.status).toBe(409);
        expect(response.body.errorCode).toBe(errors.USER_NOT_IN_DATABASE);
        done();
    }),

    it('should block my account', async(done) => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "hugoquaselockado@hotmail.com", // Account has just one attempt remaining
            password: "12345678" // Wrong password.
        });

        expect(response.status).toBe(401);
        expect(response.body.errorCode).toBe(errors.ACCESS_FAILED_LIMIT_REACHED);
        done();
    }),

    it('should say that my account is blocked', async(done) => {
        const response = await request(app)
        .post('/api/users/login')
        .send({
            email: "hugolockado@hotmail.com", // Account has just one attempt remaining
            password: "12345678" // Password is dont care
        });

        expect(response.status).toBe(401);
        expect(response.body.errorCode).toBe(errors.ACCOUNT_LOCK_OUT);
        done();
    }),

    it('should reset my access count', async(done) => {
        let user = await User.findOne({email: "hugomatchespassword@hotmail.com"});
        expect(user.accessFailedCount).toBe(9);

        const response = await request(app)
        .post('/api/users/login')
        .send({
            "email": "hugomatchespassword@hotmail.com", // Has mistaken attempts before
            "password": "123456789", // Correct password
        });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("auth-token");

        user = await User.findOne({email: "hugomatchespassword@hotmail.com"});
        expect(user.accessFailedCount).toBe(0);

        done();
    })
});