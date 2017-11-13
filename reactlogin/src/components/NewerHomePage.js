import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Register from "./Register";
import Welcome from "./Welcome";
import About from "./About";

class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        username: ''
    };

    handleSubmit = (userdata) => {
        API.doLogin(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "",
                        username: userdata.username
                    });
                    this.props.history.push("/welcome");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };
    handleDonationSubmit  = (userdata) => {
        API.doRegister(userdata)
            .then((status) => {
                if (status === 201) {
                    this.setState({
                        isLoggedIn: true,
                        message: "",
                        username: userdata.username
                    });
                    this.props.history.push("/welcome");
                } else if (status === 401) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Wrong username or password. Try again..!!"
                    });
                }
            });
    };


    render() {
        return (
            <div className="container-fluid">
                <div>
                    <img src="dropboxLogo.png" alt={"Logo"}/>
                </div>

               <Route exact path="/" render={() => (
                    <div className="">
                        <img className="leftSection" src="dropboxContent.jpg" alt={"COntent"}/>

                        <button className="login" onClick={() => {
                            this.props.history.push("/login");
                        }}>
                            Sign in
                        </button><br/>OR<br/>
                       <Register handleDonationSubmit={this.handleDonationSubmit}/>
                    </div>

                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/register" render={() => (
                    <div>
                        <Register handleDonationSubmit={this.handleDonationSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome username={this.state.username}/>
                )}/>
                <Route exact path="/personalDetails" render={() => (
                    <About username={this.state.username}/>
                )}/>
            </div>
        );
    }
}

export default withRouter(NewerHomePage);