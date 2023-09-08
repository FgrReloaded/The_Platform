const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    admins: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    groupType: String,
    groupInvite: String,
    groupPost: String,
    coverPhoto: String,
    logo: String

}, { timestamps: true });

mongoose.models = {};

module.exports = mongoose.model('Group', GroupSchema);