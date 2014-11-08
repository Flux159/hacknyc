'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var GroupSchema = new Schema({
    users: [String],
    name: String,
    items: [ObjectId],
    messages: [ObjectId]
});

module.exports = mongoose.model('Group', GroupSchema);