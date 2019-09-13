import React from 'react';
import { Redirect } from 'react-router-dom';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this.props.clearErrors();

        this.updateField = this.updateField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.backToSplash = this.backToSplash.bind(this);
        this.toSignup = this.toSignup.bind(this);
        this.demoLogin = this.demoLogin.bind(this);
    }

    updateField(field) {
        return (e) => {
            this.setState({ [field]: e.target.value });
        };
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.login(this.state);
        <Redirect to='/home' />
    }

    backToSplash(e) {
        this.props.history.push('/');
    }

    toSignup(e) {
        this.props.history.push('/signup');
    }

    demoLogin(e) {
        e.preventDefault();
        this.props.login({username: 'gMaster42', password: '123456'});
        <Redirect to='/home' />
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
                                this.props.errors.map( (error, idx) => {
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
                        <center><div className="med_pirate"></div><h1>Welcome Back, Matey!</h1></center>
                        <table className="session_form">
                            <tbody>
                                <tr>
                                    <td width="40%">Username</td>
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
                            </tbody>
                        </table>
                        <div className="submit_bar">
                            <button className="session_button" type="submit" >Log In</button>
                            <i>or</i>
                            <button onClick={this.demoLogin} className="session_button" >Demo Login</button>
                        </div>
                    </form>
                    <div className="submit_bar">
                        Don't have an account?
                        <button className="session_button" onClick={this.toSignup}>Sign Up</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginForm;