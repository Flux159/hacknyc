var assert = require('assert');

//Run server
var server = require('../app');

//Get user & message schema
var User = require('../models/user');
var Group = require('../models/group');
var Item = require('../models/item');

var request = require('supertest');

var token;
var groupId;
var user2 = 'testing9';

describe('Groups', function () {

    before(function (done) {
        //Clear users before test
        Group.remove({}, function (err) {
            Item.remove({}, function(err) {

                request(server).post('/users/signup')
                    .send({'username': "testing2", 'password': "test123", device_id: '12345'})
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        assert.ifError(err);

                        token = res.body.token;

                        request(server).post('/users/signup')
                            .send({'username': user2, 'password': "test123", device_id: '12345'})
                            .expect('Content-Type', /json/)
                            .expect(200)
                            .end(function (err, res) {
                                assert.ifError(err);

                                done();
                            });
                    });
            });
        });
    });

    describe('create', function () {
        it('Should create a group successfully', function (done) {
            request(server).post('/auth/groups/create')
                .set('Authorization', 'Bearer ' + token)
                .send({'name': 'house'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    assert.ifError(err);

                    console.log("Add group");
                    console.log(res.body);
                    groupId = res.body.id;

                    done();
                });
        });
    });

    describe('adduser', function() {
        it('Should add a user successfully', function(done) {
            request(server).get('/auth/groups/' + groupId + '/add_user/' + user2)
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    assert.ifError(err);

                    console.log("Add user to group");
                    console.log(res.body);

                    done();
                });

//            done();
        });
    });

    describe('additem', function() {
        it('Should add an item successfully', function(done) {
            done();
        });
    });

    describe('deleteitem', function() {
        it('Should delete an item successfully', function(done) {
            done();
        });
    });

});