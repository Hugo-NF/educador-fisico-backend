const request = require('supertest');
const app = require('../src/app');

const Exercise = require('../src/models/Exercise');
const { Console } = require('winston/lib/winston/transports');

// Volume feature
describe('Volume', () => {
    it('should register a new volume successfully', async (done) => {
        const response = await request(app)
            .post('/api/volume/create')
            .send({
                repetition: 20,
                charge: 2,
                exercise: "5eed3320725afd09805b72c6",
                observation: "Fazer a última até cansar"
            });

        expect(response.status).toBe(200);
        expect(response.body.data.volume).toHaveProperty("_id");
        done();
    }),

    it('should return the volume successfully', async (done) => {

        const response = await request(app)
            .get('/api/volume/5eed3357725afd09805b72c7');

        expect(response.status).toBe(200);
        expect(response.body.data).toHaveProperty("volume");
        done();
    }),

    it('should edit the volume successfully', async (done) => {

        const response = await request(app)
            .get('/api/volume/5eed3357725afd09805b72c7');

        expect(response.status).toBe(200);

        const response2 = await request(app)
            .put('/api/volume/5eed3357725afd09805b72c7')
            .send({
                repetition: response.body.data.volume.repetition + 10,
                charge: response.body.data.volume.charge + 5,
                observation: "Trocou o exercício",
                exercise: "5eed3be55d28c2255016b868"
            });

        expect(response2.status).toBe(200);
        expect(response2.body.data.volume._id).toBe(response.body.data.volume._id);
        expect(response2.body.data.volume.repetition).not.toBe(response.body.data.volume.repetition);
        expect(response2.body.data.volume.charge).not.toBe(response.body.data.volume.charge);
        expect(response2.body.data.volume.observation).not.toBe(response.body.data.volume.observation);
        expect(response2.body.data.volume.exercise).not.toBe(response.body.data.volume.exercise);
        done();
    }),

    it('should delete the volume successfully', async (done) => {

        const response = await request(app)
            .get('/api/volume/5eed3357725afd09805b72c7');

        expect(response.status).toBe(200);

        const response2 = await request(app)
            .delete('/api/volume/5eed3357725afd09805b72c7');

        expect(response2.status).toBe(200);

        const response3 = await request(app)
            .get('/api/volume/5eed3357725afd09805b72c7');

        expect(response3.status).toBe(200);
        expect(response3.body.data.volume).toBe(null);

        done();
    }),

    it('should not create volume without attr required', async (done) => {

        const response = await request(app)
        .post('/api/volume/create')
        .send({
            repetition: 20,
            charge: 2,
            observation: "Mandando sem exercício"
        });

        expect(response.status).toBe(400);

        const response2 = await request(app)
            .post('/api/volume/create')
            .send({
                charge: 2,
                exercise: "5eed3320725afd09805b72c6",
                observation: "Mandando sem repetição"
            });

        expect(response2.status).toBe(400);
        done();
    })
});