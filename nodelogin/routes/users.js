var express = require('express');
var router = express.Router();
var passport = require("passport");
require('./passport')(passport);
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
var mongo = require("./mongo");
var mongoRegisterURL = "mongodb://localhost:27017/sessions";
var mongoSessionURL = "mongodb://localhost:27017/sessions";
var kafka = require('./kafka/client');

var session = require('client-sessions');
var expressSessions = require("express-session");
var mongoStore = require("connect-mongo/es5")(expressSessions);

router.use(expressSessions({
    secret: "CMPE273_passport",
    resave: true,
    //Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: false, //force to save uninitialized session to db.
    //A session is uninitialized when it is new but not modified.
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 6 * 1000,
    store: new mongoStore({
        url: mongoSessionURL
    })
}));
router.use(passport.initialize());

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doLogin', function(req, res) {
    var reqUsername = req.body.username;
    var reqPassword = req.body.password;

    passport.authenticate('login', function(err, user) {
        if(err) {
            res.status(401).json({message: "Login failed: "+err});
        }
        if(!user) {
            res.status(401).json({message: "Login failed"});
        }
        if(user){
            res.status(201).json({message: "Login successful"});
            global.username = reqUsername;
            global.CurrentFolder = reqUsername;
            return res.username === reqUsername;
        }
        req.session.user = user.username;
        console.log(req.session.user);
        console.log("session initilized");
    })(req, res);
});

router.post('/doRegister', function(req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var password = req.body.password;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            kafka.make_request('dropbox_register',{"username":username,"password":hash,"firstname":firstname,"lastname":lastname}, function(err,results){
                console.log('in result');
                console.log(results);
                if(err){
                    res.end(err);
                }
                else
                {
                    if(results === "200"){
                        req.session.user = username;
                        res.status(201).send({username:username});

                    }
                    else {
                        res.status(401).send();
                    }
                }
            });
        });
    });
});

router.post('/doUserDetails', function(req, res){
    var reqUsername = req.body.username;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var education = req.body.education;
    var course = req.body.course;
    var organization = req.body.organization;
    var designation = req.body.designation;
    var contact = req.body.contact;
    var email = req.body.email;
    var shows = req.body.shows;
    var music = req.body.music;
    var sports = req.body.sports;

    var newItem = {
        "username": reqUsername,
        "firstname": firstname,
        "lastname": lastname,
        "education": education,
        "course": course,
        "organization": organization,
        "designation": designation,
        "contact": contact,
        "email": email,
        "shows": shows,
        "music": music,
        "sports": sports
    };

    kafka.make_request('dropbox_updateUserDetails',newItem, function(err,results){
        console.log('in result');
        console.log(results);
        if(err){
            res.end(err);
        }
        else
        {
            if(results === "200"){
                console.log("1 UserDetails updated: ");
                res.status(201).json({message: "Details updated!"});
                return res;
            }
            else {
                res.status(401).json({message: "Not found"});
            }
        }
    });

});

router.get('/getUserDetails',function(req, res) {
    var reqUsername = global.username;
    //var reqUsername = req.param('username');
    kafka.make_request('dropbox_getUserDetails', {"username": reqUsername}, function (err, results) {
        console.log('in result');
        console.log(results);
        if (err) {
            res.end(err);
        }
        else {
            if (results == 401) {
                res.status(401).send();
            }
            else {
                res.status(201).send(results);
            }
        }
    });
});


module.exports = router;

