
router.post('/doLogin', function (req, res, next) {

    var reqUsername = req.body.username;
    var reqPassword = req.body.password;
    req.session.username = req.body.username;

    mongo.connect(mongoRegisterURL, function(){
        console.log('Connected to mongo at: ' + mongoRegisterURL);
        var coll = mongo.collection('register');

        coll.find({username: reqUsername}).toArray(function(err, user){
            if (user[0]) {
                console.log("LOGIN: "+user);
                var hashedPassword = user[0].password;
                bcrypt.compare(reqPassword, hashedPassword, (err, result) => {
                    if (err) {
                        console.log('bcrypt - error - ', err);
                        res.status(401).json({message: "Login failed"});
                    } else {
                        console.log('bcrypt - result - ', result);
                        res.status(201).json({message: "Login successful"});
                        global.username = reqUsername;
                        return res.username === reqUsername;
                    }
                });
            }
            else {
                res.status(401).json({message: "Login failed"});
            }
        });
    });
});


router.post('/doRegister', function (req, res, next) {

    var reqUsername = req.body.username;
    var reqPassword = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(reqPassword, salt, (err, hash) => {
            mongo.connect(mongoRegisterURL, function(){
                console.log('Connected to mongo at: ' + mongoRegisterURL);
                var coll = mongo.collection('register');

                coll.findOne({username: reqUsername}, function(err, user){
                    if (user) {
                        res.status(401).json({message: "Already exists"});
                    }
                    else if (err){
                        throw err;

                    } else {
                        coll.insert({
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            username: req.body.username,
                            password: hash
                        }, function (err, user) {
                            if (err) throw err;
                            else{

                                var coll_UserDetails = mongo.collection('UserDetails');
                                coll_UserDetails.insert({
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    education:"" ,
                                    course:"",
                                    organization:"",
                                    designation:"",
                                    contact:"",
                                    email:"",
                                    shows:"",
                                    music:"",
                                    sports:"",
                                    username:req.body.username
                                }, function (err, user1) {
                                    if (err) throw err;
                                    else{
                                        console.log("Registered: " + user1);
                                        res.status(201).json({message: "Registration successful"});
                                        return res.username === reqUsername;
                                    }
                                });
                            }
                        });
                    }
                });
            });
        });
    });
});


router.post('/doUserDetails', function (req, res, next) {

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

    mongo.connect(mongoRegisterURL, function(){
        var coll = mongo.collection('register');
        coll.find({username: reqUsername}).toArray(function(err, user){
            if (user[0]) {
                var user_name = user[0].username;
                var coll_UserDetails = mongo.collection('UserDetails');
                coll_UserDetails.find({username: reqUsername}).toArray(function(err, userDetails){
                    if(err)
                        throw err;
                    else if (userDetails) {
                        var myquery = { username: user_name };
                        var newvalues = {
                            firstname: firstname,
                            lastname: lastname,
                            education:education ,
                            course:course,
                            organization:organization,
                            designation:designation,
                            contact:contact,
                            email:email,
                            shows:shows,
                            music:music,
                            sports:sports,
                            username:user_name};
                        var coll_UserDetailsUpdate = mongo.collection('UserDetails');

                        coll_UserDetailsUpdate.updateOne(myquery, newvalues, function(err, userdetailsupdate) {
                            if (err) throw err;
                            else{
                                console.log("1 UserDetails updated: " + userdetailsupdate);
                                res.status(201).json({message: "Details updated!"});
                                // return res.username === reqUsername;
                                return res;
                            }
                        });
                    }
                    else {
                        var coll_UserDetails = mongo.collection('UserDetails');
                        coll_UserDetails.insert({
                            firstname: firstname,
                            lastname: lastname,
                            education:education ,
                            course:course,
                            organization:organization,
                            designation:designation,
                            contact:contact,
                            email:email,
                            shows:shows,
                            music:music,
                            sports:sports,
                            username:reqUsername
                        }, function (err, res) {
                            if (err) throw err;
                            else{
                                console.log("1 UserDetails updated: " + res);
                                res.status(201).json({message: "Details updated!"});
                                // return res.username === reqUsername;
                                return res;
                            }
                        });
                    }
                });
            }
            else {
                res.status(401).json({message: "Not found"});
            }
        });
    });
});


