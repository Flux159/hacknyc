'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new Schema({
    username: {type: String, index: true},
    fname: String,
    phone: String,
    email: String,
    hashedPassword: String,
    groups: [ObjectId],
    recents: [ObjectId]
});

var User = mongoose.model('User', UserSchema);

/* GET users listing. */
router.get('/:id', function(req, res) {
//  res.send('respond with a resource');

    User.find({_id: req.params.id}, function(err, user) {
        console.log(err);
        console.log(user);
        res.status(200).end();
    });

});

router.post('/', function(req, res) {

    console.log("Posting to user");
    var newUser = new User({username: 'Testing'});
    newUser.save(function(err) {
        if(err) {
            console.log(err);
        }
        return res.status(200).json(newUser);
    });

});

module.exports = router;