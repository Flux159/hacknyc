'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.status(200).json("Hello World");

//  res.render('index', { title: 'Express' });
});

module.exports = router;
