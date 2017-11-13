var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
let fs = require('fs-extra');
var mongo = require("./mongo");
var mongoRegisterURL = "mongodb://localhost:27017/sessions";
var kafka = require('./kafka/client');

var session = require('client-sessions');
router.use(session({
    cookieName: 'session',
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently

var storage = multer.diskStorage({

    destination: (req, file, callback) => {
        let type = global.CurrentFolder;
        let path = `./public/uploads/${type}`;
        if (!fs.existsSync(path)){
            fs.mkdirSync(path);
        }else
        {
            console.log("Directory already exist");
        }
        callback(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({storage:storage});

router.get('/',function(req, res) {
    var reqUsername = global.username;
    global.CurrentFolder = global.username;
    kafka.make_request('dropbox_getAllFiles', {"username": reqUsername}, function (err, results) {
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

/*router.post('/upload', function(req, res) {
    var parentFolder;
    var reqUsername = req.body.username;
    var FolderTitle = req.body.FolderTitle;
    var FolderTitle = req.body.mypic;
    if(FolderTitle == "Recent")
    {
        parentFolder = "";
        global.folderpath = reqUsername;
    }
    else{
        parentFolder = FolderTitle;
        global.folderpath = reqUsername+'/'+FolderTitle;
    }

    var upload = multer({
        storage: storage
    }).single('mypic')
    upload(req, res, function(err) {
        console.log("REQ REQ: "+req.file);

    });


    /*var upload = multer({
        storage: storage
    }).single('mypic')
    upload(req, res, function(err) {

        //let folder = `./public/uploads/${global.folderpath}`;
        //let path = folder+'/'+req.file.originalname;

        console.log(req.file);
        console.log(req.files);
        /*var newImg = fs.readFileSync(path);
        var encImg = newImg.toString('base64');
        var newItem = {
            imgname: req.file.originalname,
            description: req.body.description,
            contentType: req.file.mimetype,
            size: req.file.size,
            img: Buffer(encImg, 'base64'),
            filetype: "file",
            parentfolder: parentFolder,
            username: reqUsername
        };

        kafka.make_request('dropbox_upload', newItem, function (err, results) {
            console.log('in result: '+results);
            if (err) {
                res.end(err);
            }
            else {
                if (results == 401) {
                    res.status(401).send();
                }
                else {
                    res.status(204).send();
                }
            }
        });
    })
});*/


router.post('/upload', upload.single('mypic'), function (req, res){
    var reqUsername = req.body.username;
    var Foldertitle = req.body.Foldertitle;
    var parentfolder;
    if(Foldertitle=="Recent")
        parentfolder = "";
    else
        parentfolder = Foldertitle;

    if (req.file == null)
    {
        console.log("File not found. Cannot Upload");
    } else {

        var newImg = fs.readFileSync(req.file.path);
        var encImg = newImg.toString('base64');

        var newItem = {
            imgname: req.file.originalname,
            description: req.body.description,
            contentType: req.file.mimetype,
            size: req.file.size,
            img: Buffer(encImg, 'base64'),
            parentfolder:parentfolder,
            filetype:"file",
            username: reqUsername
        };

        kafka.make_request('dropbox_upload', newItem, function (err, results) {
            console.log('in result: '+results);
            if (err) {
                res.end(err);
            }
            else {
                if (results == 401) {
                    res.status(401).send();
                }
                else {
                    res.status(204).send();
                }
            }
        });
    }
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

    var newItem = {
        imgname: filename,
        username: reqUsername,
        Shareusername: req.body.Shareusername
    };


    kafka.make_request('dropbox_share', newItem, function (err, results) {
        console.log('in result: '+results);
        if (err) {
            res.end(err);
        }
        else {
            if (results == 401) {
                res.status(401).send();
            }
            else {
                fs.access(destDir, (err) => {
                    if(err)
                        fs.mkdirSync(destDir);
                    copyFile(src, path.join(destDir, filename));
                });
                res.status(204).end();

            }
        }
    });
});

router.get('/picture', function(req, res){
    //download file functionality
    var filename = "download.png";
    var filedownloaded="";
    console.log("PICTURE PICTURE"+global.DownloadFile);
    mongo.connect(mongoRegisterURL, function(){
        var coll = mongo.collection('UploadedFiles');
        coll.findOne({imgname: filename}, function(err, results){
            if(results)
            {
                res.setHeader('content-type', results.contentType);
                res.status(204).send(results.img.buffer);
                filedownloaded = results.img.buffer;
            }else
            {
                console.log("No file found!!!!");
                res.status(204).end();
            }

            });
    });
    return filedownloaded;
});

function copyFile(src, dest) {
    //Used in sharing file
    let readStream = fs.createReadStream(src);
    readStream.once('error', (err) => {
        console.log(err);
    });
    readStream.once('end', () => {
        console.log('done copying');
    });
    readStream.pipe(fs.createWriteStream(dest));
}

router.post('/delete', function (req, res){
    var reqUsername = global.username;
    var deletefile = req.body.file;
    var Foldertitle = req.body.Foldertitle;
    console.log("DELETE FUNCTION "+reqUsername + " " + req.body.file);

    if (!deletefile)
    {
        console.log('file not found');
    }
    else
    {
        var path,parentfolder;

        if(Foldertitle=="Recent"){
            path = './public/uploads/' + reqUsername + '/' + deletefile;
            parentfolder = "";
        }
        else{
            path = './public/uploads/' + reqUsername + '/' + Foldertitle+ '/' + deletefile;
            parentfolder = Foldertitle;
        }

        fs.unlink(path, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
            var newItem = {
                imgname: deletefile,
                username: reqUsername,
                parentfolder:parentfolder,
                isFolder: false,
                Isgroup:false
            };

            kafka.make_request('dropbox_delete', newItem, function (err, results) {
                console.log('in result: ' + results);
                if (err) {
                    res.end(err);
                }
                else {
                    if (results == 401) {
                        res.status(401).send();
                    }
                    else {
                        res.status(204).send();
                    }
                }
            });
        });
    }
});

router.post('/createFolder', function (req, res){
    var reqUsername = req.body.username;
    var folderName = req.body.folderName;
    console.log(reqUsername + " ## "+ folderName + " "+ req.body);
    let path = `./public/uploads/${reqUsername}/${folderName}`;
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);

        var newItem = {
            imgname: folderName,
            description: "",
            contentType: "",
            size: "",
            img: "",
            parentfolder:"",
            filetype : "folder",
            username: reqUsername
        };

        kafka.make_request('dropbox_upload', newItem, function (err, results) {
            console.log('in result: '+results);
            if (err) {
                res.end(err);
            }
            else {
                if (results == 401) {
                    res.status(401).send();
                }
                else {
                    res.status(204).send();
                }
            }
        });


    }else
    {
        res.status(402).send();
    }
});

router.post('/ViewFolder', function (req, res){
    var reqUsername = global.username;
    var folderName = req.body.folder;
    console.log("folderName: "+reqUsername+" "+folderName);
    let path = `./public/uploads/${reqUsername}/${folderName}`;
    if (fs.existsSync(path))
    {
        global.CurrentFolder = reqUsername +"/"+ folderName;
        kafka.make_request('dropbox_getFolderFiles', {"username": reqUsername,"folderName":folderName,"IsGroup":false}, function (err, results) {
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

    }else
    {
        res.status(402).send();
    }
});

router.post('/ShareFolder',  function (req, res) {

    var reqUsername = req.body.username;
    console.log("Share username:"+reqUsername);
    console.log("Share usernameShared:"+req.body.Shareusername);
    console.log("Share file:"+req.body.mypic);
    console.log("Share filetpe:"+req.body.filetype);
    console.log("DIR: "+__dirname);

    let filename = req.body.mypic;
    let src = path.join(__dirname, '/../public/uploads/'+req.body.username+'/'+filename);
    let destDir = path.join(__dirname, '/../public/uploads/'+req.body.Shareusername);
    console.log("filename: "+filename);
    console.log("src: "+src);
    console.log("destDir: "+destDir);

    var newItem = {
        imgname: filename,
        username: reqUsername,
        Shareusername: req.body.Shareusername
    };


    /*kafka.make_request('dropbox_share', newItem, function (err, results) {
        console.log('in result: '+results);
        if (err) {
            res.end(err);
        }
        else {
            if (results == 401) {
                res.status(401).send();
            }
            else {
                fs.access(destDir, (err) => {
                    if(err)
                        fs.mkdirSync(destDir);
                    copyFile(src, path.join(destDir, filename));
                });
                res.status(204).end();

            }
        }
    });*/
});


router.post('/createGroup', function (req, res){
    var reqUsername = req.body.username;
    var Groupname = req.body.Groupname;
    var ToUsername = req.body.ToUsername;

    let path = `./public/uploads/groups/${Groupname}`;
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);

        var newItem = {
            imgname: Groupname,
            description: "",
            contentType: "",
            size: "",
            img: "",
            parentfolder:"",
            filetype : "group",
            username: reqUsername,
            ToUsername :ToUsername
        };

        kafka.make_request('dropbox_upload', newItem, function (err, results) {
            console.log('in result: '+results);
            if (err) {
                res.end(err);
            }
            else {
                if (results == 401) {
                    res.status(401).send();
                }
                else {
                    kafka.make_request('dropbox_group', newItem, function (err, results) {
                        console.log('in result: '+results);
                        if (err) {
                            res.end(err);
                        }
                        else {
                            if (results == 401) {
                                res.status(401).send();
                            }
                            else {
                                res.status(204).send();
                            }
                        }
                    });
                    //res.status(204).send();
                }
            }
        });


    }else
    {
        res.status(402).send();
    }
});

router.post('/ViewGroup', function (req, res){
    var reqUsername = global.username;
    var folderName = req.body.folder;
    let path = `./public/uploads/groups/${folderName}`;
    if (fs.existsSync(path))
    {
        global.CurrentFolder = "groups/"+ folderName;
        kafka.make_request('dropbox_getFolderFiles', {"username": {$ne : ""},"folderName":folderName,"IsGroup":true}, function (err, results) {
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

    }else
    {
        res.status(402).send();
    }
});


router.post('/uploadFileGroup', upload.single('mypic'), function (req, res){
    var reqUsername = req.body.username;
    var Foldertitle = req.body.Foldertitle;

    if (req.file == null)
    {
        console.log("File not found. Cannot Upload");
    } else {

        var newImg = fs.readFileSync(req.file.path);
        var encImg = newImg.toString('base64');

        var newItem = {
            imgname: req.file.originalname,
            description: req.body.description,
            contentType: req.file.mimetype,
            size: req.file.size,
            img: Buffer(encImg, 'base64'),
            parentfolder:Foldertitle,
            filetype:"file",
            username: reqUsername
        };

        kafka.make_request('dropbox_upload', newItem, function (err, results) {
            console.log('in result: '+results);
            if (err) {
                res.end(err);
            }
            else {
                if (results == 401) {
                    res.status(401).send();
                }
                else {
                    res.status(204).send();
                }
            }
        });
    }
});

router.post('/deleteFolder', function (req, res){
    var reqUsername = global.username;
    var deletefile = req.body.file;
    var Foldertitle = req.body.Foldertitle;
    var itemtype = req.body.itemtype;

    if (!deletefile)
    {
        console.log('file not found');
    }
    else
    {
        var path,parentfolder,Isgroup;

        if(itemtype === "folder")
        {
            if(Foldertitle=="Recent"){
                path = './public/uploads/' + reqUsername + '/' + deletefile;
                parentfolder = "";
            }
            else{
                path = './public/uploads/' + reqUsername + '/' + Foldertitle+ '/' + deletefile;
                parentfolder = Foldertitle;
            }
            isFolder = true;
            Isgroup =false;
        }
        else
        {
            path = './public/uploads/groups/' + deletefile;
            parentfolder = "";
            Isgroup = true;
            isFolder = false;

        }

        if( fs.existsSync(path) )
        {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);

            var newItem = {
                imgname: deletefile,
                username: reqUsername,
                parentfolder:parentfolder,
                isFolder: isFolder,
                Isgroup: Isgroup

            };

            kafka.make_request('dropbox_delete', newItem, function (err, results) {
                console.log('in result: ' + results);
                if (err) {
                    res.end(err);
                }
                else {
                    if (results == 401) {
                        res.status(401).send();
                    }
                    else {
                        res.status(204).send();
                    }
                }
            });
        }
    }
});



module.exports = router;
