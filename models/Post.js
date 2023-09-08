const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    username: String,
    fullname: String,
    userProfilePic: String,
    images: [String],
    videos: [String],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
}, { timestamps: true });

mongoose.models = {};

module.exports = mongoose.model('Post', PostSchema);


