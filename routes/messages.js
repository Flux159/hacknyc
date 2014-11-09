'use strict';

var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var mongoose = require('mongoose');


router.post('/auth/messages', function(req, res) {
  var messageType = req.body.type,
    username = req.user.username,
    item = req.body.item,
    group = req.body.group;

  if(messageType === null || messageType === undefined || !(messageType == 'ASK' || messageType == 'PROMISE')) {
    return res.status(500).json("Must supply message type");
  }

  if(req.body.item == null || req.body.item === undefined) {
    return res.status(500).json("Must supply an item id");
  }

  if(req.body.group == null || req.body.group == undefined) {
    return res.status(500).json("Must supply a group id");
  }

  var message = new Message({
    type: messageType,
    user: username,
    item: mongoose.Types.ObjectId(item),
    group: mongoose.Types.ObjectId(group),
    created_at: new Date()
  });

  message.save(function (err) {
    if(err){
      return res.status(500).json("Failed to save message");
    }

    return res.status(200).json({
      "type" : message.type,
      "user" : message.user,
      "item" : message.item,
      "group" : message.group,
      "created_at" : message.created_at,
      "_id" : message._id});
    });
});

module.exports = router;
