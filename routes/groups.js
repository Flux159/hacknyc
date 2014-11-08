'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var GroupSchema = new Schema({
    users: [String],
    name: String,
    items: [ObjectId],
    messages: [ObjectId]
});

var ItemSchema = new Schema({
    title: String,
    icon: String,
    chevin: String
});

var Group = mongoose.model('Group', GroupSchema);
var Item = mongoose.model('Item', ItemSchema);

router.post('/auth/groups/create', function(req, res) {
    res.status(200).end();
});

router.put('/auth/groups/:id/add_user/:username', function(req, res) {
    res.status(200).end();
});

router.put('/auth/groups/:id/add_item', function(req, res) {
    res.status(200).end();
});

router.get('/auth/groups/:id', function(req, res) {
    res.status(200).end();
});

router.delete('/auth/groups/:id/remove_user/:username', function(req, res) {
    res.status(200).end();
});

module.exports = router;
