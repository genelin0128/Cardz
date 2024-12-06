const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            ref: 'User'
        },
        title: {
            type: String
        },
        body: {
            type: String,
            required: true
        },
        ups: [
            {
                username: {
                    type: String,
                    required: true,
                    ref: 'User'
                }
            }
        ],
        comments: [
            {
                username: {
                    type: String,
                    required: true,
                    ref: 'User'
                },
                comment: {
                    type: String,
                    required: true
                },
                createdAt: {
                    type: Date,
                    required: true
                }
            }
        ],
        images: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
);

// creates a model named 'Post' based on the 'postSchema'
const Post = mongoose.model('Post', postSchema);

// exports the 'Post' model, making it accessible in other files
module.exports = Post;
