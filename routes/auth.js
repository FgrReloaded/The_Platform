const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dotenv = require('dotenv');
const fetchuser = require('../middleware/fetchuser');
dotenv.config();


// Create a user
const JWT_TOKEN = process.env.JWT_TOKEN


// get user data
router.get("/getUser", fetchuser, async (req, res) => {
    try {
        const username = req.query.profile;
        // get user data except password
        const user = await User.findOne({ username }).select("-password");

        if (!user) {
            return res.status(404).json("Not Found")
        }

        res.status(200).json({ user, success: true })
    } catch (error) {
        console.error(error.message);
    }
});


router.post(
    "/createuser",
    [
        body("fullname", "Name cointain atleast 5 characters").isLength({ min: 5 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password conatin atleast 8 characters").isLength({ min: 8 }),
    ],
    async (req, res) => {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        let user = await User.findOne({ email: req.body.email });
        let userName = await User.findOne({ username: req.body.username })

        if (userName) {
            return res.status(400).json({ error: "This username has already existed. Try Login", msg: "username" })
        }

        if (user) {
            return res.status(400).json({ error: "This email has already existed. Try Login", msg: "email" })
        }

        user = await User.create(req.body);
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_TOKEN);
        res.status(200).json({ token, user });
    }
);

// Login a user
router.post(
    "/login",
    [
        body("password", "Password conatin atleast 8 characters").isLength({ min: 8 }),
    ],
    async (req, res) => {
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, password } = req.body;
        try {
            let user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ error: "Email or password you enter is incorrect.", msg: "username" })
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ error: "Email or password you enter is incorrect.", msg: "password" })
            }
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, JWT_TOKEN)
            res.status(200).json({ token, user })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server Error Occured")
        }


    }
);

// Update Followers
router.put("/follow", fetchuser, async (req, res, next) => {
    try {
        const { id } = req.user;
        const { profile } = req.query;
        let user = await User.findOne({ username: profile });
        let currentUser = await User.findOne({ _id: id });

        if (!user) {
            return res.status(404).json("Not Found")
        }
        // check if already following
        if (user.followers.includes(id)) {
            // remove the follower
            const index = user.followers.indexOf(id);
            user.followers.splice(index, 1);
            await user.save();
            // update the followers list of the user to be followed
            const index2 = currentUser.following.indexOf(user._id);
            currentUser.following.splice(index2, 1);
            await currentUser.save();
            return res.status(200).json({ success: true, follow: "remove", });
        }
        // add the follower
        currentUser.following.push(user._id);
        await currentUser.save();
        user.followers.push(id);
        await user.save();

        // update the followers list of the user to be followed
        res.status(200).json({ success: true, follow: "add" });
    }
    catch (err) {
        console.error(err.message);
    }
});

// Search Users
router.get("/search", async (req, res) => {
    try {
        const { search } = req.query;
        
        const users = await User.find({username: search}).select("-password");

        if (!users) {
            return res.status(404).json("Not Found")
        }

        res.status(200).json({ users, success: true });
    } catch (error) {
        console.error(error.message);
    }
});

module.exports = router;