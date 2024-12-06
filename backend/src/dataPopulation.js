const crypto = require('crypto');
const md5 = require('md5');
const User = require("../models/userModel");
const Post = require("../models/postModel");
const Profile = require("../models/profileModel");

// add a new user
async function addAUser(req, res) {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = md5(salt + req.body.password);

        const newUser = {
            ...req.body,
            password: hashedPassword,
            salt: salt
        };

        const user = await User.create(newUser);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add multiple users
async function addMultipleUsers(req, res) {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            message: "Request body must be an array of users"
        });
    }

    try {
        const results = {
            success: [],
            errors: []
        };

        for (const userData of req.body) {
            try {
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = md5(salt + userData.password);

                const newUser = {
                    ...userData,
                    password: hashedPassword,
                    salt: salt
                };

                const user = await User.create(newUser);
                results.success.push(user);
            }
            catch (error) {
                results.errors.push({
                    ...userData,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            message: `Successfully created ${results.success.length} users, failed ${results.errors.length} users`,
            results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get all users
async function getAllUsers(req, res) {
    try {
        // the {} is an empty filter object, which means "find all documents."
        const users = await User.find({});
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add a post
async function addAPost(req, res) {
    try {
        const post = await Post.create(req.body);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add multiple posts
async function addMultiplePosts(req, res) {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            message: "Request body must be an array of posts"
        });
    }

    try {
        const results = {
            success: [],
            errors: []
        };

        for (const postData of req.body) {
            try {
                const post = await Post.create(postData);
                results.success.push(post);
            }
            catch (error) {
                results.errors.push({
                    ...postData,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            message: `Successfully created ${results.success.length} posts, failed ${results.errors.length} posts`,
            results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllPosts(req, res) {
    try {
        // the {} is an empty filter object, which means "find all documents."
        const posts = await Post.find({});
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// add multiple users into Profile
async function addMultipleUsersIntoProfile(req, res) {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({
            message: "Request body must be an array of users"
        });
    }

    try {
        const results = {
            success: [],
            errors: []
        };

        for (const userData of req.body) {
            try {
                const salt = crypto.randomBytes(16).toString('hex');
                const hashedPassword = md5(salt + userData.password);

                const newUser = {
                    ...userData,
                    password: hashedPassword,
                    salt: salt
                };

                const user = await Profile.create(newUser);
                results.success.push(user);
            }
            catch (error) {
                results.errors.push({
                    ...userData,
                    error: error.message
                });
            }
        }

        res.status(200).json({
            message: `Successfully created ${results.success.length} users, failed ${results.errors.length} users`,
            results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = (app) => {

    app.post('/user', addAUser);
    app.post('/multipleUsers', addMultipleUsers);
    app.get('/users', getAllUsers);
    app.post('/addAPost', addAPost);
    app.post('/addMultiplePosts', addMultiplePosts);
    app.get('/posts', getAllPosts);
    app.post('/profile/multipleUsers', addMultipleUsersIntoProfile);

}