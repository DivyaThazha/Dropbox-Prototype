import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import TextField from 'material-ui/TextField';
import Modal from './Modal';
import Message from "./Message";

class Welcome extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired
    };

    state = {
        username : ''
    };

    constructor(props) {
        super(props);
        this.state = {
            images: [],
            file:"",
            isOpen: false,
            ShareUsername:"",
            ToUsername:"",
            message:"",
            FolderisOpen :false,
            SharedFolderisOpen: false,
            Foldername:"",
            Foldertitle:"Recent",
            filetype:"",
            Groupname:"",
            IfInGroupFolder:false,
            Allmembers: [],
            itemtype:""
        };
    }

    componentDidMount() {
        document.title = `${this.state.username}'s DropBox!`;
        API.getImages()
            .then((data) => {
                console.log("Files from mongo:"+data.UploadedFiles);
                this.setState({
                    images: data.UploadedFiles
                });
            });
    };

    componentWillMount(){
        this.setState({
            username : this.props.username,
            message:""
        });

    }

    handleFileUpload = (event) => {

        const payload = new FormData();
        payload.append('mypic', event.target.files[0]);
        var username = this.state.username;
        console.log("UsernameUpload:"+username);
        payload.append('username',username);
        payload.append('Foldertitle',this.state.Foldertitle);
        if(this.state.Foldertitle =="Recent")
        {
            API.uploadFile(payload)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    images: data.UploadedFiles
                                });
                            });
                    }
                });
        }
        else if( this.state.IfInGroupFolder === true )
        {
            payload.append('Foldertitle',this.state.Foldertitle);
            API.uploadFileGroup(payload)
                .then((status) => {
                    if (status === 204) {
                        let data = {
                            username: username,
                            folder :this.state.Foldertitle
                        };
                        API.ViewGroup(data)
                            .then((results) => {
                                this.setState({
                                    images: results.UploadedFiles,
                                    IfInGroupFolder:true
                                });
                            });
                    }
                });
        }
        else
        {
            let data = {
                username: username,
                folder :this.state.Foldertitle
            };
            API.uploadFile(payload)
                .then((status) => {
                    if (status === 204) {
                        API.ViewFolder(data)
                            .then((results) => {
                                this.setState({
                                    images: results.UploadedFiles
                                });
                            });
                    }
                });
        }

    };

    handleFileDelete = (file,itemtype) => {
        //to delete file
        var username = this.state.username;
        if(itemtype === "folder" || itemtype === "group")
        {
            let data = {
                username: username,
                Foldertitle:this.state.Foldertitle,
                folder: this.state.Foldertitle,
                file :file,
                itemtype:itemtype
            }

            API.deleteFolder(data)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    images: data.UploadedFiles
                                });
                            });
                    }
                });

        }
        else
        {
            let data = {
                username: username,
                Foldertitle:this.state.Foldertitle,
                folder: this.state.Foldertitle,
                file :file
            }

            if(this.state.Foldertitle=="Recent")
            {
                API.deleteFile(data)
                    .then((status) => {
                        if (status === 204) {
                            API.getImages()
                                .then((data) => {
                                    this.setState({
                                        images: data.UploadedFiles
                                    });
                                });
                        }
                    });
            }
            else
            {
                API.deleteFile(data)
                    .then((status) => {
                        if (status === 204) {
                            API.ViewFolder(data)
                                .then((results) => {
                                    this.setState({
                                        images: results.UploadedFiles
                                    });
                                });
                        }
                    });
            }
        }

    };

    handleFileDownload = (file) => {
        //to download file
        this.state.file = file;
        console.log("DOWNLOAD FILE:"+this.state.file);

        API.getFiles()
             .then((data) => {
                 this.setState({
                     file: data
                 });
             });
    };

    toggleModal = (file) => {
        //share popup
        this.setState({
            isOpen: !this.state.isOpen,
            file: file,
            message:""
        });
    };

    FoldertoggleModal = () => {
        //create folder popup
        this.setState({
            FolderisOpen: !this.state.FolderisOpen,
            message:""
        });
    };

    SharedFoldertoggleModal = () => {
        //create folder popup
        this.setState({
            SharedFolderisOpen: !this.state.SharedFolderisOpen,
            message:""
        });
    };

    handleShare = (userdata) => {
        //share file
        console.log("Share by:"+this.state.username);
        console.log("Share file to:"+userdata);
        console.log("Share file:"+this.state.file);
        console.log("Share file:"+this.state.filetype);

        const payload = new FormData();
        payload.append('mypic', this.state.file);
        payload.append('Shareusername',userdata);
        payload.append('username',this.state.username);
        payload.append('filetype',this.state.filetype);

        if(this.state.filetype=="file")
        {
            API.uploadShareFile(payload)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    message:"File shared!"
                                });
                            });
                    }else if (status === 401) {
                        this.setState({
                            message: "Wrong username. Please enter correct username!"
                        });
                    }
                });
        }else{
                API.uploadShareFolder(payload)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    message:"File shared!"
                                });
                            });
                    }else if (status === 401) {
                        this.setState({
                            message: "Wrong username. Please enter correct username!"
                        });
                    }
                });
        }


    };

    handleCreateNewFolder = (userdata) =>{
        //create folder
        console.log("Create new folder"+userdata);
        if(userdata!="")
        {
            var username = this.state.username;
            let data = {
                username: username,
                folderName :userdata
            }
            API.createFolder(data)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    images: data.UploadedFiles
                                });
                            });
                        this.FoldertoggleModal();
                    }
                    else if (status === 402) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    message: "Folder already exists!"
                                });
                            });
                    }
                });
        }
    };

    handleCreateNewGroup = (userdata) =>{
        //create folder
        console.log("Create new Group"+userdata.Groupname+" "+userdata.ToUsername);
        if(userdata!="")
        {
            var username = this.state.username;
            let data = {
                username: username,
                Groupname :userdata.Groupname,
                ToUsername: userdata.ToUsername
            };
            API.createGroup(data)
                .then((status) => {
                    if (status === 204) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    images: data.UploadedFiles
                                });
                            });
                        this.SharedFoldertoggleModal();
                    }
                    else if (status === 402) {
                        API.getImages()
                            .then((data) => {
                                this.setState({
                                    message: "Group name already exists!"
                                });
                            });
                    }
                });
        }
    };

    handleViewFolder = (file) => {
        //to delete file
        var username = this.state.username;
        let data = {
            username: username,
            folder :file
        };
        console.log(file);
        API.ViewFolder(data)
            .then((results) => {
                this.setState({
                    images: results.UploadedFiles,
                    Foldertitle:file
                });
            });
    };

    handleViewGroup = (file) => {
        //to delete file
        var username = this.state.username;
        let data = {
            username: username,
            folder :file
        };
        console.log(file);
        API.ViewGroup(data)
            .then((results) => {
                this.setState({
                    imagesDummy: results.UploadedFiles,
                    images: results.UploadedFiles,
                    Foldertitle:file,
                    IfInGroupFolder:true,
                    Allmembers: results.AllMembers
                });
                console.log("Members:"+results)
            });
    };


    handleGotoRoot = () => {
        var username = this.state.username;
        console.log("go to root");
        API.getImages()
            .then((results) => {
                this.setState({
                    images: results.UploadedFiles,
                    Foldertitle:"Recent",
                    IfInGroupFolder:false
                });
            });
    };


    render(){
        return(
            <div className="row justify-content-md-center">
                <div className="LeftSection">
                    <div className="LeftHandTitle"><Link to="/welcome">Home</Link></div>
                    <div className="LeftHandTitle" ><Link to="/personalDetails">About</Link></div>

                </div>

                <div className="RecentSection">
                    <div className="HomeTitle">Home</div>
                    {this.state.Foldertitle == "Recent" ? (
                        <span></span>
                    ) : (
                        <div className="BacktoRoot" onClick={(event) => {
                            this.handleGotoRoot();
                        }}>Back</div>

                    )}
                    <div className="RecentTitle">{this.state.Foldertitle}</div>
                    {
                        this.state.IfInGroupFolder === true ? (
                            <div className="membersOfGroup">
                                Members:
                                {this.state.Allmembers.map((task, i) =>
                                    <div className="MembersList" >
                                        <img className="recentImage" src={'memberIcon.png'} alt={'logo'}/>
                                        {this.state.username}
                                        <div key={i}>
                                            <img className="recentImage" src={'memberIcon.png'} alt={'logo'}/>
                                            {task.members}

                                        </div>
                                    </div>

                                )}

                            </div>
                        ) : (
                            <span></span>
                        )
                    }

                    <div className="RecentContent">
                        {this.state.images.map((task, i) =>
                            <div className="RecentItem" key={i}>
                                {task.filetype == "file" ? (
                                    <img className="recentImage" src={'recent_image.png'} alt={'logo'}/>
                                ) : (
                                    task.filetype == "group" ? (
                                        <img className="recentImage" src={'Group.png'} alt={'logo'}/>
                                    ) : (
                                        <img className="recentImage" src={'folder.jpg'} alt={'logo'}/>
                                    )
                                )}
                                {task.files}
                                {
                                    this.state.IfInGroupFolder === true ? (
                                        <span className="createdbycolumn">
                                            created by: {task.createdby}
                                        </span>
                                    ) : (
                                        <span></span>
                                    )
                                }
                                <span className="Download" onClick={(event) => {
                                    this.setState({
                                        file: task.files
                                    });
                                    console.log("Deleting:"+task.files);
                                    this.handleFileDelete(task.files,task.filetype);
                                }}>Delete</span>

                                {task.filetype == "file" ? (
                                    <span className="Download" onClick={(event) => {
                                        this.setState({
                                            file: task.files
                                        });
                                        console.log("Downloading:"+task.files);
                                        this.handleFileDownload(task.files);
                                    }}>Download</span>
                                ) : (

                                    task.filetype == "folder" ? (
                                        <span className="Download" onClick={(event) => {
                                            this.setState({
                                                file: task.files
                                            });
                                            console.log("Downloading:"+task.files);
                                            this.handleViewFolder(task.files);
                                        }}>View Folder</span>
                                    ) : (
                                            <span className="Download" onClick={(event) => {
                                                this.setState({
                                                    file: task.files
                                                });
                                                console.log("Downloading:"+task.files);
                                                this.handleViewGroup(task.files);
                                            }}>View Group</span>
                                        )
                                )}

                                {task.filetype == "file" ? (
                                    this.state.IfInGroupFolder === true ? (
                                        <span></span>
                                    ) : (
                                        <span className="Download" onClick={(event) => {
                                            this.setState({
                                                file: task.files,
                                                filetype: task.filetype
                                            });
                                            console.log(task.files);
                                            this.toggleModal(task.files);
                                        }}>Share</span>
                                    )

                                ) : (
                                    <span></span>
                                )}

                            </div>
                        )}
                    </div>

                </div>

                <div className="RightSection">
                    <div className="Logout"> <Link to="/">Logout</Link> </div>

                    <div className="uploadButton">
                        <input id="myInput" name="mypic" type="file" ref={(ref) => this.upload = ref} style={{ display: 'none' }} onChange={this.handleFileUpload}/>
                        <button
                            className="btn btn-tertiary btn-upload"
                            onClick={(e) => this.upload.click() }
                        >Upload files
                        </button>
                    </div>
                    {this.state.IfInGroupFolder === true ? (
                        <span></span>
                    ) : (
                        <div>
                            <div>
                                <button
                                    className="btn btn-tertiary btn-newfolder"
                                    onClick={() => this.FoldertoggleModal(false)}>New folder
                                </button>
                            </div>
                            <div>
                                <button
                                className="btn btn-tertiary btn-newfolder"
                                onClick={() => this.SharedFoldertoggleModal(false)}>New shared folder
                                </button>
                            </div>
                        </div>
                    )}

                </div>

                <Modal show={this.state.isOpen}
                       onClose={this.toggleModal}
                        file={this.state.file}>
                    <div className="ModalFileTitle">
                        <img className="recentImage" src={'recent_image.png'} alt={'logo'}/>
                        {this.state.file}
                    </div>
                    <div className="ModalTitle">Share file with</div>
                    <form>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.ShareUsername}
                                onChange={(event) => {
                                    this.setState({
                                        ShareUsername: event.target.value
                                    });
                                }}
                            />
                        </div>
                    </form>
                    <div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.handleShare(this.state.ShareUsername)}>
                            Share
                        </button>
                    </div>
                        <div className="ModalMessage">
                            <form>
                                <Message message={this.state.message}/>
                            </form>
                        </div>
                </Modal>

                <Modal show={this.state.FolderisOpen}
                       onClose={this.FoldertoggleModal}
                       >
                    <div className="ModalTitle">Folder Name:</div>
                    <form>
                        <div className="form-group">
                            <input
                                className="form-control"
                                required
                                type="text"
                                label="Foldername"
                                placeholder="Enter Foldername"
                                value={this.state.Foldername}
                                onChange={(event) => {
                                    this.setState({
                                        Foldername: event.target.value
                                    });
                                }}
                            />
                        </div>
                    </form>
                    <div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.handleCreateNewFolder(this.state.Foldername)}>
                            Create Folder
                        </button>
                    </div>
                    <div className="ModalMessage">
                        <form>
                            <Message message={this.state.message}/>
                        </form>
                    </div>
                </Modal>

                <Modal show={this.state.SharedFolderisOpen}
                       onClose={this.SharedFoldertoggleModal}
                >
                    <div className="ModalTitle">Shared folder</div>
                    <form>

                        <div className="form-group">
                            <span className="SharedFolderlables">Folder name:</span>
                            <input
                                className="form-control"
                                required
                                type="text"
                                label="Foldername"
                                placeholder="Enter Foldername"
                                value={this.state.Groupname}
                                onChange={(event) => {
                                    this.setState({
                                        Groupname: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <span className="SharedFolderlables">To:</span>
                            <input
                                className="form-control"
                                required
                                type="text"
                                label="ToUsername"
                                placeholder="Enter Username"
                                value={this.state.ToUsername}
                                onChange={(event) => {
                                    this.setState({
                                        ToUsername: event.target.value
                                    });
                                }}
                            />
                        </div>
                    </form>
                    <div className="form-group">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={() => this.handleCreateNewGroup(this.state)}>
                            Share
                        </button>
                    </div>
                    <div className="ModalMessage">
                        <form>
                            <Message message={this.state.message}/>
                        </form>
                    </div>
                </Modal>

            </div>


        )
    }
}

export default withRouter(Welcome);