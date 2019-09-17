import React from 'react';
import { Link } from 'react-router-dom';


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewSize: window.innerWidth
        };
        this.handleResize = this.handleResize.bind(this);
        this.smallMenu = false;
        this.nothing = this.nothing.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.collapseButton = this.collapseButton.bind(this);
    }

    collapseButton() {
        if (this.smallMenu) {
            return (
                <div>
                    <i className="fas fa-angle-double-right"></i>
                </div>
            );
        }
        else {
            return (
                <div>
                    <i className="fas fa-angle-double-left"></i> Smaller
                </div>
            );
        }
    }

    toggleCollapse() {
        this.smallMenu = this.smallMenu ? false : true;
        this.setState({});
    }

    handleResize(e) {
        this.setState({ viewSize: window.innerWidth });
        if (window.innerWidth < 600) {
            this.smallMenu = true;
            this.setState({});
        }
        if (window.innerWidth > 1200) {
            this.smallMenu = false;
            this.setState({});
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    nothing() {
        return (
            <br/>
        );
    }

    render() {
        return (
            <div>
                <div className="greeting">
                    
                    <div>
                        <center>
                        {this.smallMenu ? this.nothing() : this.props.user.username + ','}
                        <div className="ahoy"> {this.smallMenu ? '' : 'Ahoy!'}
                            <div className="small_pirate"></div>
                        </div> 
                        </center>
                    </div>
                    
                </div>
                <div className={this.smallMenu ? "menu small_menu" : "menu"}>
                    
                    <Link
                        to={'/home'}
                        className="splash_option">
                        <i className="fas fa-home"></i> {this.smallMenu ? '' : 'Home'}
                    </Link>
                    <Link
                        to={'/profile'}
                        className="splash_option">
                        <i className="fas fa-user"></i> {this.smallMenu ? '' : 'Profile'}
                    </Link>
                    <Link
                        to={'/play'}
                        className="splash_option">
                        <i className="fas fa-chess-knight"></i> {this.smallMenu ? '' : 'New Game'}
                    </Link>
                    <Link
                        to={'/sandbox'}
                        className="splash_option">
                        <i className="fas fa-chess-board"></i> {this.smallMenu ? '' : 'Sandbox'}
                    </Link>
                    <Link 
                        to={'/'}
                        className="splash_option" 
                        onClick={this.props.logout}>
                        <i className="fas fa-sign-out-alt"></i> {this.smallMenu ? '' : 'Signout'}
                    </Link>
                    <div className="splash_option" onClick={this.toggleCollapse}>
                        {this.collapseButton()}
                    </div>
                    
                </div>
                
            </div>
        );
    }
}

export default Menu;