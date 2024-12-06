const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
    {

        avatar: {
            type: String,
            default: "https://storage.hash.cloud/RiY0NzwV36bH4Za01iJMHsv6MSR2/COMP531//IMG-34.jpeg"
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
            required: [true, 'Please enter an email'],
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
            required: [true, 'Please enter a password'],
        },
        salt: {
            type: String,
            required: true
        },
        status: {
            type: String,
            required: false
        },
        followingUsers: [
            {
                type: String
            }
        ]
    },
    {
        timestamps: true
    }
)

// creates a model named 'Profile' based on the 'profileSchema'
const Profile = mongoose.model('Profile', profileSchema);

// exports the 'Profile' model, making it accessible in other files
module.exports = Profile;