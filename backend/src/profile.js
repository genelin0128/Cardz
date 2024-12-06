const User = require("../models/userModel");
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

// Cloudinary upload middleware
const uploadSingleImageToCloudinary = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'avatars',
                    transformation: [
                        {
                            width: 500,     // Fixed width
                            height: 500,    // Fixed height
                            crop: 'fill',   // Keep original aspect ratio
                            gravity: 'face' // Center on the face
                        }
                    ]
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );

            // Send the image buffer to Cloudinary for uploading
            uploadStream.end(req.file.buffer);
        });

        req.body.avatar = uploadResult.secure_url;
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Image upload failed', error: error.message });
    }
};

async function getUserStatus (req, res) {
    try {
        const { username } = req.params;

        // select only username and status fields
        const projection = { username: 1, status: 1 };

        // if username is provided, return status for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, get status for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            return res.status(200).json(users);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserStatus (req, res) {
    try {
        const { status } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { status: status },             // Update the "status" field from the request body
            {
                new: true,                  // Return modified document without additional database query
                select: "username status"   // Only select the "username" and "status" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.status = status;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserEmail (req, res) {
    try {
        const { username } = req.params;

        // select only username and email fields
        const projection = { username: 1, email: 1 };

        // if username is provided, return email for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, return email for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            return res.status(200).json(users);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserEmail (req, res) {
    try {
        const { email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { email: email },               // Update the "email" field from the request body
            {
                new: true,                  // Return modified document without additional database query
                select: "username email"    // Only select the "username" and "email" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.email = email;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserDateOfBirth(req, res) {
    try {
        const { username } = req.params;

        // select only username and status fields
        const projection = { username: 1, dateOfBirth: 1 };

        // if username is provided, return dateOfBirth for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const response = {
                username: user.username,
                dateOfBirth: new Date(user.dateOfBirth).getTime()
            };
            return res.status(200).json(response);
        }
        // if no username is provided, return dateOfBirth for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            const response = users.map(user => ({
                username: user.username,
                dateOfBirth: new Date(user.dateOfBirth).getTime()
            }));
            return res.status(200).json(response);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserDateOfBirth (req, res) {
    try {
        const { dateOfBirth } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { dateOfBirth: dateOfBirth },   // Update the "dateOfBirth" field from the request body
            {
                new: true,                  // Return modified document without additional database query
                select: "username dateOfBirth"      // Only select the "username" and "dateOfBirth" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.dateOfBirth = dateOfBirth;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserZipcode (req, res) {
    try {
        const { username } = req.params;

        // select only username and zipcode fields
        const projection = { username: 1, zipcode: 1 };

        // if username is provided, return zipcode for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, return zipcode for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            return res.status(200).json(users);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserZipcode (req, res) {
    try {
        const { zipcode } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { zipcode: zipcode },           // Update the "zipcode" field from the request body
            {
                new: true,                  // Return modified document without additional database query
                select: "username zipcode"  // Only select the "username" and "zipcode" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.zipcode = zipcode;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserAvatar (req, res) {
    try {
        const { username } = req.params;

        // select only username and avatar fields
        const projection = { username: 1, avatar: 1 };

        // if username is provided, return avatar for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, return avatar for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            return res.status(200).json(users);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserAvatar (req, res) {
    try {
        const { avatar } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { avatar: avatar },             // Update the "avatar" field from the request body
            {
                new: true,                  // Return modified document without additional database query
                select: "username avatar"   // Only select the "username" and "avatar" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.avatar = avatar;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserPhoneNumber (req, res) {
    try {
        const { username } = req.params;

        // select only username and phoneNumber fields
        const projection = { username: 1, phoneNumber: 1 };

        // if username is provided, return phoneNumber for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, return phoneNumber for all users
        else if (!username) {
            const users = await User.find({}, projection);
            if (users.length === 0) {
                return res.status(404).json({ message: "No users found" });
            }
            return res.status(200).json(users);
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function updateUserPhoneNumber (req, res) {
    try {
        const { phoneNumber } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { phoneNumber: phoneNumber },           // Update the "phoneNumber" field from the request body
            {
                new: true,                          // Return modified document without additional database query
                select: "username phoneNumber"      // Only select the "username" and "phoneNumber" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.phoneNumber = phoneNumber;
        return res.status(200).json(updatedUser);
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

async function updateUserFirstName (req, res) {
    try {
        const { firstName } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { firstName: firstName },               // Update the "firstName" field from the request body
            {
                new: true,                          // Return modified document without additional database query
                select: "username firstName"        // Only select the "username" and "firstName" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.firstName = firstName;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateUserLastName (req, res) {
    try {
        const { lastName } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { lastName: lastName },                 // Update the "lastName" field from the request body
            {
                new: true,                          // Return modified document without additional database query
                select: "username lastName"         // Only select the "username" and "lastName" fields to return
            }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        req.session.user.lastname = lastName;
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getProfileBySearchQuery (req, res) {
    try {
        const { query } = req.params;

        // select only username, status and avatar fields
        const projection = { username: 1, status: 1, avatar: 1 };

        // use regex to find users where the 'username' field contains the value of 'query'
        // $options: 'i' case-insensitive
        // return username, status and avatar for a specific user
        const users = await User.find({
            username: { $regex: query, $options: 'i' }
        }, projection);

        if (users.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkThirdPartyLinkStatus (req, res) {
    try {
        const user = await User.findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.thirdParty && user.thirdParty.google) {
            return res.status(200).json({ thirdPartyLinked: true });
        }
        else {
            return res.status(200).json({ thirdPartyLinked: false });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function linkThirdParty(req, res) {
    try {
        const { thirdPartyAccount } = req.params;

        const user = await User.findOne({ username: req.session.user.username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: req.session.user.username },
            { $set: { 'thirdParty.google': thirdPartyAccount } },
            { new: true }
        ).lean();


        req.session.user = updatedUser;

        return res.status(200).json({ ...updatedUser, message: 'Third party account successfully linked' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function unlinkThirdParty (req, res) {
    try {
        const updatedUser = await User.findOneAndUpdate(
            { username: req.session.user.username },
            { $set: { thirdParty: {} } },
            { new: true }
        ).lean();

        req.session.user = updatedUser;

        return res.status(200).json({ ...updatedUser, message: 'Third party account successfully unlinked' });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function checkIfThirdPartyAccountExist (req, res) {
    try {
        const { thirdPartyAccount } = req.params;

        const user = await User.findOne({
            'thirdParty.google': thirdPartyAccount
        });

        if (user) {
            return res.status(200).json({
                available: false,
                message: 'This third-party account is already in use. Please try another one.'
            });
        }
        else {
            return res.status(200).json({
                available: true,
                message: 'This third-party account is not in use'
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = (app) => {

    app.get('/headline/:username?', getUserStatus);
    app.put('/headline/update', updateUserStatus);

    app.get('/email/:username?', getUserEmail);
    app.put('/email/update', updateUserEmail);

    app.get('/dob/:username?', getUserDateOfBirth);
    app.put('/dob/update', updateUserDateOfBirth);

    app.get('/zipcode/:username?', getUserZipcode);
    app.put('/zipcode/update', updateUserZipcode);

    app.get('/avatar/:username?', getUserAvatar);
    app.put('/avatar/update',
        upload.single('avatar'),
        uploadSingleImageToCloudinary,
        updateUserAvatar
    );

    app.get('/phone/:username?', getUserPhoneNumber);
    app.put('/phone/update', updateUserPhoneNumber);


    app.get('/profile/:username', getProfile);

    app.put('/firstname/update', updateUserFirstName);
    app.put('/lastname/update', updateUserLastName);
    app.get('/profile/search/:query', getProfileBySearchQuery);

    app.get('/profile/thirdParty/checkThirdPartyLinkStatus', checkThirdPartyLinkStatus);
    app.get('/profile/thirdParty/checkIfThirdPartyAccountExist/:thirdPartyAccount', checkIfThirdPartyAccountExist);
    app.put('/profile/thirdParty/linkAccount/:thirdPartyAccount', linkThirdParty);
    app.put('/profile/thirdParty/unlinkAccount', unlinkThirdParty);
}