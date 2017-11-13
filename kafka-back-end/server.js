var connection =  new require('./kafka/Connection');
var mongo = require("./services/mongo");
var mongoRegisterURL = "mongodb://localhost:27017/sessions";
var fs = require('fs');
const bcrypt = require('bcrypt');

var consumer = connection.getConsumer();
var producer = connection.getProducer();

console.log('server is running');
consumer.on('message', function (message) {
    if(message.topic === "dropbox_login") {
        console.log('dropbox_login message received' + message.topic);
        var data = JSON.parse(message.value);
        var res = {}, payloads;
        var coll = global.db.collection('register');
        coll.find({username: data.data.username}).toArray(function(err, user){
            if (user[0]) {
                var hashedPassword = user[0].password;
                bcrypt.compare(data.data.password, hashedPassword, (err, result) => {
                    if (err) {
                        console.log("USER SEARCH ERROR: "+err);
                        res.code = "401";
                    } else {
                        console.log("USER FOUND IN DB");
                        res.code = "200";
                    }
                    payloads = [
                        {
                            topic: data.replyTo,
                            messages: JSON.stringify({
                                correlationId: data.correlationId,
                                data: res.code
                            }),
                            partition: 0
                        }
                    ];
                    producer.send(payloads, function (err, data) {
                        console.log("producer payload" +data);
                    });
                    return;
                });
            }
            else {
                console.log("USER NOT FOUND");
                res.code ="401";
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res.code
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log("producer payload" +data);
                });
                return;
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    var res = {},payloads;

    if(message.topic === "dropbox_register") {
        console.log('Register message received' + message.topic);
        console.log(JSON.stringify(message.value));

        var coll = global.db.collection('register');
        coll.findOne({username: data.data.username}, function (err, user) {
            if (user) {
                res.code = "401";
                console.log("KAFKA Insert failed: User already exists");
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: res.code
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
            else if (err) {
                throw err;

            } else {
                coll.insert({
                    firstname: data.data.firstname,
                    lastname: data.data.lastname,
                    username: data.data.username,
                    password: data.data.password
                }, function (err, user) {
                    if (err) throw err;
                    else {

                        var coll_UserDetails = global.db.collection('UserDetails');
                        coll_UserDetails.insert({
                            firstname: data.data.firstname,
                            lastname: data.data.lastname,
                            education: "",
                            course: "",
                            organization: "",
                            designation: "",
                            contact: "",
                            email: "",
                            shows: "",
                            music: "",
                            sports: "",
                            username: data.data.username
                        }, function (err, user1) {
                            if (err) throw err;
                            else {
                                res.code = "200";
                                console.log("KAFKA Insert success: Registered");
                                payloads = [
                                    {
                                        topic: data.replyTo,
                                        messages: JSON.stringify({
                                            correlationId: data.correlationId,
                                            data: res.code
                                        }),
                                        partition: 0
                                    }
                                ];
                                producer.send(payloads, function (err, data) {
                                    console.log(data);
                                });
                                return;
                            }
                        });
                    }
                });
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    var res = {},code, payloads;

    if(message.topic === "dropbox_updateUserDetails") {
        console.log('Register message received' + message.topic);
        console.log(JSON.stringify(message.value));

        var coll = global.db.collection('register');
        coll.find({username: data.data.username}).toArray(function(err, user){
            if (user[0]) {
                var user_name = user[0].username;
                var coll_UserDetails = global.db.collection('UserDetails');
                coll_UserDetails.find({username: data.data.username}).toArray(function(err, userDetails){
                    if(err)
                        throw err;
                    else if (userDetails) {
                        var myquery = { username: user_name };
                        var newvalues = {
                            firstname: data.data.firstname,
                            lastname: data.data.lastname,
                            education: data.data.education ,
                            course: data.data.course,
                            organization: data.data.organization,
                            designation: data.data.designation,
                            contact: data.data.contact,
                            email: data.data.email,
                            shows: data.data.shows,
                            music: data.data.music,
                            sports: data.data.sports,
                            username:user_name};
                        var coll_UserDetailsUpdate = global.db.collection('UserDetails');

                        coll_UserDetailsUpdate.updateOne(myquery, newvalues, function(err, userdetailsupdate) {
                            if (err) throw err;
                            else{
                                console.log("1 UserDetails updated: " + userdetailsupdate);
                                code = "200";
                                payloads = [
                                    {
                                        topic: data.replyTo,
                                        messages: JSON.stringify({
                                            correlationId: data.correlationId,
                                            data: code
                                        }),
                                        partition: 0
                                    }
                                ];
                                producer.send(payloads, function (err, data) {
                                    console.log(data);
                                });
                                return;

                            }
                        });
                    }
                    else {
                        var coll_UserDetails = global.db.collection('UserDetails');
                        coll_UserDetails.insert({
                            firstname: data.data.firstname,
                            lastname: data.data.lastname,
                            education: data.data.education ,
                            course: data.data.course,
                            organization: data.data.organization,
                            designation: data.data.designation,
                            contact: data.data.contact,
                            email: data.data.email,
                            shows: data.data.shows,
                            music: data.data.music,
                            sports: data.data.sports,
                            username: data.data.username
                        }, function (err, res) {
                            if (err) throw err;
                            else{
                                console.log("1 UserDetails updated: " + res);
                                code = "200";
                                payloads = [
                                    {
                                        topic: data.replyTo,
                                        messages: JSON.stringify({
                                            correlationId: data.correlationId,
                                            data: code
                                        }),
                                        partition: 0
                                    }
                                ];
                                producer.send(payloads, function (err, data) {
                                    console.log(data);
                                });
                                return;

                            }
                        });
                    }
                });
            }
            else {
                console.log("User not found");
                code = "401";
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: code
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    if(message.topic === "dropbox_getUserDetails")
    {
        console.log('dropbox_getUserDetails message received' + message.topic);
        console.log(JSON.stringify(message.value));
        var payloads;
        var coll = global.db.collection('register');
        coll.find({username: data.data.username}).toArray(function(err, user){
            if (user[0]) {
                var user_name = user[0].username;
                console.log("userDetails:"+user_name);

                var coll_UserDetails = global.db.collection('UserDetails');
                coll_UserDetails.find({username: data.data.username}).toArray(function(err, userDetails){
                    if (userDetails) {
                        console.log("userDetails:"+userDetails);
                        payloads = [
                            {
                                topic: data.replyTo,
                                messages: JSON.stringify({
                                    correlationId: data.correlationId,
                                    data: userDetails
                                }),
                                partition: 0
                            }
                        ];

                        producer.send(payloads, function (err, data) {
                            console.log(data);
                        });
                        return;
                    }
                    else {
                        payloads = [
                            {
                                topic: data.replyTo,
                                messages: JSON.stringify({
                                    correlationId: data.correlationId,
                                    data: "401"
                                }),
                                partition: 0
                            }
                        ];

                        producer.send(payloads, function (err, data) {
                            console.log(data);
                        });
                        return;
                    }
                });
            }
            else {
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "401"
                        }),
                        partition: 0
                    }
                ];

                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    if(message.topic === "dropbox_getAllFiles")
    {
        console.log('dropbox_getAllFiles message received' + message.topic);
        console.log(JSON.stringify(message.value));
        var payloads;
        var fileresp = [];
        var response = "", strJson="", Query="";

        var coll = global.db.collection('UploadedFiles');
        Query = {username: data.data.username,parentfolder:""};
        coll.find(Query).toArray(function(err, user){
            if (user) {
                console.log("Fetch files");
                for(var i=0;i<user.length;)
                {
                    response += (user[i].imgname)+"<br>";
                    strJson += '{"files":"' + user[i].imgname + '","filetype":"'+user[i].filetype+'"}';
                    //strJsonFileType += '{"filetype":"' + user[i].filetype + '"}';
                    i = i + 1;
                    if (i < user.length) {
                        strJson += ',';
                    }
                }
                strJson = '{"UsernameName":"' + data.data.username + '","count":' + user.length + ',"UploadedFiles":[' + strJson + "]}";
                console.log("Ext:"+strJson);
                fileresp = user;
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: strJson
                        }),
                        partition: 0
                    }
                ];

                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
                //res.status(200).send(JSON.parse(strJson));
            }
            else {
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "401"
                        }),
                        partition: 0
                    }
                ];

                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);
    if(message.topic === "dropbox_getFolderFiles")
    {
        console.log('dropbox_getFolderFiles message received' + message.topic);
        console.log(JSON.stringify(message.value));
        var payloads;
        var fileresp = [];
        var response = "", strJson="", Query="", strJson2="";

        if(data.data.IsGroup)
        {
            var coll = global.db.collection('Group');
            coll.find({groupname:data.data.folderName}).toArray(function(err, user1){
                if (user1) {
                    for(var i=0;i<user1.length;)
                    {
                        console.log("Members:"+user1[i].member);
                        strJson2 += '{"members":"' + user1[i].member + '"}';
                        i = i + 1;
                        if (i < user1.length) {
                            strJson2 += ',';
                        }
                    }
                }
            });
        }


        var coll = global.db.collection('UploadedFiles');
        Query = {username: data.data.username,parentfolder:data.data.folderName};
        coll.find(Query).toArray(function(err, user){
            if (user) {
                console.log("Fetch files");
                for(var i=0;i<user.length;)
                {
                    response += (user[i].imgname)+"<br>";
                    strJson += '{"files":"' + user[i].imgname + '","filetype":"'+user[i].filetype+'","createdby":"'+user[i].username+'"}';
                    //strJsonFileType += '{"filetype":"' + user[i].filetype + '"}';
                    i = i + 1;
                    if (i < user.length) {
                        strJson += ',';
                    }
                }

                //strJson = '{"UsernameName":"' + data.data.username + '","count":' + user.length + ',"UploadedFiles":[' + strJson + "]}";
                strJson = '{"UsernameName":"' + data.data.username + '","count":' + user.length + ',"UploadedFiles":[' + strJson + '],"AllMembers":['+ strJson2 +"]}";
                console.log("Ext:"+strJson);
                fileresp = user;
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: strJson
                        }),
                        partition: 0
                    }
                ];

                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
                //res.status(200).send(JSON.parse(strJson));
            }
            else {
                payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "401"
                        }),
                        partition: 0
                    }
                ];

                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});


consumer.on('message', function (message) {
    var data = JSON.parse(message.value);

    if(message.topic === "dropbox_upload") {
        console.log('dropbox_upload received' + message.topic);
        //console.log(JSON.stringify(message.value));

        var newItem = {
            imgname: data.data.imgname,
            description: data.data.description,
            contentType: data.data.contentType,
            size: data.data.size,
            img: data.data.img,
            filetype: data.data.filetype,
            parentfolder: data.data.parentfolder,
            username: data.data.username
        };
        global.db.collection('UploadedFiles')
            .insert(newItem, function(err, result){
                if (err) { console.log(err); };
                console.log("File Uploaded");
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "201"
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            });
    }
});


consumer.on('message', function (message) {
    var data = JSON.parse(message.value);

    if(message.topic === "dropbox_delete") {
        console.log('dropbox_upload received' + message.topic);
        var filetype;
        if(data.data.isFolder)
        {
            filetype = "folder";
        }
        else if(data.data.Isgroup)
        {
            filetype="group";
        }
        else
        {
            filetype="file";
        }


        var newItem = {
            imgname: data.data.imgname,
            username: data.data.username,
            parentfolder: data.data.parentfolder,
            filetype:filetype
        };


        global.db.collection('UploadedFiles')
            .remove(newItem, function(err, result){
                if (err) { console.log(err); };
                console.log('file deleted successfully');
                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "201"
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);

    if(message.topic === "dropbox_share") {
        console.log('dropbox_share received' + message.topic);

        var coll = global.db.collection('register');
        coll.find({username: data.data.Shareusername}).toArray(function(err, user){
            if (user[0])
            {
                var coll = global.db.collection('UploadedFiles');
                coll.find({username: data.data.username, imgname:data.data.imgname}).toArray(function(err, user1) {
                    if (user1[0]) {
                        var newItem = {
                            imgname: user1[0].imgname,
                            description: user1[0].description,
                            contentType: user1[0].contentType,
                            size: user1[0].size,
                            img: user1[0].img,
                            username: data.data.Shareusername
                        };

                        global.db.collection('UploadedFiles')
                            .insert(newItem, function(err, result){
                                if (err) { console.log(err); };
                                console.log("File Shared");
                                var payloads = [
                                    {
                                        topic: data.replyTo,
                                        messages: JSON.stringify({
                                            correlationId: data.correlationId,
                                            data: "201"
                                        }),
                                        partition: 0
                                    }
                                ];
                                producer.send(payloads, function (err, data) {
                                    console.log(data);
                                });
                                return;
                            });
                    }
                    else
                    {
                        console.log("File not found!");

                        var payloads = [
                            {
                                topic: data.replyTo,
                                messages: JSON.stringify({
                                    correlationId: data.correlationId,
                                    data: "401"
                                }),
                                partition: 0
                            }
                        ];
                        producer.send(payloads, function (err, data) {
                            console.log(data);
                        });
                        return;
                    }
                });
            }
            else {
                console.log("User not found");

                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "401"
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});

consumer.on('message', function (message) {
    var data = JSON.parse(message.value);

    if(message.topic === "dropbox_group") {
        console.log('dropbox_group received' + message.topic);

        var coll = global.db.collection('register');
        coll.find({username: data.data.ToUsername}).toArray(function (err, user) {
            if (user[0])
            {
                var addGroup ={
                    groupname:data.data.imgname,
                    owner:data.data.username,
                    member:data.data.ToUsername
                };
                global.db.collection('Group')
                    .insert(addGroup, function(err, result) {
                        if (err) { console.log(err); };

                    });

                var newItem = {
                    imgname: data.data.imgname,
                    description: "",
                    contentType: "",
                    size: "",
                    img: "",
                    filetype:"group",
                    parentfolder:"",
                    username: data.data.ToUsername
                };


                global.db.collection('UploadedFiles')
                    .insert(newItem, function(err, result){
                        if (err) { console.log(err); };
                        console.log("File Shared");
                        var payloads = [
                            {
                                topic: data.replyTo,
                                messages: JSON.stringify({
                                    correlationId: data.correlationId,
                                    data: "201"
                                }),
                                partition: 0
                            }
                        ];
                        producer.send(payloads, function (err, data) {
                            console.log(data);
                        });
                        return;
                    });

            }
            else
            {
                console.log("User not found");

                var payloads = [
                    {
                        topic: data.replyTo,
                        messages: JSON.stringify({
                            correlationId: data.correlationId,
                            data: "401"
                        }),
                        partition: 0
                    }
                ];
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
                return;
            }
        });
    }
});

