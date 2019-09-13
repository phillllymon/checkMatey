import React from 'react';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import Splash from './splash';
import Home from './home';
import { Route, Redirect, Link } from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        if (this.props.userId) {
            return (
                <div>
                    <Route path="/home" component={Home} />
                    <Redirect to='/home' />
                </div>
            );
        }
        else {
            return (
                <div>
                    <Splash />                                  
                    <Route path="/login" component={LoginFormContainer} />
                    <Route path="/signup" component={SignupFormContainer} />
                    
                </div>
            );
        }
    }
    
};

export default App;