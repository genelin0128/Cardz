const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel');

describe('profile', () => {
    let app;
    let mongoServer;
    let realData;
    let cookie;

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://cl222:cl222@cluster0.09egy.mongodb.net/COMP531');

        realData = await User.find({});
        await mongoose.disconnect();

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use(cookieParser());
        require('./auth')(app);
        require('./profile')(app);

        if (realData.length > 0) {
            await User.insertMany(realData);
        }

        const loginResponse = await request(app)
            .post('/login')
            .send({
                username: 'Bret',
                password: 'Kulas Light'
            });

        cookie = loginResponse.headers['set-cookie'];
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('GET /headline', async () => {
        const response = await request(app)
            .get('/headline')
            .set('Cookie', cookie);

        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(10);

        expect(response.body[0]._id).toBeDefined();
        expect(response.body[0].username).toBeDefined();
        expect(response.body[0].status).toBeDefined();
    });

    it('GET /headline/:username', async () => {
        const response = await request(app)
            .get('/headline/Bret')
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            _id: '6732e93fbaf5e11b49adfb1c',
            username: 'Bret',
            status: 'Multi-layered client-server neural-net'
        });
    });


});