const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const Comment = require("../models/Comment");
const router = express.Router();
const dotenv = require('dotenv');
const fetchuser = require('../middleware/fetchuser');
dotenv.config();


// Get all comments of a post
router.get('/get-comments', fetchuser, async (req, res) => {
    try {
        const { postId } = req.query;
        const comments = await Comment.find({ post: postId });
        if (!comments) {
            res.status(404).json({ success: false, message: "No comments found" });
        }
        res.status(200).json({ success: true, comments });
    } catch (error) {
        console.error(error.message);
    }
});


// Post a comment
router.post('/add-comment', fetchuser, async (req, res) => {
    try {
        const { id } = req.user;
        const { body, post, username, userProfilePic, fullname } = req.body;
        const comment = await Comment.create({ body, user: id, post, username, userProfilePic, fullname });
        res.status(200).json({ success: true, comment });
    } catch (error) {
        console.error(error.message);
    }
})


module.exports = router;