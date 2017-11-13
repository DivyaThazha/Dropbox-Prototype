import React, {Component} from 'react';
import {Link,withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import Message from "./Message";

class About extends Component {

    static propTypes = {
        username: PropTypes.string.isRequired
    };

    state = {
        firstname : '',
        lastname : '',
        education : '',
        organization : '',
        course : '',
        designation : '',
        contact : '',
        email : '',
        shows: '',
        music: '',
        sports:'',
        message:""

    };

    componentWillMount(){
        this.setState({
            username : this.props.username,
            firstname : '',
            lastname : '',
            education : '',
            organization : '',
            course : '',
            designation : '',
            contact : '',
            email : '',
            shows: '',
            music: '',
            sports:'',
            message:''
        });
    }

    componentDidMount() {
        API.getUserDetails()
            .then((data) => {
            if(data[0])
            {
                console.log("ABOUT ABOUT: "+data[0].firstname);
                this.setState({
                    firstname: data[0].firstname,
                    lastname:data[0].lastname,
                    education:data[0].education,
                    organization:data[0].organization,
                    course:data[0].course,
                    designation:data[0].designation,
                    contact:data[0].contact,
                    email:data[0].email,
                    shows:data[0].shows,
                    music:data[0].music,
                    sports:data[0].sports,
                    message: "",
                });
            }
            });

    };

    handleUserDetailsSubmit  = (userdata) => {
        API.doUserDetails(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        username: userdata.username,
                        message:"Data saved!"
                    });
                    console.log("MESS: "+this.state.message);
                } else if (status === 401) {
                    this.setState({
                        message: "Cannot update user details!"
                    });
                }
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
                    <div className="HomeTitle">About</div>
                    <div className="RecentTitle">Personal Details</div>
                    <div className="RecentContent">
                        <div className="RecentContent">
                            <div className="row justify-content-md-center">
                                <div className="col-md-4">
                                    <form>
                                        <div className="form-group aboutInputTitle">
                                            First Name
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Last Name
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5">
                                    <form>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="Firstname"
                                                placeholder="Enter Firstname"
                                                value={this.state.firstname}
                                                onChange={(event) => {
                                                    this.setState({
                                                        firstname: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="Lastname"
                                                placeholder="Enter Lastname"
                                                value={this.state.lastname}
                                                onChange={(event) => {
                                                    this.setState({
                                                        lastname: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="RecentTitle">Education Details</div>
                    <div className="RecentContent">
                        <div className="RecentContent">
                            <div className="row justify-content-md-center">
                                <div className="col-md-4">
                                    <form>
                                        <div className="form-group aboutInputTitle">
                                            University Attended
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Course
                                        </div>
                                    </form>
                                </div>

                                <div className="col-md-5">
                                    <form>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="Education"
                                                placeholder="Enter Recent University"
                                                value={this.state.education}
                                                onChange={(event) => {
                                                    this.setState({
                                                        education: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="course"
                                                placeholder="Enter Course"
                                                value={this.state.course}
                                                onChange={(event) => {
                                                    this.setState({
                                                        course: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="RecentTitle">Professional Details</div>
                    <div className="RecentContent">
                        <div className="RecentContent">
                            <div className="row justify-content-md-center">
                                <div className="col-md-4">
                                    <form>
                                        <div className="form-group aboutInputTitle">
                                            Organization
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Designation
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5">
                                    <form>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="organization"
                                                placeholder="Enter Organization"
                                                value={this.state.organization}
                                                onChange={(event) => {
                                                    this.setState({
                                                        organization: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="designation"
                                                placeholder="Enter Designation"
                                                value={this.state.designation}
                                                onChange={(event) => {
                                                    this.setState({
                                                        designation: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="RecentTitle">Contact Details</div>
                    <div className="RecentContent">
                        <div className="RecentContent">
                            <div className="row justify-content-md-center">
                                <div className="col-md-4">
                                    <form>
                                        <div className="form-group aboutInputTitle">
                                            Contact
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Email Id
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5">
                                    <form>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="contact"
                                                placeholder="Enter Contact Number"
                                                value={this.state.contact}
                                                onChange={(event) => {
                                                    this.setState({
                                                        contact: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="email"
                                                placeholder="Enter Email"
                                                value={this.state.email}
                                                onChange={(event) => {
                                                    this.setState({
                                                        email: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="RecentTitle">Interest</div>
                    <div className="RecentContent">
                        <div className="RecentContent">
                            <div className="row justify-content-md-center">
                                <div className="col-md-4">
                                    <form>
                                        <div className="form-group aboutInputTitle">
                                            Shows
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Music
                                        </div>
                                        <div className="form-group aboutInputTitle">
                                            Sports
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5">
                                    <form>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="shows"
                                                placeholder="Enter Shows"
                                                value={this.state.shows}
                                                onChange={(event) => {
                                                    this.setState({
                                                        shows: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="music"
                                                placeholder="Enter Music"
                                                value={this.state.music}
                                                onChange={(event) => {
                                                    this.setState({
                                                        music: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <input
                                                className="form-control"
                                                type="text"
                                                label="sports"
                                                placeholder="Enter Sports"
                                                value={this.state.sports}
                                                onChange={(event) => {
                                                    this.setState({
                                                        sports: event.target.value
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={() => this.handleUserDetailsSubmit(this.state)}>
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row justify-content-md-center">
                        <div className="col-md-9">
                            <form>
                                <Message message={this.state.message}/>
                            </form>
                        </div>
                    </div>

                </div>

                <div className="RightSection">
                    <div className="Logout"> <Link to="/">Logout</Link> </div>

                </div>
            </div>
        )
    }
}

export default About;