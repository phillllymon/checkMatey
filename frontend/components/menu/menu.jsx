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
        this.tourWindow = this.tourWindow.bind(this);
    }

    tourWindow() {
        switch (this.props.tour) {
            case 1:
                return (
                    <div
                        className="tour"
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            
                            <div style={{ 'fontSize': '150%' }}>
                                Welcome to CheckMatey!
                            </div>
                            
                            <br />
                            
                            <br />
                            <div className="med_pirate" style={{'marginRight': '5%', 'marginLeft': '5%'}}></div>
                            You are logged in as DemoUser.
                            <br />
                            <br />
                            Click the button below to see a quick tour of the main features.
                            
                            <br />
                            <br />
                            <br />
                            

                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(2)}
                            >
                                Begin Tour
                    </button>
                        </center>
                        
                    </div>
                );
            case 2:
                let inputBox = document.getElementById("new_post");
                if (inputBox) inputBox.focus();
                return (
                    <div
                        className="tour"
                        style={{
                            'top': '200px',
                            'width': '400px'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <div style={{ 'fontSize': '150%' }}>
                                <i className="fas fa-arrow-up"></i> Share your thoughts
                            </div>
                            <br />
                            <br />
                            This is the community forum for discussing general chess and pirate-related topics.
                            <br />
                            <br />
                        
                        </center>
                        <div className="tour_buttons">
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                1/5
                            </div>
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 3:
                let lobbyButton = document.getElementById("lobby_button");
                lobbyButton.focus();
                let leftPos = lobbyButton.offsetLeft - 30;
                let topPos = lobbyButton.offsetTop;
                return (
                    <div
                        className="tour"
                        style={{
                            'top': topPos,
                            'left': leftPos,
                            'transform': 'translate(-100%, 0)',
                            'width': '400px'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <div style={{ 'fontSize': '150%' }}>
                                <i className="fas fa-arrow-right" style={{'float': 'right'}}></i> Game Room
                            </div>
                            <br />
                            <br />
                            Enter the lobby to be visible to other players. You can challenge any player in the lobby to a match.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                2/5
                            </div>
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 4:
                let compButton = document.getElementById("play_computer");
                compButton.focus();
                let compLeftPos = compButton.offsetLeft - 30;
                let compTopPos = compButton.offsetTop;
                return (
                    <div
                        className="tour"
                        style={{
                            'top': compTopPos,
                            'left': compLeftPos,
                            'transform': 'translate(-100%, 0)',
                            'width': '400px'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <div style={{ 'fontSize': '150%' }}>
                                <i className="fas fa-arrow-right" style={{ 'float': 'right' }}></i> Play Computer
                            </div>
                            <br />
                            <br />
                            Of course, if no players are available for a match, you can always play against the computer.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                3/5
                            </div>
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 5:
                let sandLink = document.getElementById("sandbox_link");
                sandLink.focus();
                let sandLeftPos = sandLink.offsetLeft + 170;
                let sandTopPos = sandLink.offsetTop + 100;
                return (
                    <div
                        className="tour"
                        style={{
                            'top': sandTopPos,
                            'left': sandLeftPos,
                            'transform': 'none',
                            'width': '400px'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <div style={{ 'fontSize': '150%' }}>
                                <i className="fas fa-arrow-left" style={{ 'float': 'left' }}></i> Chess Sandbox
                            </div>
                            <br />
                            <br />
                            In the chess sandbox, you can move pieces around with no rules. You can also record a sequence of moves to share with other players.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                4/5
                            </div>
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 6:
                let videoLink = document.getElementById("video_link");
                videoLink.focus();
                let videoLeftPos = videoLink.offsetLeft + 170;
                let videoTopPos = videoLink.offsetTop + 100;
                return (
                    <div
                        className="tour"
                        style={{
                            'top': videoTopPos,
                            'left': videoLeftPos,
                            'transform': 'none',
                            'width': '400px'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <div style={{ 'fontSize': '150%' }}>
                                <i className="fas fa-arrow-left" style={{ 'float': 'left' }}></i> Video Tour
                            </div>
                            <br />
                            <br />
                            For a more detailed look at all the features of CheckMatey, watch the video tour. Thanks for taking a look around!
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                5/5
                            </div>
                            <button
                                className="board_control_button"
                                style={{
                                    'backgroundColor': 'orange',
                                    'color': 'white'
                                }}
                                onClick={() => this.props.setTour(false)}
                            >
                                Close Tour
                            </button>
                        </div>
                    </div>
                );
        }
        
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
        this.setState({});
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
                {this.props.tour && this.mounted ? this.tourWindow() : ''}
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
                        onMouseEnter={() => { this.setHint('Hints pop up here') }}
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
                        onMouseEnter={() => { this.setHint('Play an unrated game against the computer') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-robot"></i> {this.smallMenu ? '' : 'Play Computer'}
                    </Link>
                    <Link
                        id="sandbox_link"
                        to={'/sandbox'}
                        onMouseEnter={() => { this.setHint('Record moves to share with the community') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-chess-board"></i> {this.smallMenu ? '' : 'Sandbox'}
                    </Link>
                    <Link
                        id="video_link"
                        to={'/tutorial'}
                        onMouseEnter={() => { this.setHint('Watch a video showing the main features of CheckMatey') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-video"></i> {this.smallMenu ? '' : 'Video Tour'}
                    </Link>
                    <Link
                        to={'/notChess'}
                        onMouseEnter={() => { this.setHint('Play Tetris instead') }}
                        onMouseLeave={() => { this.setHint(false) }}
                        className="splash_option">
                        <i className="fas fa-cubes"></i> {this.smallMenu ? '' : 'I prefer Tetris'}
                    </Link>
                    <Link 
                        to={'/'}
                        className="splash_option"
                        onMouseEnter={() => { this.setHint('Leave CheckMatey') }}
                        onMouseLeave={() => { this.setHint(false) }} 
                        onClick={() => {
                            this.props.setTour(false);
                            this.props.logout();
                        }}>
                        <i className="fas fa-sign-in-alt" style={{
                            'transform': 'rotate(180deg)'
                        }}></i> {this.smallMenu ? '' : 'Log Out'}
                    </Link>
                    <div 
                        className="splash_option" 
                        onClick={this.toggleCollapse}
                        onMouseEnter={() => { this.setHint(this.smallMenu ? 'Show Full Menu' : 'Collapse Menu') }}
                        onMouseLeave={() => { this.setHint(false) }} 
                    >
                        {this.collapseButton()}
                    </div>
                    
                </div>
                
            </div>
        );
    }
}

export default Menu;