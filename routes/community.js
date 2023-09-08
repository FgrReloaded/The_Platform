const express = require("express");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const Group = require("../models/Group");
var jwt = require('jsonwebtoken');
const router = express.Router();
const dotenv = require('dotenv');
const fetchuser = require('../middleware/fetchuser');
dotenv.config();

// Getting User Token From .env
const JWT_TOKEN = process.env.JWT_TOKEN

// Get all groups
router.get('/all', fetchuser, async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error(error.message);
    }
});


// Create a Group
router.post('/create', fetchuser, [
    body('groupName', 'Enter a valid group name').isLength({ min: 3 }),
    body('groupType', 'Enter a valid group type').isLength({ min: 3 }),
    body('groupInvite', 'Enter a valid group invite').isLength({ min: 3 }),
    body('groupPost', 'Enter a valid group post').isLength({ min: 3 }),
], async (req, res) => {
    try {
        const { groupName, groupDesc, groupInvite, groupPost, groupType, coverUrl, logoUrl } = req.body;
        // If there are errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        // Create a new group
        const group = new Group({
            name: groupName, desc: groupDesc, groupType, groupInvite, groupPost, admins: req.user.id, members: req.user.id,coverPhoto: coverUrl, logo: logoUrl
        })
        const savedGroup = await group.save();
        res.status(200).json({ success: true, savedGroup });
    } catch (error) {
        console.error(error.message);
    }
});

// Join a Group
router.put('/join', fetchuser, async (req, res) => {
    try {
        const { id } = req.query;
        // add user to current group and update member
        const group = await Group.findByIdAndUpdate(id, { $push: { members: req.user.id } }, { new: true });
        res.status(200).json({ success: true, group });
    }
    catch (error) {
        console.error(error.message);
    }
});



module.exports = router;