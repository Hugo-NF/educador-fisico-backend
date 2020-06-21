const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorsEnum');

const User = require('../src/models/User');

describe('Account Activation', () => {

    it('should activate account successfully', async (done) => {
        // Request e-mail to be sent
        let response = await request(app)
            .post('/api/users/activate')
            .send({
                email: "hugonfonseca@hotmail.com",
                sandboxMode: true // Prevents the email dispatch, thus preventing consumption while testing
            });

        expect(response.status).toBe(200);
        
        let user = await User.findOne({email: 'hugonfonseca@hotmail.com'});
        expect(user.emailConfirmed).toBe(false);

        response = await request(app)
            .get(`/api/users/activate/${user.emailConfirmationToken}`);

        user = await User.findOne({email: 'hugonfonseca@hotmail.com'});
        expect(user.emailConfirmed).toBe(true);

        done();
    });

    it('should return unknown token', async (done) => {
        // Request e-mail to be sent
        let response = await request(app)
            .post('/api/users/activate')
            .send({
                email: "hugomanual@hotmail.com",
                sandboxMode: true // Prevents the email dispatch, thus preventing consumption while testing
            });

        expect(response.status).toBe(200);
        
        let user = await User.findOne({email: 'hugomanual@hotmail.com'});
        expect(user.emailConfirmed).toBe(false);

        response = await request(app)
            .get(`/api/users/activate/${user.emailConfirmationToken}wrong`);

        expect(response.status).toBe(409);
        expect(response.body.errorCode).toBe(errors.TOKEN_NOT_GENERATED);

        done();
    });

});