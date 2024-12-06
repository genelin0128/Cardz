const crypto = require('crypto');
const md5 = require('md5');
const User = require('../models/userModel');
const cors = require('cors');
const Post = require("../models/postModel");

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


async function checkIfThirdPartyAccountExist (req, res) {
    try {
        const { thirdPartyAccount } = req.params;

        const user = await User.findOne({
            'thirdParty.google': thirdPartyAccount
        });

        if (user) {
            return res.status(200).json({
                exist: true,
                username: user.username,
            });
        }
        else {
            return res.status(200).json({
                exist: false,
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkIfSameEmailExist (req, res) {
    try {
        const { thirdPartyAccount } = req.params;

        const user = await User.findOne({
            email: thirdPartyAccount
        });

        if (user) {
            return res.status(200).json({
                exist: true,
                message: 'Do you want to link this account with a third-party?',
                avatar: user.avatar,
                username: user.username
            });
        }
        else {
            return res.status(200).json({
                exist: false
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// --------------------------------------------------------------------



function isLoggedIn (req, res, next) {

    if (!req.session.user) {
        return res.status(401).send('Not authorized '+req.session);
    }
    next();
}

async function login (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await User.findOne({ username }).lean();
        if (!user) {
            return res.status(401).send('User not found');
        }

        const hash = md5(user.salt + password);
        if (hash !== user.password) {
            return res.status(401).send('Incorrect password');
        }

        req.session.user = user;

        return res.status(200).send({ ...user, result: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function loginAndLinkWithThirdParty (req, res) {
    const { username, password, thirdPartyAccount } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const user = await User.findOne({ username }).lean();
        if (!user) {
            return res.status(401).send('User not found');
        }

        const hash = md5(user.salt + password);
        if (hash !== user.password) {
            return res.status(401).send('Incorrect password');
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { $set: { 'thirdParty.google': thirdPartyAccount } },
            { new: true }
        ).lean();

        if (!updatedUser) {
            return res.status(401).send('User not found');
        }

        req.session.user = updatedUser;

        // return res.status(200).send({ username: user.username, result: 'success' });
        return res.status(200).send({ ...updatedUser, result: 'Third party account successfully linked' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function register (req, res) {
    const { email, username, password } = req.body;

    if (!username || !password || !email) {
        return res.status(400).send('Username, password, and email are required');
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] }).lean();
        if (existingUser) {
            return res.status(400).send('Username or email already in use');
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = md5(salt + password);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
            status: `This is ${username}.`,
            salt,
        });

        await User.create(newUser);
        const user = await User.findOne({ username }).lean();

        req.session.user = user;

        // return res.status(201).send({ username: user.username, result: 'success' });
        return res.status(200).send({ ...user, result: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function password (req, res) {
    const { password } = req.body;

    if (!password) {
        return res.status(400).send('New password are required');
    }

    try {
        const currentUser = req.session.user;

        const newSalt = crypto.randomBytes(16).toString('hex');
        const newHash = md5(newSalt + password);

        await User.findByIdAndUpdate(currentUser._id, {
            password: newHash,
            salt: newSalt
        });

        req.session.user.password = newHash;
        req.session.user.salt = newSalt;

        return res.status(200).send({ result: 'success', message: 'Password updated successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function logout (req, res) {
    try {
        req.session.destroy(async (err) => {
            if (err) {
                return res.status(500).json({message: 'Could not log out'});
            }
            res.clearCookie('connect.sid'); // clear the session cookie
            return res.status(200).send({result: 'success', message: 'Logged out successfully'});
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getRandomPosts(req, res) {
    try {
        const randomPosts = await Post.aggregate([
            { $sample: { size: 10 } }
        ]);

        if (randomPosts.length === 0) {
            return res.status(404).json({ message: "No posts found in the database." });
        }

        res.status(200).json(randomPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPostsFromNewestToOldest(req, res) {
    try {
        const newlyAddedPosts = await Post.find()
            .sort({ createdAt: -1 })
            .limit(50);

        if (newlyAddedPosts.length === 0) {
            return res.status(404).json({ message: "No posts found." });
        }

        res.status(200).json(newlyAddedPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getProfile (req, res) {
    try {
        const { username } = req.params;

        // select only username, status and avatar fields
        const projection = { username: 1, status: 1, avatar: 1 };

        // return username, status and avatar for a specific user
        const user = await User.findOne({ username }, projection);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function checkEmail(req, res) {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(200).json({
                message: "Email already in use",
                username: user.username,
            });
        }
        return res.status(400).json(email);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function checkUsername(req, res) {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (user) {
            return res.status(404).json({ message: "Username already in use" });
        }
        return res.status(200).json(username);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function registerWithThirdParty (req, res) {

    const { username, password } = req.body;

    if (!username) {
        return res.status(400).send('Username are required');
    }

    try {

        const existingUser = await User.findOne({ username }).lean();

        if (existingUser) {
            return res.status(400).send('Username already in use');
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = md5(salt + password);

        const newUser = new User({
            ...req.body,
            password: hashedPassword,
            status: `This is ${username}.`,
            salt,
        });

        await User.create(newUser);
        const user = await User.findOne({ username }).lean();

        req.session.user = user;

        // return res.status(201).send({ username: user.username, result: 'success' });
        return res.status(200).send({ ...user, result: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function clearEmail (req, res) {
    try {
        const { username } = req.params;
        const result = await User.findOneAndUpdate(
            { username },
            { $set: { email: "" } },
            {
                runValidators: false,
            }
        );

        if (!result) {
            return res.status(404).send({ message: 'User not found or email already cleared.' });
        }

        return res.status(200).send({ message: 'Email field cleared successfully.' });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

async function loginWithThirdParty (req, res) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).send('Username is required');
    }

    try {
        const user = await User.findOne({ username }).lean();
        if (!user) {
            return res.status(401).send('User not found');
        }

        req.session.user = user;

        return res.status(200).send({ ...user, result: 'success' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.REACT_APP_BACKEND_URL}/google/callback`,
    passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {

    try {
        if (request.session.user) {
            request.session.user.tmpEmail = profile.email;
        }

        return done(null, request.session.user || { tmpEmail: profile.email });
    }
    catch (error) {
        return done(error, null);
    }
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});


module.exports = (app) => {

    app.get('/auth/google',
        passport.authenticate('google', { scope: ['email'] })
    );

    app.get('/google/callback',
        passport.authenticate('google', {
            failureRedirect: `${process.env.REACT_APP_FRONTEND_URL}`,
        }), (req, res) => {
            if (req.user.tmpEmail) {
                req.session.googleEmail = req.user.tmpEmail
            }
            else {
                req.session.googleEmail = req.session.user.tmpEmail;
            }

            req.session.user = req.user;

            res.send(`
                <html>
                    <script>
                        window.opener.postMessage('loginSuccess', '*');
                        window.close();
                    </script>
                </html>
            `);
        }
    );



    app.get('/auth/thirdParty/checkIfThirdPartyAccountExist/:thirdPartyAccount', checkIfThirdPartyAccountExist);
    app.get('/auth/thirdParty/checkIfSameEmailExist/:thirdPartyAccount', checkIfSameEmailExist)


    app.get('/auth/google/email', (req, res) => {
        if (req.session.googleEmail) {
            return res.status(200).json({ email: req.session.googleEmail });
        }
        return res.status(404).json({ message: 'No Google email found' });
    });

    app.post('/auth/google/email/clear', (req, res) => {
        if (req.session.googleEmail) {
            if (req.session.passport) {
                delete req.session.passport.user;
            }
            delete req.session.googleEmail;
            req.session.user.thirdParty = {};
            return res.status(200).json({ message: 'Email cleared' });
        }
        return res.status(404).json({ message: 'No Google email found' });
    });



    app.post('/login', login);
    app.post('/loginWithThirdParty', loginWithThirdParty);
    app.post('/loginAndLinkWithThirdParty', loginAndLinkWithThirdParty);
    app.post('/register', register);
    app.post('/registerWithThirdParty', registerWithThirdParty);
    app.post('/register/checkEmail/:email', checkEmail);

    app.post('/register/checkUsername/:username', checkUsername);
    app.get('/articles/posts/randomPosts', getRandomPosts);
    app.get('/articles/posts/newestToOldest', getPostsFromNewestToOldest);
    app.get('/profile/user/:username', getProfile);
    app.patch('/register/clearEmail/:username', clearEmail);

    app.use(isLoggedIn);

    app.put('/password', password);
    app.put('/logout', logout);
};
