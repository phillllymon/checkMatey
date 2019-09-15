import React from 'react';
import { Link } from 'react-router-dom';


class Menu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="greeting">
                    
                    
                    <div>Ahoy, <br/> {this.props.user.username}!</div>
                    <div className="small_pirate"></div>
                </div>
                <div className="menu">
                    
                    <Link
                        to={'/home'}
                        className="splash_option">
                        <i className="fas fa-home"></i> Home
                    </Link>
                    <Link
                        to={'/profile'}
                        className="splash_option">
                        <i className="fas fa-user"></i> Profile
                    </Link>
                    <Link
                        to={'/play'}
                        className="splash_option">
                        <i className="fas fa-chess-knight"></i> New Game
                    </Link>
                    <Link 
                        to={'/'}
                        className="splash_option" 
                        onClick={this.props.logout}>
                        <i className="fas fa-sign-out-alt"></i> Sign Out
                    </Link>
                </div>
            </div>
        );
    }
}

export default Menu;