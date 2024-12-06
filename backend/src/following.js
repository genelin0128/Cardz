const User = require("../models/userModel");

async function getUserFollowingUsers (req, res) {
    try {
        const { username } = req.params;

        // select only username and followingUsers fields
        const projection = { username: 1, followingUsers: 1 };

        // if username is provided, return followingUsers for a specific user
        if (username) {
            const user = await User.findOne({ username }, projection);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        }
        // if no username is provided, return followingUsers for all users
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

async function addUserIntoFollowingUsersList (req, res) {
    try {
        const userToFollow = req.params.username;

        // cannot follow yourself
        if (userToFollow === req.session.user.username) {
            return res.status(400).json({
                message: "You cannot follow yourself"
            });
        }

        // check if the user exists in the database
        const userExists = await User.findOne({ username: userToFollow });
        if (!userExists) {
            return res.status(404).json({ message: `${userToFollow} does not exist` });
        }

        // check if the user is already being followed
        if (req.session.user.followingUsers.includes(userToFollow)) {
            return res.status(400).json({ message: `${userToFollow} is already being followed.` });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { $push: { followingUsers: userToFollow } },    // update the "followingUsers" field from the request body
            {
                new: true,                                  // return modified document without additional database query
                select: "username followingUsers"           // only select the "username" and "followingUsers" fields to return
            }
        );

        req.session.user.followingUsers = updatedUser.followingUsers;

        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function removeUserFromFollowingUsersList (req, res) {
    try {
        const userToUnfollow = req.params.username;

        // cannot unfollow yourself
        if (userToUnfollow === req.session.user.username) {
            return res.status(400).json({
                message: "You cannot unfollow yourself"
            });
        }

        // check if the user exists in the database
        const userExists = await User.findOne({ username: userToUnfollow });
        if (!userExists) {
            return res.status(404).json({ message: `${userToUnfollow} does not exist` });
        }

        // check if the user is trying to unfollow someone they are not following
        if (!req.session.user.followingUsers.includes(userToUnfollow)) {
            return res.status(400).json({ message: `You did not follow ${userToUnfollow}.` });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.session.user._id,
            { $pull: { followingUsers: userToUnfollow } },      // Update the "followingUsers" field from the request body
            {
                new: true,                                      // Return modified document without additional database query
                select: "username followingUsers"               // Only select the "username" and "followingUsers" fields to return
            }
        );

        req.session.user.followingUsers = updatedUser.followingUsers;

        return res.status(200).json(updatedUser);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = (app) => {

    app.get('/followingUsers/:username?', getUserFollowingUsers);
    app.put('/followingUsers/followUser/:username', addUserIntoFollowingUsersList);
    app.delete('/followingUsers/unfollowUser/:username', removeUserFromFollowingUsersList);
}