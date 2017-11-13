var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var kafka = require('./kafka/client');

module.exports = function(passport) {
    passport.use('login', new LocalStrategy(function(username , password, done) {
        kafka.make_request('dropbox_login',{"username":username,"password":password}, function(err,results){
            if(err){
                done(err,{});
            }
            else
            {
                if(results === "200" ){
                    console.log("PASSPORT: "+results);
                    done(null,results);
                }
                else {
                    done(null,false);
                }
            }
        });
    }));
};


