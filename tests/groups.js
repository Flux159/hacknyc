var assert = require('assert');

//Run server
var server = require('../app');

//Get user & message schema
var User = require('../models/user');
var Group = require('../models/group');
var Item = require('../models/item');

var request = require('supertest');

var token;

describe('Groups', function () {

    before(function (done) {
        //Clear users before test
        Group.remove({}, function (err) {
            Item.remove({}, function(err) {
                done();
            });
        });
    });

    describe('create', function () {
        it('Should register a user successfully', function (done) {
            done();
//            request(server).post('/users/signup')
//                .send({'username': "testing1", 'password': "test123", device_id: '12345'})
//                .expect('Content-Type', /json/)
//                .expect(200)
//                .end(function (err, res) {
//                    assert.ifError(err);
//
//                    token = res.body.token;
//
//                    done();
//                });
        });
    });

});