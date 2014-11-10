'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var helpers = require('../helpers');

var Group = require('../models/group');
var Item = require('../models/item');
var User = require('../models/user');

var defaultItems = [
    {
        title: 'Beer',
        icon: 'beer.svg'
    },
    {
        title: 'Toilet Paper',
        icon: 'tp.svg'
    },
    {
        title: 'Trees',
        icon: 'trees.svg'
    }
];

router.post('/auth/groups/create', function (req, res) {
    console.log("Creating new group.");

    // First save default items. 
    //TODO: switch to async for multiple.
    Item.create(defaultItems, function (err, beer, tp, tree) {
        if (err) {
            console.log(err);
            return res.status(500).json("Internal Server Error");
        }

        var defaultItemIds = [beer._id, tp._id, tree._id];

        // Create group with default items.
        var newGroup = new Group({
            users: req.user.username,
            name: req.body.name,
            items: defaultItemIds
        });
        newGroup.save(function (err) {
            if (err) {
                console.log(err);
                return res.status(500).json("Internal Server Error");
            }

            helpers.addGroupToUser(req.user.username, newGroup, function(success) {
                if(!success) {
                    res.status(500).json("Internal Server Error");
                }
                // Return all item details.
                newGroup.items = [beer, tp, tree];
                return res.status(200).json(helpers.trimGroup(newGroup));

            });
        });

    });

});

router.get('/auth/groups/:id/add_user/:username', function (req, res) {
    Group.findOne({ _id: req.params.id }, function (err, group) {
        // Need to populate the whole group object for response.
        console.log("Adding user to group %s.", group.name);
//        var full_group = helpers.buildGroupJson(group);

        group.users.push(req.params.username);
        group.markModified('users');
        group.save(function(err) {
            if(err) {
                console.log(err);
                return res.status(500).json("Internal Server Error");
            }

            helpers.buildGroupJson(group, function(full_group) {
                if(!full_group) {
                    return res.status(500).json("Internal Server Error");
                }

                helpers.addGroupToUser(req.params.username, group, function(success) {
                    if(!success) {
                        return res.status(500).json("Internal Server Error");
                    }

                    return res.status(200).json(helpers.trimGroup(full_group));

                });

            });

        });
    });
});

router.put('/auth/groups/:id/add_item', function (req, res) {
    res.status(200).end();
});

router.get('/auth/groups/:id', function (req, res) {
    Group.findOne({ _id: req.params.id }, function (err, group) {
        helpers.buildGroupJson(group, function(full_group) {
            if(!full_group) {
                res.status(500).json("Internal Server Error");
            }
            return res.status(200).json(helpers.trimGroup(full_group));
        });
    });
});

router.delete('/auth/groups/:id/remove_user/:username', function (req, res) {
    res.status(200).end();
});

module.exports = router;
