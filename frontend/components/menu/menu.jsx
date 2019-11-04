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
                        style={{
                            'top': 0,
                            'left': '100%',
                            'width': '400px',
                            'transform': 'translate(-110%, 20px)'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            
                            <button
                                className="tour_button"
                                style={{ 'float': 'right' }}
                                onClick={() => this.props.setTour(2)}
                            >
                                Begin Tour
                            </button>
                            
                            
                            Welcome to CheckMatey!
                            <br />
                            <br/>
                            Want to see a quick tour?
    
    
                            <br />
                            

                            
                        </center>
                        
                    </div>
                );
            case 2:
                let inputBox = document.getElementById("new_post");
                let newTop = 0;
                let newLeft = 0;
                if (inputBox) {
                    inputBox.focus();
                    newTop = inputBox.offsetTop;
                    newLeft = inputBox.offsetLeft;
                }
                else {
                    this.props.setTour(false);
                }
                return (
                    <div
                        className="tour"
                        style={{
                            'top': newTop,
                            'left': newLeft,
                            'width': '500px',
                            'transform': 'translate(150px, -105%)'
                        }}
                    >
                        <div
                            className="dismiss_circle"
                            onClick={() => this.props.setTour(false)}
                        >
                            X
                        </div>
                        <center>
                            <br />
                            This is the community forum for discussing general chess and pirate-related topics.
                            <br />
                            <br />
                        
                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                1/6
                            </div>
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <br/>
                        <div style={{ 'fontSize': '150%' }}>
                            <i className="fas fa-arrow-down"></i> Share your thoughts
                            </div>
                    </div>
                );
            case 3:
                let multi = document.getElementById("multiplayer");
                let leftPos = multi.offsetLeft + multi.offsetWidth + 10;
                let topPos = multi.offsetTop;
                return (
                    <div
                        className="tour"
                        style={{
                            'top': topPos,
                            'left': leftPos,
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
                                <i className="fas fa-arrow-left" style={{'float': 'left'}}></i> Play Other Users
                            </div>
                            <br />
                            <br />
                            Other players online appear here. You can challenge another player to a live match.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                2/6
                            </div>
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 4:
                let multiNew = document.getElementById("multiplayer");
                let leftPosNew = multiNew.offsetLeft + multiNew.offsetWidth - 10;
                let topPosNew = multiNew.offsetTop + multiNew.offsetHeight - 50;
                document.getElementById("invite_friend").focus();
                return (
                    <div
                        className="tour"
                        style={{
                            'top': topPosNew,
                            'left': leftPosNew,
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
                                <i className="fas fa-arrow-left" style={{ 'float': 'left' }}></i> Challenge By Email
                            </div>
                            <br />
                            <br />
                            If your opponenet isn't online now, you can send an email invitation. Once your friend clicks a link in the email, your game will begin.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                3/6
                            </div>
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 5:
                let compGame = document.getElementById("compGame");
                let leftPosComp = compGame.offsetLeft;
                let topPosComp = compGame.offsetTop + compGame.offsetHeight - 50;
                document.getElementById("play_computer").focus();
                return (
                    <div
                        className="tour"
                        style={{
                            'top': topPosComp,
                            'left': leftPosComp,
                            'width': '400px',
                            'transform': 'translate(-96%, 0)'
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
                            Of course, if you have no human opponent you can play against the computer at any time.
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                4/6
                            </div>
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 6:
                return (
                    <div
                        className="tour"
                        style={{
                            'top': 400,
                            'left': 160,
                            'width': '400px',
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
                            The chess sandbox is a board for experimenting. You can move the pieces around with no rules. You can also record a sequence of moves to share with other players. 
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                5/6
                            </div>
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour + 1)}
                            >
                                Continue <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                );
            case 7:
                return (
                    <div
                        className="tour"
                        style={{
                            'top': 455,
                            'left': 175,
                            'width': '400px',
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
                            For a more detail on all the features of CheckMatey, watch the video tour. Thanks for taking a look around!
                            <br />
                            <br />

                        </center>
                        <div className="tour_buttons">
                            <button
                                className="tour_button"
                                onClick={() => this.props.setTour(this.props.tour - 1)}
                            >
                                <i className="fas fa-chevron-left"></i> Previous
                            </button>
                            <div>
                                6/6
                            </div>
                            <button
                                className="tour_button"
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

    render() {
        return (
            <div>
                {this.props.tour && this.mounted ? this.tourWindow() : ''}
                {this.state.hint ? this.showHint() : ''}
                <div className={this.smallMenu ? "small_pirate" : "menu_pirate"}></div>                
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