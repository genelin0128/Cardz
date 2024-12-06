const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        avatar: {
            type: String,
            default: "https://storage.hash.cloud/RiY0NzwV36bH4Za01iJMHsv6MSR2/COMP531//IMG-35.jpeg"
        },
        firstName: {
            type: String,
            required: [true, 'Please enter a first name'],
        },
        lastName: {
            type: String,
            required: [true, 'Please enter a last name'],
        },
        email: {
            type: String,
            unique: false
        },
        dateOfBirth: {
            type: Date,
            default: '2000-01-01'
        },
        phoneNumber: {
            type: String,
            required: true
        },
        zipcode: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: [true, 'Please enter a username'],
            unique: true
        },
        password: {
            type: String,
            // required: [true, 'Please enter a password'],
        },
        salt: {
            type: String,
            // required: true
        },
        status: {
            type: String,
            default: ''
        },
        followingUsers: [
            {
                type: String
            }
        ],
        thirdParty: {
            google: {
                type: String,
                required: false
            }
        }
    },
    {
        timestamps: true
    }
)

// creates a model named 'User' based on the 'userSchema'
const User = mongoose.model('User', userSchema);

// exports the 'User' model, making it accessible in other files
module.exports = User;