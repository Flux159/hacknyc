var assert = require('assert');

//Run server
var server = require('../app');

//Get user schema
var User = require('../models/user');


var request = require('supertest');

var token;

describe('Users', function () {

    before(function (done) {
        //Clear users before test
        User.remove({}, function (err) {
            done();
        });
    });

    describe('register', function () {
        it('Should register a user successfully', function (done) {
            request(server).post('/users/signup')
                .send({'username': "testing1", 'password': "test123", device_id: '12345'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);

                    token = res.body.token;

                    done();
                });
        });
    });

    describe('login', function () {
        it('Should login a registered user', function (done) {
            request(server).post('/users/login')
                .send({'username': 'testing1', password: 'test123'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    assert.ifError(err);
                    token = res.body.token;
                    done();
                });
        });
    });

    describe('get', function () {
        it('Should get a users information', function (done) {
            request(server).get('/auth/users')
                .set('Authorization', 'Bearer ' + token)
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    assert(res.body.user.username, 'testing1');

                    done();
                });
        });
    });

});