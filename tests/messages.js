var assert = require('assert');

//Run server
var server = require('../app');

//Get user & message schema
var User = require('../models/user');
var Message = require('../models/message');

var request = require('supertest');

var token;
var group_id;
var item_id;

describe('Messages', function () {

    before(function (done) {
        //Clear users before test
        Message.remove({}, function (err) {
            request(server).post('/users/signup')
                .send({'username': "testing3", 'password': "test123", device_id: '12345'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);

                    token = res.body.token;

                    request(server).post('/auth/groups/create')
                        .set('Authorization', 'Bearer ' + token)
                        .send({'name': 'group7', 'users':['testuser7']})
                        .end(function (err, res) {
                            assert.ifError(err);
                            group_id = res.body.id;
                            item_id = res.body.items[0]._id;

                            done();
                        });

                    
                });
        });
    });

    describe('create', function () {
        it('Should create a message successfully', function (done) {
            request(server).post('/auth/messages')
                .set('Authorization', 'Bearer ' + token)
                .send({'type': 'ASK', 'item': item_id, 'group': group_id})
               .expect('Content-Type', /json/)
               .expect(200)
                .end(function(err, res) {
                    console.log(err);
                    done();
                });

//            done();
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