router.get('/getUserDetails', function (req, res, next) {

    var reqUsername = global.username;
    console.log("GET getUserDetails: "+req.query);

    mongo.connect(mongoRegisterURL, function(){
        var coll = mongo.collection('register');
        coll.find({username: reqUsername}).toArray(function(err, user){
            if (user[0]) {
                var user_name = user[0].username;
                console.log("userDetails:"+user_name);

                var coll_UserDetails = mongo.collection('UserDetails');
                coll_UserDetails.find({username: reqUsername}).toArray(function(err, userDetails){
                    if (userDetails) {
                        console.log("userDetails:"+userDetails);
                        res.status(200).send(userDetails);
                    }
                    else {
                        res.status(401).json({message: "Not found"});
                    }
                });

            }
            else {
                res.status(401).json({message: "Not found"});
            }
        });
    });
});




router.post('/doLogin1', function (req, res, next) {

    var reqUsername = req.body.username;
    var reqPassword = req.body.password;

    var getUser="select * from user where username='"+reqUsername+"';" ;
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {

            if(results.length > 0){

                var hashedPassword = results[0].password;
                bcrypt.compare(reqPassword, hashedPassword, (err, result) => {
                    if (err) {
                        console.log('bcrypt - error - ', err);
                        res.status(401).json({message: "Login failed"});
                    } else {
                        console.log('bcrypt - result - ', result);
                        res.status(201).json({message: "Login successful"});
                        global.username = reqUsername;
                        return res.username === reqUsername;
                    }
                });
            }
            else {

                res.status(401).json({message: "Login failed"});
            }
        }
    },getUser);

});

router.post('/doRegister1', function (req, res, next) {

    var reqUsername = req.body.username;
    var reqPassword = req.body.password;

    var getUser="select * from user where username='"+reqUsername+"'";
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(reqPassword, salt, (err, hash) => {
            mysql.fetchData(function(err,results){
                if(err){
                    throw err;
                }
                else
                {
                    if(results.length <= 0){
                        console.log("creating new user");
                        var adduser = "insert into user (username,password,firstname,lastname) values('"+req.body.username+"','"+hash+"','"+req.body.firstname+"','"+req.body.lastname+"');";
                        console.log("Insert Query is:"+adduser);

                        mysql.fetchData(function(err,results){
                            if(!err)
                            {

                                res.status(201).json({message: "Registration successful"});
                                return res.username === reqUsername;
                            }
                            else
                            {
                                res.status(401).json({message: "Already exists"});
                            }},adduser);
                    }
                    else {

                        res.status(401).json({message: "Already exists"});
                    }
                }
            },getUser);

        });
    });

});

router.post('/doUserDetails1', function (req, res, next) {

    var reqUsername = req.body.username;
    console.log("doUserDetails: "+reqUsername);

    var getUser="select * from user where username='"+reqUsername+"'";
    console.log("doUserDetails :Query is:"+getUser);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                var user_id = results[0].id;
                var adduser = "select * from UserDetails where user='"+user_id+"'";
                console.log("Insert Query is:"+adduser);
                mysql.fetchData(function(err,results1){
                    if(!err)
                    {
                        if(results1.length > 0)
                        {
                            var userdeatils_id = results1[0].id;
                            console.log("update result");
                            var adduserdetails = "UPDATE UserDetails SET firstname='"+ req.body.firstname +"',lastname='"+ req.body.lastname +"',university='"+ req.body.education +"',course='"+ req.body.course +"',organization='"+ req.body.organization +"',designation='"+ req.body.designation +"',contact='"+ req.body.contact +"',email='"+ req.body.email +"',shows='"+ req.body.shows +"',music='"+ req.body.music +"',sports='"+ req.body.sports +"' where user='"+user_id+"';" ;
                            console.log("Insert Query is:"+adduserdetails);
                            mysql.fetchData(function(err,results2){
                                if(!err)
                                {
                                    res.status(201).json({message: "Data Updated!"});
                                    return res.username === reqUsername;
                                }
                                else
                                {
                                    res.status(401).json({message: "Not found"});
                                }},adduserdetails);

                        }
                        else
                        {
                            console.log("insert result");
                            var adduserdetails = "insert into UserDetails (firstname,lastname,university,course,organization,designation,contact,email,shows,music,sports,user) values('"+req.body.firstname+"','"+req.body.lastname+"','"+req.body.education+"','"+req.body.course+"','"+req.body.organization+"','"+req.body.designation+"','"+req.body.contact+"','"+req.body.email+"','"+req.body.shows+"','"+req.body.music+"','"+req.body.sports+"','"+user_id+"');";
                            console.log("Insert Query is:"+adduserdetails);
                            mysql.fetchData(function(err,results2){
                                if(!err)
                                {
                                    res.status(201).json({message: "Data Updated!"});
                                    return res.username === reqUsername;
                                }
                                else
                                {
                                    res.status(401).json({message: "Not found"});
                                }},adduserdetails);
                        }
                    }
                    else
                    {
                        res.status(401).json({message: "Not found"});
                    }},adduser);
            }
            else {

                res.status(401).json({message: "Not found"});
            }
        }
    },getUser);


});

