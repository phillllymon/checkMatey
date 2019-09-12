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

    render() {
        return (
            <div>
                {
                    this.props.errors.map((error, idx) => {
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
                    <label>Email
                        <input
                            type="email"
                            value={this.state.email}
                            onChange={this.updateField('email')}
                        />
                    </label>
                    <label>Password
                        <input
                            type="password"
                            value={this.state.password}
                            onChange={this.updateField('password')}
                        />
                    </label>
                    <label>Skill Level
                        <select>
                            <option value="1">New to Chess</option>
                            <option value="2">Beginner</option>
                            <option value="3">Intermediate</option>
                            <option value="4">Advanced</option>
                            <option value="5">Expert</option>
                        </select>
                    </label>
                    <input type="submit" value="Create your FREE Account" />
                </form>
            </div>
        );
    }
}

export default SignupForm;