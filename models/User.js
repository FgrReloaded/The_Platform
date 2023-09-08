const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bday: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    following: [
        {
            type:String
        }
    ],
    groupsJoined: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        }
    ],
    bookmarks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ]
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

mongoose.models = {};

const User = mongoose.model('User', userSchema);

module.exports = User;

