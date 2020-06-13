const request = require('supertest');
const app = require('../src/app');
const errors = require('../src/config/errorsEnum');

const UsersHelper = require('../src/helpers/UsersHelper');

async function mockRoute(request, response) {
    return response.json({statusCode: 200, message: "authorized"});
}

beforeAll(() => {
    app.get('/exercises', UsersHelper.authorize("ManageExercises"), mockRoute);
    app.get('/training', UsersHelper.authorize("ManageTraining"), mockRoute);
    app.get('/students', UsersHelper.authorize("ManageStudents"), mockRoute);
    app.get('/permissions', UsersHelper.authorize("ManagePermissions"), mockRoute);
});


describe('Authorization', () => {
    
    it('should authorize - role based', async (done) => {
        let response = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugonfonseca@hotmail.com", // Admin (ETSP)
                password: "123456789"
            });

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("auth-token");

        response = await request(app)
            .get('/exercises')
            .set({"auth-token": response.body.data['auth-token']})

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("authorized");

        done();
    }),

    it('should reject - jwt missing', async (done) => {
        const responseRoute1 = await request(app)
            .get('/exercises')

        expect(responseRoute1.status).toBe(401);
        expect(responseRoute1.body.errorCode).toBe(errors.MISSING_AUTH_TOKEN);
        done();
    }),

    it('should reject - jwt payload compromissed', async (done) => {
        const responseRoute1 = await request(app)
            .get('/exercises')
            .set({"auth-token": 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI4NzE5ZDA4ZS03OGNlLTRjODAtYjkzNi03MWIyYTI1OGNiZDUiLCJpYXQiOjE1OTIwMTA4NzcsImV4cCI6MTU5NDYwMjg3N30.w5Ap6DoAIlmUolHgh5ZmsR8nNjRBOOXTtJiXBdqq1Gk'})

        expect(responseRoute1.status).toBe(401);
        expect(responseRoute1.body.errorCode).toBe(errors.JWT_FORGED);
        done();
    }),

    it('should reject 1 and authorize the remaining - claim based', async (done) => {
        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugomanual@hotmail.com", // Manual (ETS)
                password: "123456789"
            });
        
        expect(login.status).toBe(200);
        expect(login.body.data).toHaveProperty("auth-token");
        
        const responseRoute1 = await request(app)
            .get('/exercises')
            .set({"auth-token": login.body.data['auth-token']})

        expect(responseRoute1.status).toBe(200);
        expect(responseRoute1.body.message).toBe("authorized");

        const responseRoute2 = await request(app)
            .get('/permissions')
            .set({"auth-token": login.body.data['auth-token']})

        expect(responseRoute2.status).toBe(403);

        done();
    }),

    it('should authorize both - mixed', async (done) => {
        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: "hugomixado@hotmail.com", // Manual (P) + Teacher (ETS)
                password: "123456789"
            });

        expect(login.status).toBe(200);
        expect(login.body.data).toHaveProperty("auth-token");
        
        const responseRoute1 = await request(app)
            .get('/exercises')
            .set({"auth-token": login.body.data['auth-token']})

        expect(responseRoute1.status).toBe(200);
        expect(responseRoute1.body.message).toBe("authorized");

        const responseRoute2 = await request(app)
            .get('/permissions')
            .set({"auth-token": login.body.data['auth-token']})

        expect(responseRoute2.status).toBe(200);
        expect(responseRoute2.body.message).toBe("authorized");

        done();
    })
});