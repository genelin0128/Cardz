const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cookieParser = require('cookie-parser');
const User = require('../models/userModel');
const Post = require('../models/postModel');

describe('articles', () => {
    let app;
    let mongoServer;
    let userRealData;
    let postRealData;
    let cookie;

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://cl222:cl222@cluster0.09egy.mongodb.net/COMP531');

        userRealData = await User.find({});
        postRealData = await Post.find({});
        await mongoose.disconnect();

        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        app = express();
        app.use(express.json());
        app.use(cookieParser());
        require('./auth')(app);
        require('./profile')(app);
        require('./articles')(app);

        if (userRealData.length > 0) {
            await User.insertMany(userRealData);
        }

        if (postRealData.length > 0) {
            await Post.insertMany(postRealData);
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

    it('GET /articles', async () => {
        const response = await request(app)
            .get('/articles')
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
        expect(response.body.length).toBeGreaterThanOrEqual(30);

        expect(response.body[0]._id).toBeDefined();
        expect(response.body[0].username).toBeDefined();
        expect(response.body[0].title).toBeDefined();
        expect(response.body[0].body).toBeDefined();
        expect(response.body[0].likes).toBeDefined();
        expect(response.body[0].images).toBeDefined();
        expect(response.body[0].comments).toBeDefined();
    });

    it('GET /articles/:id?', async () => {
        const response = await request(app)
            .get('/articles?_id=6732e99fbaf5e11b49adfb36')
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body._id).toBe('6732e99fbaf5e11b49adfb36');
        expect(response.body.username).toBe('Bret');
        expect(response.body.title).toBe('sunt aut facere repellat provident occaecati excepturi optio reprehenderit');
        expect(response.body.body).toBe('quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto');
    });

    it('POST /articles/posts/addAPost', async () => {
        const response = await request(app)
            .post('/articles/posts/addAPost')
            .set('Cookie', cookie)
            .send(
                {
                    title: 'Post Testing',
                    body: 'Post Testing',
                    images: [
                        'https://storage.hash.cloud/RiY0NzwV36bH4Za01iJMHsv6MSR2/COMP531//IMG-30.jpeg',
                        'https://storage.hash.cloud/RiY0NzwV36bH4Za01iJMHsv6MSR2/COMP531//IMG-33.jpeg'
                    ],
                }
            );

        expect(response.status).toBe(200);
        expect(response.body.username).toBe('Bret');
        expect(response.body.title).toBe('Post Testing');
        expect(response.body.body).toBe('Post Testing');
    });

});