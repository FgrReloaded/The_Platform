const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String,
    userProfilePic: String,
    fullname: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
}, { timestamps: true });

mongoose.models = {};

module.exports = mongoose.model('Comment', CommentSchema);