router.get('/getUserDetails1', function (req, res, next) {

    var reqUsername = global.username;
    console.log("GET getUserDetails: "+reqUsername);

    var getUser="select * from user where username='"+reqUsername+"'";
    console.log("getUserDetails :Query is:"+getUser);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                var user_id = results[0].id;
                var adduser = "select * from UserDetails where user='"+user_id+"'";
                console.log("Insert Query is:"+adduser);
                mysql.fetchData(function(err,results1){
                    if(!err)
                    {
                        if(results1.length > 0)
                        {
                            console.log("DB UserDetails: "+results1);
                            res.status(200).send(results1);
                        }
                        else
                        {
                            res.status(401).json({message: "Not found"});
                        }
                    }
                    else
                    {
                        res.status(401).json({message: "Not found"});
                    }},adduser);
            }
            else {

                res.status(401).json({message: "Not found"});
            }
        }
    },getUser);


});

////////////////////////////////////////////////////////////////////////////////////////////////
/*uploadFile.js*/

router.get('/', function (req, res, next) {
    var fileresp = [];
    var response = "", strJson="";
    console.log("Username get Node :"+global.username);

    mongo.connect(mongoRegisterURL, function(){
        var coll = mongo.collection('UploadedFiles');

        coll.find({username: global.username}).toArray(function(err, user){
            if (user) {
                console.log("Fetch files");
                for(var i=0;i<user.length;)
                {
                    response += (user[i].imgname)+"<br>";
                    strJson += '{"files":"' + user[i].imgname + '"}';
                    i = i + 1;
                    if (i < user.length) {
                        strJson += ',';
                    }
                }
                strJson = '{"UsernameName":"' + global.username + '","count":' + user.length + ',"UploadedFiles":[' + strJson + "]}";
                console.log("Ext:"+strJson);
                fileresp = user;
                res.status(200).send(JSON.parse(strJson));

            }
            else {
                res.status(401).json({message: "No files"});
            }
        });
    });
});

router.post('/upload', upload.single('mypic'), function (req, res){
    var reqUsername = req.body.username;
    if (req.file == null)
    {
        console.log("File not found. Cannot Upload");
    } else {

        mongo.connect(mongoRegisterURL, function(err, db){
            var newImg = fs.readFileSync(req.file.path);
            var encImg = newImg.toString('base64');
            var newItem = {
                imgname: req.file.originalname,
                description: req.body.description,
                contentType: req.file.mimetype,
                size: req.file.size,
                img: Buffer(encImg, 'base64'),
                username: reqUsername
            };

            mongo.collection('UploadedFiles')
                .insert(newItem, function(err, result){
                    if (err) { console.log(err); };
                    var newoid = new ObjectId(result.ops[0]._id);
                    console.log("File Uploaded");
                });
        });
    }
    res.status(204).end();
});


router.post('/delete', function (req, res){
    var reqUsername = req.body.username;
    var deletefile = req.body.file;
    console.log("DELETE FUNCTION "+req.body.username + " " + req.body.file);
    if (!deletefile)
    {
        console.log('file not found');
    } else {
        var path= './public/uploads/'+reqUsername+'/'+deletefile;
        fs.unlink(path,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');
            mongo.connect(mongoRegisterURL, function(err, db){
                var newItem = {
                    imgname: deletefile,
                    username: reqUsername
                };

                mongo.collection('UploadedFiles')
                    .remove(newItem, function(err, result){
                        if (err) { console.log(err); };
                        console.log('file deleted successfully');

                    });
            });
        });
    }
    res.status(204).end();
});

