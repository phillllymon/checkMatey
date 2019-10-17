import React from 'react';
import LoginFormContainer from './session/login_form_container';
import SignupFormContainer from './session/signup_form_container';
import ChessTableContainer from './chess_table/chess_table_container';
import Splash from './splash';
import MobileSplash from './mobile_splash';
import OtherGameContainer from './otherGame/other_game_container';
import OtherGameContainerMobile from './otherGame/other_game_container_mobile';
import Home from './home';
import { Route, Redirect, Link } from 'react-router-dom';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.mobile = typeof window.orientation !== 'undefined';
        //this.mobile = true;
    }

    render() {
        if (this.mobile) {
            if (this.props.userId) {
                return (
                    <div>
                        <Route path="/home" component={Home} />
                        <Route
                            path="/sandbox"
                            render={() => <ChessTableContainer mode={'sandbox'} />}
                        />
                        <Route
                            path="/show"
                            render={() => <ChessTableContainer />}
                        />
                        <Route
                            path="/play"
                            render={() => <ChessTableContainer player={'User'}
                                mode={'playComputer'} />}
                        />
                        <Redirect to='/home' />
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <MobileSplash />
                        <Route path="/login" component={LoginFormContainer} />
                        <Route path="/signup" component={SignupFormContainer} />
                        <Route path="/notChess" component={OtherGameContainerMobile} />
                        <Route
                            path="/play"
                            render={() => <ChessTableContainer player={'Guest'}
                                mode={'playComputer'} />}
                        />
                    </div>
                );
            }
        }
        else {
            if (this.props.userId) {
                return (
                    <div>
                        <Route path="/home" component={Home} />
                        <Route
                            path="/sandbox"
                            render={() => <ChessTableContainer mode={'sandbox'} />}
                        />
                        <Route
                            path="/show"
                            render={() => <ChessTableContainer />}
                        />
                        <Route
                            path="/play"
                            render={() => <ChessTableContainer player={'User'}
                                mode={'playComputer'} />}
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
                            render={() => <ChessTableContainer player={'Guest'}
                            mode={'playComputer'} />}
                        />
                    </div>
                );
            }
        }
    }
    
};

export default App;