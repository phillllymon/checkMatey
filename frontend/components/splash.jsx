import React from 'react';
import { Link } from 'react-router-dom';

class Splash extends React.Component{
    constructor(props) {
        super(props);
        this.demoLogin = this.demoLogin.bind(this);
    }

    demoLogin(e) {
        e.preventDefault();
        this.props.login({ username: 'DemoUser', password: '123456' });
    }

    render() {
        return (
            <div id="splash">
                <div id="splash_top">
                    <div id="top_content">
                        <div id="splash_set"></div>
                        <div id="splash_top_words">
                            <div id="splash_logo"></div>

                            <h1>Play Chess on the High Seas</h1>
                            <ul>
                                <li><h3>Play with over 2.5 members</h3></li>
                                <li><h3>Learn from other players</h3></li>
                                <li><h3>Improve over time</h3></li>
                            </ul>
                            <Link to="/play">
                                <button className="play_now">
                                    <i className="fas fa-chess-knight"></i> Play Now
                        </button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="splash_bar">
                    <Link className="splash_option" to="/signup"><i className="fas fa-user-plus"></i> Sign Up</Link>
                    <Link className="splash_option" to="/login"><i className="fas fa-sign-in-alt"></i> Log In</Link>
                    <Link className="splash_option" to="/play"><i className="fas fa-robot"></i> Play Computer</Link>
                    <Link className="splash_option" to="/notChess"><i className="fas fa-cubes"></i> I Prefer Tetris</Link>
                </div>
            </div>
        );
    }
}

export default Splash;