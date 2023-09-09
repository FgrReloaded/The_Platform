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
            name: groupName, desc: groupDesc, groupType, groupInvite, groupPost, admins: req.user.id, members: req.user.id, coverPhoto: coverUrl, logo: logoUrl
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
        // Find the user
        const user = await User.findById(req.user.id);
        // Check if user is joined in group or not
        if (user.groupsJoined.includes(id)) {
            return res.status(401).json({ success: false, message: "User already joined in group" });
        }
        // Find the group
        const group = await Group.findById(id);
        // Update the group members
        group.members.push(req.user.id);
        await group.save();
        // Update the user groupsJoined
        user.groupsJoined.push(id);
        await user.save();


        res.status(200).json({ success: true, group });
    }
    catch (error) {
        console.error(error.message);
    }
});

// Leave a Group
router.put('/leave', fetchuser, async (req, res) => {
    try {
        const { id } = req.query;
        // Find the user
        let user = await User.findById(req.user.id);

        // Find the group
        const group = await Group.findById(id);
        // Check if user is joined in group or not
        if (!group.members.includes(req.user.id)) {
            return res.status(401).json({ success: false, message: "User not joined in group" });
        }
        // Update the group members
        const index = group.members.indexOf(req.user.id);
        group.members.splice(index, 1);
        //  Check for group admin
        if (group.admins.includes(req.user.id)) {
            const index = group.admins.indexOf(req.user.id);
            group.admins.splice(index, 1);
            // Check if group has no admin
            if (group.admins.length === 0) {
                // Delete the group
                await Group.findByIdAndDelete(id);
                // Update all the user groupsJoined
                for (let i = 0; i < group.members.length; i++) {
                    const user = await User.findById(group.members[i]);
                    const index2 = user.groupsJoined.indexOf(id);
                    user.groupsJoined.splice(index2, 1);
                    await user.save();
                }
                res.status(200).json({ success: true, delete: true });
            }
            res.status(200).json({ success: true, group });
        }
        // Update the user groupsJoined
        const index2 = user.groupsJoined.indexOf(id);
        user.groupsJoined.splice(index2, 1);
        await user.save();

        res.status(200).json({ success: true, group });
    }
    catch (error) {
        console.error(error.message);
    }
});




module.exports = router;