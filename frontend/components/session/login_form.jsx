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

    render() {
        return (
            <div>
                {
                    this.props.errors.map( (error, idx) => {
                        return (
                            <div key={idx}>
                                {error}
                            </div>
                        );
                    })
                }
                <form onSubmit={this.handleSubmit}>
                    <label>Username
                        <input
                            type="text"
                            value={this.state.username}
                            onChange={this.updateField('username')}
                        />
                    </label>
                    <label>Password
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.updateField('password')}
                        />
                    </label>
                    <input type="submit" value="Log In" />
                </form>
            </div>
        );
    }
}

export default LoginForm;