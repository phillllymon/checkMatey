import React from 'react';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ChessTableContainer from './chess_table/chess_table_container';
import Splash from './splash';
import OtherGameContainer from './otherGame/other_game_container';
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
                    <Route
                        path="/sandbox"
                        render={() => <ChessTableContainer player={'sandbox'} />}
                    />
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
                    <Route path="/notChess" component={OtherGameContainer} />
                    <Route 
                        path="/play" 
                        render={() => <ChessTableContainer player={'guest'} />}
                    />
                </div>
            );
        }
    }
    
};

export default App;