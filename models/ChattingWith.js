// Schema for item
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChattingWith = new Schema({
    userId: String,
    chattingWith: Array
}, { timestamps: true });

mongoose.models = {};

module.exports = mongoose.model('ChattingWith', ChattingWith);