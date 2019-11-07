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
        this.demoLogin = this.demoLogin.bind(this);
        this.animateDemoLogin = this.animateDemoLogin.bind(this);

        this.mobile = typeof window.orientation !== 'undefined';

        this.interval = null;
        this.demoName = ['D', 'e', 'm', 'o', 'U', 's', 'e', 'r'];
    }
    
    updateField(field) {
        return (e) => {
            this.setState({[field]: e.target.value});
        };
    }

    animateDemoLogin() {
        this.interval = setInterval(() => {
            if (this.demoName.length > 0) {
                let nextChar = this.demoName.shift();
                this.setState({ username: this.state.username + nextChar });
            }
            else {
                this.setState({ password: this.state.password + 'a' });
            }
        }, 60);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
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

    demoLogin(e) {
        e.preventDefault();
        this.animateDemoLogin();
        this.props.setTour(1);
        this.props.login({ username: 'DemoUser', password: '123456', demo: 'true' });
        <Redirect to='/home' />
    }

    render() {
        if (this.mobile) {
            return(
            <div>
                    <div className="modal_back" style={{ 'position': 'absolute' }}  onClick={this.backToSplash}></div>
                    <div className="session_modal_mobile" style={{ 'position': 'absolute' }} >
                    <br />
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
                        <br/>
                        <center><h1>Welcome Aboard!</h1>
                        
                            <br/>
                            Username:
                            <br/>
                                <input
                                    className="input_field_mobile"
                                    type="text"
                                    value={this.state.username}
                                    onChange={this.updateField('username')}
                                />
                            <br/>
                            Email:
                            <br />
                                <input
                                    className="input_field_mobile"
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.updateField('email')}
                                />
                            <br/>
                            Password:
                            <br />
                                <input
                                    className="input_field_mobile"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.updateField('password')}
                                />
                            <br/>
                            <div className="submit_bar">
                                <button className="session_button_mobile" type="submit" >Create Account</button>
                                <i>or</i>
                                    <button onClick={this.demoLogin} className="session_button_mobile" >Demo Login</button>
                            </div>
                        </center>
                    </form>
                    <div className="submit_bar">
                        Already have an account?
                        <button className="session_button_mobile" onClick={this.toLogin}>Login</button>
                    </div>
                </div>
            </div>
            );
        }
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
                            <button onClick={this.demoLogin} className="session_button" >Demo Login</button>
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