router.post('/uploadShare',upload.single('mypic'),  function (req, res,  next) {

    var reqUsername = req.body.username;
    console.log("Share username:"+reqUsername);
    console.log("Share usernameShared:"+req.body.Shareusername);
    console.log("Share file:"+req.body.mypic);
    console.log("DIR: "+__dirname);

    let filename = req.body.mypic;
    let src = path.join(__dirname, '/../public/uploads/'+req.body.username+'/'+filename);
    let destDir = path.join(__dirname, '/../public/uploads/'+req.body.Shareusername);
    console.log("filename: "+filename);
    console.log("src: "+src);
    console.log("destDir: "+destDir);

    mongo.connect(mongoRegisterURL, function(){
        var coll = mongo.collection('register');
        coll.find({username: req.body.Shareusername}).toArray(function(err, user){
            if (user[0])
            {
                var coll = mongo.collection('UploadedFiles');
                coll.find({username: reqUsername, imgname:filename}).toArray(function(err, user1) {
                    if (user1[0]) {
                        mongo.connect(mongoRegisterURL, function(err, db){
                            var newItem = {
                                imgname: user1[0].imgname,
                                description: user1[0].description,
                                contentType: user1[0].contentType,
                                size: user1[0].size,
                                img: user1[0].img,
                                username: req.body.Shareusername
                            };

                            mongo.collection('UploadedFiles')
                                .insert(newItem, function(err, result){
                                    if (err) { console.log(err); };
                                    var newoid = new ObjectId(result.ops[0]._id);

                                    fs.access(destDir, (err) => {
                                        if(err)
                                            fs.mkdirSync(destDir);
                                        copyFile(src, path.join(destDir, filename));
                                    });

                                    console.log("File Shared");
                                    res.status(204).end();
                                });
                        });
                    }
                    else
                    {
                        res.status(401).json({message: "File not found!!"});
                    }
                });
            }
            else {
                res.status(401).json({message: "User not found!!"});
            }
        });
    });
});


router.get('/1', function (req, res, next) {
    var sess = req.session.username;
    var resArr = [];
    console.log("Username get Node :"+global.username);

    var getFiles="select * from files where owner in (select id from user where username='"+global.username+"');";
    console.log("Query is:"+getFiles);
    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                console.log("Fetch files");
                console.log(results);
            }
            else {
                //res.status(401).json({message: "No files"});
            }
        }
    },getFiles);

    var response = "";
    fs.readdir("public/uploads/"+global.username, function (err, files)
    {
        var fileresp = [];
        if(files)
        {
            console.log(files.length);
            console.log(files);
            for(var i=0;i<files.length;i++)
            {
                response += path.extname(files[i])+"<br>";
            }
            console.log("Ext:"+response);
            fileresp = files;
        }
        res.status(200).send(fileresp);
    });
});
router.post('/upload1', upload.single('mypic'), function (req, res,  next) {
    var reqUsername = req.body.username;
    console.log("Username upload Node :"+reqUsername);
    console.log(req.body);
    console.log(req.file);

    var getUser="select * from user where username='"+reqUsername+"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                console.log("insert into files table");
                console.log(results[0].id);
                var addfile = "insert into Files (filename,owner) values ('"+req.file.originalname+"',"+results[0].id+");";
                console.log("Insert Query is:"+addfile);

                mysql.fetchData(function(err,results){
                    if(!err)
                    {
                        // res.status(201).json({message: "File uploading successful"});
                        //return res.username === reqUsername;
                    }
                    else
                    {
                        //res.status(401).json({message: "File uploading not successful"});
                    }},addfile);
            }
            else {

                //res.status(401).json({message: "User doesn't exists"});
            }
        }
    },getUser);

    res.status(204).end();
});
router.post('/uploadShare1',upload.single('mypic'),  function (req, res,  next) {

    var reqUsername = req.body.username;
    console.log("Share username:"+reqUsername);
    console.log("Share usernameShared:"+req.body.Shareusername);
    console.log("Share file:"+req.body.mypic);
    console.log("DIR: "+__dirname);

    let filename = req.body.mypic;
    let src = path.join(__dirname, '/../public/uploads/'+req.body.username+'/'+filename);
    let destDir = path.join(__dirname, '/../public/uploads/'+req.body.Shareusername);
    console.log("filename: "+filename);
    console.log("src: "+src);
    console.log("destDir: "+destDir);

    fs.access(destDir, (err) => {
        if(err)
            fs.mkdirSync(destDir);
        copyFile(src, path.join(destDir, filename));
    });

    var getUser="select * from user where username='"+req.body.Shareusername+"'";
    console.log("Query is:"+getUser);

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            if(results.length > 0){
                console.log("insert into files table");
                console.log(results[0].id);
                var addfile = "insert into Files (filename,owner) values ('"+req.file.mypic+"',"+results[0].id+");";
                console.log("Insert Query is:"+addfile);

                mysql.fetchData(function(err,results){
                    if(!err)
                    {
                        // res.status(201).json({message: "File uploading successful"});
                        //return res.username === reqUsername;
                    }
                    else
                    {
                        //res.status(401).json({message: "File uploading not successful"});
                    }},addfile);
            }
            else {

                //res.status(401).json({message: "User doesn't exists"});
            }
        }
    },getUser);

    res.status(204).end();
});
