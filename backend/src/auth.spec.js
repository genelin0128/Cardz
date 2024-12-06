const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel');

const JasmineReporters = require('jasmine-reporters');
const path = require('path');

jasmine.getEnv().addReporter(
  new JasmineReporters.JUnitXmlReporter({
    savePath: path.join(__dirname, '..', 'junit-xml-test-results'),
    consolidateAll: true,
    filePrefix: 'junit-xml-test-results',
    useFullTestName: true,
    reportFailedUrl: true
  })
);

describe('auth', () => {
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

        if (realData.length > 0) {
            await User.insertMany(realData);
        }
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    it('POST /register', async () => {
        const response = await request(app)
            .post('/register')
            .send(
                {
                    firstName: 'TestABCD',
                    lastName: 'TestABCD',
                    email: 'testabcd@rice.edu',
                    dateOfBirth: '2000-01-01',
                    phoneNumber: '000000000',
                    zipcode: '00000',
                    username: 'TestABCD',
                    password: 'TestABCD',
                    status: 'TestABCD.'
                }
            );

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            username: 'TestABCD',
            result: 'success'
        });

        const loginResponse = await request(app)
            .post('/login')
            .send(
                {
                    username: 'TestABCD',
                    password: 'TestABCD'
                }
            );

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toEqual({
            username: 'TestABCD',
            result: 'success'
        });
    });

    it('POST /login', async () => {
        const response = await request(app)
            .post('/login')
            .send(
                {
                    username: 'Bret',
                    password: 'Kulas Light'
                }
            );

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            username: 'Bret',
            result: 'success'
        });
    });

    it('PUT /logout', async () => {
        const loginResponse = await request(app)
            .post('/login')
            .send(
                {
                    username: 'Bret',
                    password: 'Kulas Light'
                }
            );

        cookie = loginResponse.headers['set-cookie'];

        const logoutResponse = await request(app)
            .put('/logout')
            .set('Cookie', cookie);

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body).toEqual({
            result: 'success',
            message: 'Logged out successfully'
        });
    });
});