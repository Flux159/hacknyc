'use strict';

var Message = require('../models/message');
var mongoose = require('mongoose');


router.post('/auth/messages', function(req, res) {
  var messageType = req.body.message_type,
    username = req.body.user.username,
    item = req.body.item,
    group = req.body.group;

  if(messageType === null || messageType === undefined || !(messageType == 'ASK' || messageType == 'PROMISE')) {
    return res.status(500).json("Must supply message_type");
  }

  if(req.body.item == null || req.body.item === undefined) {
    return res.status(500).json("Must supply an item");
  }

  if(req.body.group == null || req.body.group == undefined) {
    return res.status(500).json("Must supply a group id");
  }

  var message = new Message(messageType, username, item, group, new Date());
  message.save(fucntion(err){
    if(err){
      return res.status(500).json("Failed to save message");
    }
    return res.status(200).end();
  });
});

module.exports = router;
