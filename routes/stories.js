const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const User = require('../models/User');
const fetchuser = require('../middleware/fetchuser');



// Route 1: Get all the stories using: GET "/api/stories/getstories". Login required
router.get('/getstories', fetchuser, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.query.user });
        res.status(200).json({ stories, success: true });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// Route 2: Add a new story using: POST "/api/stories/create-story". Login required
router.post('/create-story', fetchuser, async (req, res) => {
    try {
        const { id } = req.user;
        // create a story
        const { storyLink, user, userFullName } = req.body;
        const post = await Story.create({ story: storyLink, user, userFullName });
        res.status(200).json({ success: true, post });
    } catch (error) {

    }
});


// Route 3: Get Stories of my followers
router.post('/get-following-stories', fetchuser, async (req, res) => {
    try {
        const { myFollowing } = req.body;
        const stories = await Story.find({ user: { $in: myFollowing } });
        if (stories.length == 0) {
            res.status(404).json({ success: false, message: "No stories found" });
        }
        res.status(200).json({ stories, success: true });
    } catch (error) {
        console.error(error.message);
    }
});

// Delete Story
router.delete('/delete-story', fetchuser, async (req, res) => {
    try {
        // Find the story to be deleted and delete it
        let story = await Story.findById(req.query.story);
        if (!story) {
            return res.status(404).send("Not Found");
        }
        // Find User
        const user = await User.findById(req.user.id);

        // Allow deletion only if user owns this Story
        if (story.user.toString() !== user.username) {
            return res.status(401).send("Not Allowed");
        }

        story = await Story.findByIdAndDelete(req.query.story);
        res.status(200).json({ success: true, story: story });
    } catch (error) {
        console.error(error.message);
    }

});

module.exports = router;
