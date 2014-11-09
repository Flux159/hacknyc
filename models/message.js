'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var MessageSchema = new Schema({
    type: String,
    user: String,
    item: ObjectId,
    group: { type: ObjectId, index: true },
    created_at: Date
});

module.exports = mongoose.model('Message', MessageSchema);
