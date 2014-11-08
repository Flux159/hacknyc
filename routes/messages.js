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
    group: ObjectId,
    created_at: Date
});

var Message = mongoose.model('Message', MessageSchema);

router.post('/auth/messages', function(req, res) {
    res.status(200).end();
});

module.exports = router;
