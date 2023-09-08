const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StorySchema = new Schema({
    story: {
        type: String,
        required: true
    },
    viewers: [{
        type: String
    }],
    user: {
        type: String
    },
    userFullName: {
        type: String
    },
}, { timestamps: true });

mongoose.models = {};

module.exports = mongoose.model('Story', StorySchema);