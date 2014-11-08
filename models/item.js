'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var ItemSchema = new Schema({
    title: String,
    icon: String,
    chevin: String
});

module.exports = mongoose.model('Item', ItemSchema);