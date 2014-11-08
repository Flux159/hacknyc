'use strict';

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Group = require('../models/group');
var Item = require('../models/item');

var defaultItems = [
    new Item({
        title: 'Beer',
        icon: 'beer.svg'
    }),
    new Item({
        title: 'Toilet Paper',
        icon: 'tp.svg'
    }),
    new Item({
        title: 'Trees',
        icon: 'trees.svg'
    })];

router.post('/auth/groups/create', function(req, res) {
    console.log("Creating new group.");
   
    var newGroup = new Group({
        users: req.users, 
        name: req.name,
        items: defaultItems,
     });
    newGroup.validate(function (err) {
        if(err) {
            console.log(err);
        }
    });

    newGroup.save(function(err) {
        if(err) {
            console.log(err);
            return res.status(500).json("Internal Server Error");
        }
        var returnGroup = {

        };


        return res.status(200).json(newGroup);
    });
    
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
