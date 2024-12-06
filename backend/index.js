require('dotenv').config();
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5500;
const databaseUrl = process.env.MONGODB_URI;

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(cookieParser());
app.use(session({
    secret: crypto.randomBytes(64).toString('hex'),
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 3600000,    // 1 hour
        sameSite: 'none',
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


require('./src/dataPopulation')(app);
require('./src/auth')(app);
require('./src/articles')(app);
require('./src/profile')(app);
require('./src/following')(app);

mongoose
    .connect(databaseUrl)
    .then(() => {
        console.log('connected to MongoDB')
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });