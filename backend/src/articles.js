const Post = require("../models/postModel");
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
    // IMPORTANT: REMEMBER TO ADD "require('dotenv').config();" IN index.js
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 16 * 1024 * 1024 // 16MB
    }
});

// Cloudinary upload middleware for multiple images
const uploadMultipleImagesToCloudinary = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        req.body.images = [];
        return next();
    }

    try {
        const uploadPromises = req.files.map(file => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'posts'
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );

                uploadStream.end(file.buffer);
            });
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        req.body.images = uploadedUrls;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};

async function getFollowingPostsForLoggedInUser (req, res) {
    try {
        const { _id } = req.query;

        // if _id is provided, get a post by _id
        if (_id) {
            const post = await Post.findById(_id);

            if (!post) {
                return res.status(404).json({ message: `No post found with ID: ${_id}.` });
            }

            // can only view posts from users you follow or your own posts
            if (req.session.user.followingUsers.includes(post.username) || post.username === req.session.user.username) {
                res.status(200).json(post);
            }
            else {
                return res.status(403).json({ message: 'You are not authorized to view posts from users you do not follow.' });
            }
        }
        // if no _id is provided,
        // get all posts where the username is the logged-in user or in the logged-in user's following list
        else if (!_id) {
            const posts = await Post.find({
                $or: [
                    { username: req.session.user.username },
                    { username: { $in: req.session.user.followingUsers } }
                ]
            })
            .sort({ createdAt: -1 });

            return res.status(200).json(posts);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getMyPosts (req, res) {
    try {
        const posts = await Post.find({
            username: req.session.user.username
        })
        .sort({ createdAt: -1 });

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: `No posts found for ${req.session.user.username}.` });
        }
        return res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllPosts (req, res) {
    try {
        // the {} is an empty filter object, which means "find all documents."
        const posts = await Post.find({});
        return res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateAPostById (req, res) {
    try {
        const { _id } = req.params;
        const { title, body, allImages } = req.body;

        const post = await Post.findById(_id);

        if (!post) {
            return res.status(404).json({ message: `No post found with ID: ${_id}.` });
        }

        if (post.username !== req.session.user.username) {
            return res.status(403).json({
                message: "Only the author can modify their own posts."
            });
        }

        const existingImages = JSON.parse(allImages);

        const newUploadedUrls = req.body.images || [];

        // Combine the existing image URLs with the newly uploaded image URLs
        const finalImages = existingImages
            // Ensure only valid image URLs (strings) are kept from the existing images,
            // which means it will remove non-URL items, like file objects
            .filter(img => typeof img === 'string')
            // Add the newly uploaded image URLs to the array
            .concat(newUploadedUrls);

        const updatedPost = await Post.findByIdAndUpdate(
            _id,
            {
                title: title,           // Update the 'title' field from the request body
                body: body,             // Update the 'body' field from the request body
                images: finalImages,    // Update the 'images' field from the request body
            },
            { new: true }               // Return modified document without additional database query
        );

        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteAPostById(req, res) {
    try {
        const { _id } = req.params;

        const post = await Post.findById(_id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${_id}.`
            });
        }

        if (post.username !== req.session.user.username) {
            return res.status(403).json({
                success: false,
                message: "Only the author can delete their own posts."
            });
        }

        const deletedPost = await Post.findByIdAndDelete(_id);

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            deletedPost: deletedPost
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function getPostsByUsername (req, res) {
    try {
        const { username } = req.params;
        const posts = await Post.find({ username });
        if (posts.length === 0) {
            return res.status(404).json({ message: `No posts found for ${username}` });
        }
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPostsByContent (req, res) {
    try {
        const { content } = req.params;

        // use regex to find posts where the 'body' field contains the value of 'content'
        // $options: 'i' case-insensitive
        const posts = await Post.find({
            body: { $regex: content, $options: 'i' }
        })
        .sort({ createdAt: -1 });

        if (posts.length === 0) {
            return res.status(404).json({ message: `No posts found matching the content: "${content}".` });
        }
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// get posts created within the last hour
async function getNewlyAddedPosts (req, res) {
    try {

        const currentTime = new Date();
        const oneHourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);

        const newlyAddedPosts = await Post.find({
            // Only select posts where createdAt is greater than or equal to one hour ago
            createdAt: { $gte: oneHourAgo }
        });

        if (newlyAddedPosts.length === 0) {
            return res.status(404).json({ message: "No newly added posts within the last hour." });
        }

        res.status(200).json(newlyAddedPosts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addAPost(req, res) {
    try {
        const postData = {
            ...req.body,
            username: req.session.user.username
        };

        const post = await Post.create(postData);
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getAllCommentsInPostById (req, res) {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${postId}.`
            });
        }
        return res.status(200).json(post.comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function addAComment (req, res) {
    try {
        const { postId } = req.params;
        const { comment } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${postId}.`
            });
        }

        const newComment = {
            username: req.session.user.username,
            comment: comment,
            createdAt: new Date()
        };

        // Add the new comment to the post's comments array
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $push: {
                    comments: newComment
                }
            },
            {
                new: true,              // Return the updated document
                runValidators: true     // Ensure the update passes schema validation
            }
        );

        res.status(200).json({
            success: true,
            message: "Comment added successfully",
            post: updatedPost
        });

    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function updateAComment (req, res) {
    try {
        const { postId } = req.params;
        const { commentId, comment } = req.body;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment is required"
            });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${postId}.`
            });
        }

        const commentToUpdate = post.comments.find(comment => comment._id.toString() === commentId);

        if (!commentToUpdate) {
            return res.status(404).json({
                success: false,
                message: `No comment found with ID: ${commentId}.`
            });
        }

        if (commentToUpdate.username !== req.session.user.username) {
            return res.status(403).json({
                success: false,
                message: "Only the comment author can update their own comments."
            });
        }

        const updatedPost = await Post.findOneAndUpdate(
            {
                _id: postId,
                'comments._id': commentId
            },
            {
                $set: {
                    // The '$' is a positional operator which refers to the first matching element in the 'comments' array.
                    'comments.$.comment': comment
                }
            },
            {
                new: true,              // Return the updated document
                runValidators: true     // Ensure the update passes schema validation
            }
        );

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            post: updatedPost
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function deleteAComment (req, res) {
    try {
        const { postId } = req.params;
        const { commentId } = req.body;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${postId}.`
            });
        }

        // Find the comment
        const comment = post.comments.find(comment => comment._id.toString() === commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: `No comment found with ID: ${commentId}.`
            });
        }

        if (comment.username !== req.session.user.username) {
            return res.status(403).json({
                success: false,
                message: "Only the comment author can delete their own comments."
            });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                $pull: {
                    comments: { _id: commentId }
                }
            },
            {
                new: true,              // Return the updated document
                runValidators: true     // Ensure the update passes schema validation
            }
        );

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            post: updatedPost
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

async function toggleUp(req, res) {
    try {
        const { postId } = req.params;
        const { username } = req.session.user;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: `No post found with ID: ${postId}.`
            });
        }

        // Check if user has already upped the post
        const existingUpIndex = post.ups.findIndex(up => up.username === username);

        let updatedPost;
        // existingUpIndex !== -1, it means the user has already upped the post
        if (existingUpIndex !== -1) {
            // If user has already upped, remove the up
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: {
                        ups: { username: username }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }
        // existingUpIndex === -1, it means the user hasn't upped the post yet
        else {
            // If user hasn't upped, add the up
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $push: {
                        ups: { username: username }
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );
        }

        res.status(200).json({
            success: true,
            message: existingUpIndex !== -1 ? "Up removed successfully" : "Up added successfully",
            post: updatedPost
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = (app) => {

    app.get('/articles/:id?', getFollowingPostsForLoggedInUser);
    app.get('/articles/posts/allPosts', getAllPosts);
    app.get('/articles/posts/myPosts', getMyPosts);

    app.put('/articles/update/:_id',
        upload.array('images'),
        uploadMultipleImagesToCloudinary,
        updateAPostById
    );
    app.delete('/articles/delete/:_id', deleteAPostById);
    app.post('/articles/posts/addAPost',
        upload.array('images'),
        uploadMultipleImagesToCloudinary,
        addAPost
    );

    app.get('/articles/username/:username', getPostsByUsername);
    app.get('/articles/content/:content', getPostsByContent);
    app.get('/articles/newly/addedPosts', getNewlyAddedPosts);

    app.get('/articles/comments/allComments/:postId', getAllCommentsInPostById);
    app.post('/articles/comments/addAComment/:postId', addAComment);
    app.put('/articles/comments/updateAComment/:postId', updateAComment);
    app.delete('/articles/comments/deleteAComment/:postId', deleteAComment);

    app.put('/articles/ups/:postId', toggleUp);
}