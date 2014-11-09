'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/user');
var Group = require('../models/group');
var Item = require('../models/item');
var Message = require('../models/message');

var ObjectId = mongoose.Types.ObjectId;

var crypto = require('crypto');

var jwt = require('jsonwebtoken');
var secret = process.env.SECRET || 'secret-shhh-12345';
var expiry = 60 * 24 * 90; //90 Days

/**
 * Encrypt password (pbkdf2, bcrypt, scrypt)
 * @param password
 * @param salt
 * @param callback
 */
function encryptPassword(password, salt, callback) {
    if (typeof salt === 'function') {
        callback = salt;
        salt = crypto.randomBytes(16).toString('base64');
    }
    salt = new Buffer(salt, 'base64');
    crypto.pbkdf2(password, salt, 1000, 64, function (err, hashedPassword) {
        if (err) return callback(err, null);
        callback(null, {salt: salt.toString('base64'), hashedPassword: hashedPassword.toString('base64')});
    });
}

router.post('/users/signup', function (req, res) {

    //Username must be defined
    if (req.body.username === null || req.body.username === undefined) {
        return res.status(500).json("Must supply username");
    }

    //Password must be defined
    if (req.body.password === null || req.body.password === undefined) {
        return res.status(500).json("Must supply password");
    }

    if (req.body.device_id === null || req.body.device_id === undefined) {
        return res.status(500).json("Must supply device_id");
    }

    //Password length must be at least 6 characters
    if (req.body.password.length < 6) {
        return res.status(500).json("Password length must be greater than or equal to 6 characters");
    }

    User.findOne({username: String(req.body.username)}, function (err, user) {
        if (err) return res.status(500).json("Internal Server Error");
        if (user) {
            return res.status(500).json("Username already taken");
        }

        encryptPassword(String(req.body.password), function (err, encryptedPasswordSalt) {

            var user = new User({_id: ObjectId(), username: String(req.body.username), hashed_password: encryptedPasswordSalt.hashedPassword, salt: encryptedPasswordSalt.salt, device_id: req.body.device_id, groups: [], recents: []});

            user.save(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).json("Internal Server Error");
                }

                var profile = {
                    username: user.username
                };

                var token = jwt.sign(profile, secret, {expiresInMinutes: expiry});

                var returnUser = {
                    username: user.username
                };

                return res.status(200).json({token: token, user: returnUser});

            });

        });

    });
});

router.post('/users/login', function (req, res) {

    //Username must be defined
    if (req.body.username === null || req.body.username === undefined) {
        return res.status(500).json("Must supply username");
    }

    //Password must be defined
    if (req.body.password === null || req.body.password === undefined) {
        return res.status(500).json("Must supply password");
    }

    User.findOne({username: req.body.username}, function (err, user) {
        if (err || !user) {
            return res.status(500).json("Invalid username or password");
        }

        encryptPassword(req.body.password, user.salt, function (err, encryptedPasswordSalt) {
            if (encryptedPasswordSalt.hashedPassword === user.hashed_password) {

                var profile = {
                    username: user.username
                };

                var token = jwt.sign(profile, secret, {expiresInMinutes: expiry});

                //TODO: Get groups

//                var groups = {};

                var returnUser = {
                    username: user.username
//                    groups: groups
                };

                return res.status(200).json({token: token, user: returnUser});
            } else {
                return res.status(500).json("Invalid username or password");
            }
        });

    });

});

//                Group.find({_id: user.groups}, function(err, groups) {
//                    if(err) {
//                        console.log(err);
//                        return res.status(500).json("Internal Server Error");
//                    }
//
//                    var returnGroups = [];
//                    var itemIds = [];
//                    var itemMap = {};
//                    var messageIds = [];
//                    var messageMap = {};
//                    groups.forEach(function(group, index) {
//                        returnGroups.push({
//                            users: group.users,
//                            name: group.name,
//                            items: [],
//                            messages: []
//                        });
//
//                        group.items.forEach(function(item) {
//                           itemIds.push(item);
//                           itemMap[item] = index;
//                        });
//
//                        group.messages.forEach(function(message) {
//                            messageIds.push(messages);
//                            messageMap[message] = index;
//                        });
//
//                    });
//
//                    Item.find({_id: itemIds}, function(err, items) {
//                        if(err) return res.status(500).json("Internal Server Error");
//
//
//                        Message.find({_id: messageIds}, function(err, messages) {
//                            if(err) return res.status(500).json("Internal Server Error");
//
//                            items.forEach(function(item) {
//                                if(itemMap[item._id] !== undefined && itemMap[item._id] !== null) {
//                                    returnGroups[itemMap[item._id]].items.push(item);
//                                }
//                            });
//
//                            messages.forEach(function(message) {
//                                if(messageMap[message._id] !== undefined && itemMap[message._id] !== null) {
//                                    returnGroups[messageMap[message._id]].messages.push(message);
//                                }
//                            });
//
//                            var returnUser = {
//                                username: user.username,
//                                groups: returnGroups
//                            };
//
//                            return res.status(200).json({token: token, user: returnUser});
//
//                        });
//
//                    });
//
//                });

router.get('/auth/users', function (req, res) {

    User.findOne({username: req.user.username}, function (err, user) {
        if (err || !user) {
            return res.status(500).json("Internal Server Error");
        }

        //TODO: Get Groups
//        var groups = {};

        Group.find({_id: {$in: user.groups}}, function (err, groups) {
            if (err) {
                console.log(err);
                return res.status(500).json("Internal Server Error");
            }

            var returnGroups = [];
            var itemIds = [];
            var itemMap = {};
            var messageIds = [];
            var messageMap = {};
            groups.forEach(function (group, index) {
                returnGroups.push({
                    users: group.users,
                    name: group.name,
                    items: []
                });

                group.items.forEach(function (item) {
                    itemIds.push(item);
                    itemMap[item] = index;
                });


                messageIds.push(group.name);
                messageMap[group.name] = index;

//                group.messages.forEach(function (message) {
//                    messageIds.push(message);
//                    messageMap[message] = index;
//                });

            });

            Item.find({_id: {$in: itemIds}}, function (err, items) {
                if (err) return res.status(500).json("Internal Server Error");


                Message.find({group: {$in: messageIds}}, function (err, messages) {
                    if (err) return res.status(500).json("Internal Server Error");

                    items.forEach(function (item) {
                        if (itemMap[item._id] !== undefined && itemMap[item._id] !== null) {
                            returnGroups[itemMap[item._id]].items.push(item);
                        }
                    });

                    messages.forEach(function (message) {
                        if (messageMap[message._id] !== undefined && itemMap[message._id] !== null) {
                            returnGroups[messageMap[message._id]].messages.push(message);
                        }
                    });

                    var returnUser = {
                        username: user.username,
                        groups: returnGroups
                    };

                    return res.status(200).json({user: returnUser});

                });

            });

        });

//        var returnUser = {
//            username: user.username,
//            groups: groups
//        };
//
//        return res.status(200).json({user: returnUser});
    });

});

/* GET users listing. */
//router.get('/:id', function(req, res) {
////  res.send('respond with a resource');
//
//    User.find({_id: req.params.id}, function(err, users) {
//        console.log(err);
//        console.log(users);
//        users.forEach(function(user) {
//
//        });
//        res.status(200).end();
//    });
//
//});
//
//router.post('/', function(req, res) {
//
//    console.log("Posting to user");
//    var newUser = new User({username: 'Testing'});
//    newUser.save(function(err) {
//        if(err) {
//            console.log(err);
//        }
//        return res.status(200).json(newUser);
//    });
//
//});

module.exports = router;
