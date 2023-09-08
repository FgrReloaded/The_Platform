const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');

// GET /posts

router.get('/get-posts', fetchuser, async (req, res) => {
    try {
        let { id } = req.user;

        // fetch 2 latest posts of this user
        const posts = await Post.find({ user: id }).sort({ createdAt: -1 }).limit(2);
        if (!posts) {
            res.status(404).json({ success: false, message: "No posts found" });
        }
        res.status(200).json({ success: true, posts });
    }
    catch (err) {
        console.error(err.message);
    }
});

// POST /posts

router.post('/create-post', fetchuser, async (req, res) => {
    try {
        const { id } = req.user;
        // create a post
        const { content, files, videos, username, userProfilePic, fullname } = req.body;
        const post = await Post.create({ body: content, user: id, images: files, videos, username, userProfilePic, fullname });
        res.status(200).json({ success: true, post });
    } catch (error) {

    }
});

// POST /get-following-posts
router.post('/get-following-posts', fetchuser, async (req, res) => {
    try {
        const { myFollowing } = req.body;
        const posts = await Post.find();

        if (!posts) {
            res.status(404).json({ success: false, message: "No posts found" });
        }
        res.status(200).json({ success: true, posts });

    } catch (error) {
        console.error(error.message);
    }
});

// Like post
router.put('/like-post', fetchuser, async (req, res) => {
    try {
        const { postId } = req.body;
        const { id } = req.user;
        const posts = await Post.findById(postId);
        // check if it already liked
        if (posts.likes.includes(id)) {
            // remove the like
            const index = posts.likes.indexOf(id);
            posts.likes.splice(index, 1);
            await posts.save();
            return res.status(200).json({ success: true, posts, like: "remove" });
        }
        // add the like
        posts.likes.push(id);
        await posts.save();
        if (posts.length === 0) {
            res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, posts, like: "add" });
    } catch (error) {
        console.error(error.message);
    }
});

// add bookmark
router.put('/bookmark', fetchuser, async (req, res) => {
    try {
        const { postId } = req.query;
        const { id } = req.user;
        const posts = await Post.findById(postId);
        // check if it already bookmarked
        if ((posts.bookmarks).includes(id)) {
            // remove the bookmark
            const index = (posts.bookmarks).indexOf(id);
            (posts.bookmarks).splice(index, 1);
            await posts.save();
            return res.status(200).json({ success: true, posts, bookmark: "remove" });
        }

        // add the bookmark
        posts.bookmarks.push(id);
        await posts.save();
        if (posts.length === 0) {
            res.status(404).json({ success: false, message: "Post not found" });
        }
        res.status(200).json({ success: true, posts, bookmark: "add" });
    } catch (error) {
        console.error(error.message);
    }
});

// get users post
router.get('/get-user-posts', fetchuser, async (req, res) => {
    try {
        const { profile } = req.query;
        const posts = await Post.find({ username: profile });
        if (posts.length === 0) {
            res.status(404).json({ success: false, message: "No posts found" });
        }
        res.status(200).json({ success: true, posts });
    } catch (error) {
        console.error(error.message);
    }
});

// delete post
router.delete('/delete-post', fetchuser, async (req, res) => {
    try {
        const { postId } = req.query;
        const { id } = req.user;

        // delete post
        await Post.findByIdAndDelete({ _id: postId, user: id });

        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } catch (error) {
        console.error(error.message);
    }
});


module.exports = router;
