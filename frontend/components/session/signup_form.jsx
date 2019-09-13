import React from 'react';
import { Redirect } from 'react-router-dom';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: ''
        };
        this.props.clearErrors();

        this.updateField = this.updateField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.backToSplash = this.backToSplash.bind(this);
        this.toLogin = this.toLogin.bind(this);
    }
    
    updateField(field) {
        return (e) => {
            this.setState({[field]: e.target.value});
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.signup(this.state);
        <Redirect to='/home' />
    }

    backToSplash(e) {
        this.props.history.push('/');
    }

    toLogin(e) {
        this.props.history.push('/login');
    }

    render() {
        return (
            <div>
                <div className="modal_back" onClick={this.backToSplash}></div>
                <div className="session_modal">
                    <br/>
                    <div className="errors">
                        <center>
                            {
                                this.props.errors.map((error, idx) => {
                                    return (
                                        <div key={idx}>
                                            {error}
                                        </div>
                                    );
                                })
                            }
                        </center>
                    </div>
                    <form onSubmit={this.handleSubmit}>
                        <center><h1>Welcome Aboard!</h1><div className="med_pirate"></div></center>
                        <table className="session_form">
                            <tbody>
                            <tr>
                                <td>Username</td>
                                <td>
                                    <input
                                        className="input_field"
                                        type="text"
                                        value={this.state.username}
                                        onChange={this.updateField('username')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td width="40%">Email</td>
                                <td>
                                    <input
                                        className="input_field"
                                        type="email"
                                        value={this.state.email}
                                        onChange={this.updateField('email')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Password</td>
                                <td>
                                    <input
                                        className="input_field"
                                        type="password"
                                        value={this.state.password}
                                        onChange={this.updateField('password')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>Skill Level</td>
                                <td>
                                    <select className="input_field">
                                        <option value="1">New to Chess</option>
                                        <option value="2">Beginner</option>
                                        <option value="3">Intermediate</option>
                                        <option value="4">Advanced</option>
                                        <option value="5">Expert</option>
                                    </select>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="submit_bar">
                            <button className="session_button" type="submit" >Create Account</button>
                            <i>or</i>
                            <button className="session_button" >Demo Login</button>
                        </div>
                    </form>
                    <div className="submit_bar">
                        Already have an account?
                        <button className="session_button" onClick={this.toLogin}>Login</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default SignupForm;