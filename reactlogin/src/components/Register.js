import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Register extends Component {

    static propTypes = {
        handleDonationSubmit: PropTypes.func.isRequired
    };

    state = {
        username: '',
        password: '',
        firstname: '',
        lastname: ''
    };

    componentWillMount(){
        this.setState({
            username: '',
            password: '',
            firstname: '',
            lastname: ''
        });
    }



    render() {
        return (
            <div className="row justify-content-md-center">
                <div className="col-md-6">
                    <form>
                        <div className="form-group">
                        <span className="RegTitle">Sign up </span>
                        </div>
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

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.setState({
                                        username: event.target.value
                                    });
                                }}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                className="form-control"
                                type="password"
                                label="password"
                                placeholder="Enter Password"
                                value={this.state.password}
                                onChange={(event) => {
                                    this.setState({
                                        password: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this.props.handleDonationSubmit(this.state)}>
                                Sign up for free
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Register;