var mongo = require("./mongo");
var mongoURL = "mongodb://localhost:27017/login";
var mongoRegisterURL = "mongodb://localhost:27017/sessions";

function handle_request(msg, callback){

    var res = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    mongo.connect(mongoRegisterURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('register');

        coll.findOne({username: msg.username, password:msg.password}, function(err, user){
            if (user) {
                console.log("user data found in db");
                res.code = "200";
                res.value = "Success Login";

            } else {
                console.log("user data NOT found in db");
                res.code = "401";
                res.value = "Failed Login";
            }
        });
    });
    console.log("Response object sent to callback "+res.value);
    callback(null, res);
}

function handle_register_request(msg, callback){
    console.log("handle_register_request");
    var res = {};
    console.log("handle_register_request:"+ JSON.stringify(msg));
    mongo.connect(mongoRegisterURL, function(){
        console.log('Connected to mongo at: ' + mongoURL);
        var coll = mongo.collection('register');
        console.log("Registered firstname: "+msg.firstname);
        console.log("Registered lastname: "+msg.lastname);
        console.log("Registered username: "+msg.username);
        console.log("Registered password: "+msg.password);
        coll.insert({firstname:msg.firstname, lastname: msg.lastname, username: msg.username, password:msg.password }, function(err, user){
            if (err) {
                res.code = "401";
                res.value = "Failed Login";
                console.log("KAFKA Insert failed");

            } else {
                res.code = "200";
                res.value = "Success Login";
                console.log("KAFKA Insert success");

            }
        });
    });
    callback(null, res);
}

exports.handle_register_request = handle_register_request;
exports.handle_request = handle_request;