'use strict';

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

mongoose.model('User', UserSchema);
