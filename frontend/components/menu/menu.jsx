import React from 'react';
import { Link } from 'react-router-dom';


class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewSize: window.innerWidth,
            hint: false
        };
        this.handleResize = this.handleResize.bind(this);
        this.smallMenu = false;
        this.nothing = this.nothing.bind(this);
        this.toggleCollapse = this.toggleCollapse.bind(this);
        this.collapseButton = this.collapseButton.bind(this);
        this.mobile = typeof window.orientation !== 'undefined';
        this.showHint = this.showHint.bind(this);
        this.setHint = this.setHint.bind(this);
    }

    showHint() {
        if (this.props.hints) {
            return (
                <div className="hint">
                    <i className="fas fa-question-circle"></i> {this.state.hint}
                </div>
            );
        }
        return '';
    }

    setHint(newHint, time) {
        this.setState({ hint: newHint });
        if (time) {
            setTimeout(() => {
                if (this.mounted) this.setState({ hint: false });
            }, time);
        }
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
        this.mounted = true;
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
        this.mounted = false;
    }

    nothing() {
        return (
            <br/>
        );
    }

    render() {
        return (
            <div>
                {this.state.hint ? this.showHint() : ''}
                <div className="greeting">
                    
                    <div>
                        <center>
                        {this.smallMenu ? this.nothing() : this.props.user.username + ','}
                        <div className="ahoy" style={this.smallMenu ? {'marginLeft': '8px'} : {}}> {this.smallMenu ? '' : 'Ahoy!'}
                            <div className="small_pirate"></div>
                        </div> 
                        </center>
                    </div>
                    
                </div>
                <div className={this.smallMenu ? "pusher small_menu" : "pusher"}></div>
                <div className={this.smallMenu ? "menu small_menu" : "menu"}>
                    <div className="splash_option" 
                        onClick={this.props.toggleHints}
                        onMouseEnter={() => { this.setHint('Hints pop up here', 2000) }}
                        onMouseLeave={() => { this.setHint(false) }}
                    >
                        <i className="fas fa-question-circle"></i> {this.smallMenu ? '' : (this.props.hints ? 'Turn Hints Off' : 'Turn Hints On')}
                    </div>
                    <Link
                        onMouseEnter={() => { this.setHint('Discuss chess with other players') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        to={'/home'}
                        className="splash_option">
                        <i className="fas fa-comments"></i> {this.smallMenu ? '' : 'Community'}
                    </Link>
                    <Link
                        to={'/profile'}
                        onMouseEnter={() => { this.setHint('See your rating, posts, and past games') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-user"></i> {this.smallMenu ? '' : 'Profile'}
                    </Link>
                    <Link
                        to={'/play'}
                        onMouseEnter={() => { this.setHint('Play an urated game against the computer') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-robot"></i> {this.smallMenu ? '' : 'Play Computer'}
                    </Link>
                    <Link
                        to={'/sandbox'}
                        onMouseEnter={() => { this.setHint('Record moves to share with the community') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-chess-board"></i> {this.smallMenu ? '' : 'Sandbox'}
                    </Link>
                    <Link
                        to={'/tutorial'}
                        onMouseEnter={() => { this.setHint('Watch a video showing the main features of CheckMatey') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-video"></i> {this.smallMenu ? '' : 'Video Tour'}
                    </Link>
                    <Link 
                        to={'/'}
                        className="splash_option" 
                        onClick={this.props.logout}>
                        <i className="fas fa-sign-in-alt" style={{
                            'transform': 'rotate(180deg)'
                        }}></i> {this.smallMenu ? '' : 'Signout'}
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