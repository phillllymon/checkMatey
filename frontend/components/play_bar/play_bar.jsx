import React from 'react';
import ChessTableContainer from '../chess_table/chess_table_container';
import { Link } from 'react-router-dom';


class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.times = [2, 5, 10, 15];
        this.gameTypes = ['Standard', 'Chess960', 'Pawn Clash'];
        this.state = {
            visible: true,
            challenged: false,
            gameType: 'Standard',
            gameTime: 10,
            playerList: [],
            currentMessage: '',
            playing: false,
            hint: false,
            challengePrompted: false,
            challengeMade: false
            
        }
        this.playerRatings = {
            T1000robot: 850
        }
        this.setTime = this.setTime.bind(this);
        this.setType = this.setType.bind(this);
        this.enterLobby = this.enterLobby.bind(this);
        this.leaveLobby = this.leaveLobby.bind(this);
        this.receiveBroadcast = this.receiveBroadcast.bind(this);
        this.announcePresence = this.announcePresence.bind(this);
        this.requestRollCall = this.requestRollCall.bind(this);
        this.challengePlayer = this.challengePlayer.bind(this);
        this.showChallengedBox = this.showChallengedBox.bind(this);
        this.acceptChallenge = this.acceptChallenge.bind(this);
        this.declineChallenge = this.declineChallenge.bind(this);
        this.startGame = this.startGame.bind(this);
        this.showVsBoard = this.showVsBoard.bind(this);
        this.lobbyButton = this.lobbyButton.bind(this);
        this.leaveGame = this.leaveGame.bind(this);
        this.showHint = this.showHint.bind(this);
        this.setHint = this.setHint.bind(this);
        this.promptChallenge = this.promptChallenge.bind(this);
        this.showChallengeOptions = this.showChallengeOptions.bind(this);

        this.mobile = typeof window.orientation !== 'undefined';
    }

    promptChallenge(player) {
        this.setState({challengePrompted: player});
    }

    showChallengeOptions() {
        return (
            <div className="challenge_box">
                <div className="challenge_box_header">
                    Challenge Options:
                </div>
                <center>
                    <br/>
                    {
                        this.gameTypes.map((gameType, idx) => {
                            return (
                                <button className={this.state.gameType === gameType ? "current_type_button" : "type_button"}
                                    onMouseEnter={() => { this.setHint('', idx + 1) }}
                                    onMouseLeave={() => { this.setHint(false) }}
                                    onClick={() => this.setType(gameType)}
                                    key={gameType}>{gameType}</button>

                            );
                        })
                    }

                    <div className="smaller_heading">
                        <div style={{ 'margin': '5px' }}>
                            <i className="far fa-clock"></i>
                            {
                                this.times.map((time) => {
                                    return (
                                        <button className={this.state.gameTime === time ? "current_time_button" : "time_button"}
                                            onMouseEnter={() => { this.setHint('Choose the amount of time on the clock for your challenge') }}
                                            onMouseLeave={() => { this.setHint(false) }}
                                            onClick={() => this.setTime(time)}
                                            key={time}> {time}:00</button>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <br/>
                    <button 
                        className="board_control_button"
                        onClick={() => {
                                let otherGuy = this.state.challengePrompted;
                                this.challengePlayer(this.state.challengePrompted);
                                this.setState({
                                    challengePrompted: false,
                                    challengeMade: otherGuy
                                });
                            }
                        }
                    >
                        Send Challenge!
                    </button>
                    <button
                        className="board_control_button"
                        onClick={() => this.setState({challengePrompted: false})}
                    >
                        Cancel
                    </button>
                </center>
            </div>
        );
    }

    showHint() {
        if (this.props.hints && !this.state.playing){
            let picId = '';
            if (this.state.hint === 'In Pawn Clash, the pawns begin on the 4th and 5th ranks.') {
                picId = "pawn_clash_diagram";
            }
            else if (this.state.hint === 'In Chess960, your capital pieces start in a random order.') {
                picId = "chess_960_diagram";
            }
            return (
                <div className="hint">
                    <div id={picId}>
                    </div>
                    {this.state.hint}
                </div>
            );
        }
        return '';
    }

    setHint(newHint, hintKey = 0) {
        if (hintKey === 0) {
            this.setState({ hint: newHint });
        }
        else {
            switch (hintKey) {
                case 1:
                    this.setState({ hint: 'Select Standard Chess' });
                    break;
                case 2:
                    this.setState({ hint: 'In Chess960, your capital pieces start in a random order.' });
                    break;
                case 3:
                    this.setState({ hint: 'In Pawn Clash, the pawns begin on the 4th and 5th ranks.' });
                    break;
                case 4:
                    this.setState({ hint: 'Check!' });
                    break;
                default:
                    break;
            }
        }
    }

    leaveGame() {
        this.setState({playing: false});
    }

    showVsBoard() {
        if (this.mobile) {
            return (
                <div>
                    <ChessTableContainer
                        mode={'vsMobile'}
                        player={this.props.user.username}
                        color={this.state.playing.color}
                        opponent={this.state.playing.opponent}
                        gameId={this.state.playing.gameId}
                        gameType={this.state.playing.gameType}
                        gameTime={this.state.playing.gameTime}
                        leaveGame={this.leaveGame}
                    />
                </div>
            );
        }
        return (
            <div>
                <ChessTableContainer 
                    mode={'vs'}
                    player={this.props.user.username}
                    color={this.state.playing.color}
                    opponent={this.state.playing.opponent}
                    gameId={this.state.playing.gameId}
                    gameType={this.state.playing.gameType}
                    gameTime={this.state.playing.gameTime}
                    leaveGame={this.leaveGame}
                />
            </div>
        );
    }

    startGame(color, opponent, id, gameType, gameTime) {
        this.setState({
            playing: {
            color: color,
            opponent: opponent,
            gameId: id,
            gameType: gameType,
            gameTime: gameTime
            }
        });
    }

    setType(newType) {
        this.setState({gameType: newType});
    }

    setTime(newTime) {
        this.setState({gameTime: newTime});
    }

    acceptChallenge() {
        this.waitSub.perform('relayAcceptance', { 
            'playerWhoChallenged': this.state.challenged.challenger, 
            'playerWhoAccepts': this.props.user.username,
            'gameType': this.state.challenged.gameType,
            'gameTime': this.state.challenged.gameTime
        });
        this.setState({challenged: false});
    }

    declineChallenge() {
        this.waitSub.perform('relayDecline', {
            'playerWhoChallenged': this.state.challenged.challenger
        });
        this.setState({challenged: false});
    }

    showChallengedBox() {
        return (
            <div className="vs_modal_back">
                <div className={this.mobile ? "challenge_box_mobile" : "challenge_box"}>
                    <center>
                        <div className={this.mobile ? "challenge_box_header_mobile" : "challenge_box_header"}>
                        New Challenge!
                    </div>
                    <br/>
                    {this.state.challenged.challenger} challenges you to 
                    a {this.state.challenged.gameType} game 
                    with {this.state.challenged.gameTime} minutes 
                    on the clock.
                    <br/>
                    <br/>
                    <button className={this.mobile ? "board_control_button_mobile" : "board_control_button"}
                        onClick={this.acceptChallenge}
                    >Accept</button>
                        <button className={this.mobile ? "board_control_button_mobile" : "board_control_button"}
                        onClick={this.declineChallenge}
                    >Decline</button>
                    <br/>
                    <br/>
                    </center>
                </div>
            </div>
        );
    }

    challengePlayer(player) {
        this.waitSub.perform('relayChallenge', {
            'challenger': this.props.user.username,
            'challengee': player,
            'gameType': this.state.gameType,
            'gameTime': this.state.gameTime
        });
    }

    enterLobby() {
        this.requestRollCall();
        this.setState({visible: true});
        this.announcePresence();
    }

    leaveLobby() {
        this.waitSub.perform('relayExit', { 'user': this.props.user.username });
        this.setState({ visible: false });
    }

    announcePresence() {
        if (this.state.visible){
            this.waitSub.perform('relayPresence', { 'user': this.props.user.username, 'rating': this.props.user.rating});
        }
    }

    requestRollCall() {
        this.waitSub.perform('requestRollCall', {});
    }

    receiveBroadcast(data) {
        if (data.requestRollCall) {
            this.announcePresence();
        }
        else if (data.user){
            if (!this.state.playerList.includes(data.user)){
                this.state.playerList.push(data.user);
                this.playerRatings[data.user] = data.rating
            }
        }
        else if (data.goner) {
            if (this.state.playerList.includes(data.goner)) {
                this.setState({
                    playerList: this.state.playerList.filter((player) => {
                        return (player !== data.goner);
                    })
                });
            }
        }
        else if (data.challenger) {
            if (this.props.user.username === data.challengee) {
                this.setState({ 
                    challenged: {
                        challenger: data.challenger,
                        gameType: data.gameType,
                        gameTime: data.gameTime
                    }
                });
            }
        }
        else if (data.playerWhite) {
            if (data.playerWhite === this.props.user.username) {
                this.startGame('white', data.playerBlack, data.gameId, data.gameType, data.gameTime);
                this.leaveLobby();
                this.setState({challengeMade: false });
            }
            if (data.playerBlack === this.props.user.username) {
                this.startGame('black', data.playerWhite, data.gameId, data.gameType, data.gameTime);
                this.leaveLobby();
                this.setState({ challengeMade: false });
            }
        }
        else if (data.decline) {
            if (this.props.user.username === data.playerBeingRejected) {
                this.setState({ challengeMade: false });
            }
        }
        else {
            console.log('something else');
            console.log(data);
        }
    }

    componentDidMount() {
        let that = this;
        this.waitSub = App.cable.subscriptions.create(
            { channel: 'WaitingChannel' },
            {
                received: (data) => {
                    that.receiveBroadcast(data);
                    that.setState({});
                }
            }
        );
        setTimeout(this.requestRollCall, 1000);
        if (this.mobile) {
            this.setState({
                playerList: []
            });
        }
    }

    componentWillUnmount() {
        this.waitSub.perform('relayExit', { 'user': this.props.user.username });
        App.cable.subscriptions.remove(this.waitSub);
    }

    lobbyButton() {
        if (!this.state.visible){
            return (
                <div
                    id="lobby_button"
                    className={this.mobile ? "board_control_button_mobile" : ''}
                    style={this.mobile ? '' : {'cursor': 'pointer', 'float': 'right', 'fontSize': '20px', 'padding': '5px'}}
                    onClick={this.enterLobby}
                    onMouseEnter={() => { this.setHint('Become visible for other players to challenge you') }}
                    onMouseLeave={() => { this.setHint(false) }}
                ><i className="fas fa-eye"></i>{this.mobile ? 'Enter Lobby' : ''}</div>
            );
        }
        else {
            return (
                <div
                    id="lobby_button"
                    className={this.mobile ? "board_control_button_mobile" : ''}
                    style={this.mobile ? '' : { 'cursor': 'pointer', 'float': 'right', 'fontSize': '20px', 'padding': '5px' }}
                    onClick={this.leaveLobby}
                    onMouseLeave={() => { this.setHint(false) }}
                ><i className="fas fa-eye-slash"></i> {this.mobile ? 'Leave Lobby' : ''}</div>
            );
        }
    }

    render() {
        
        if (this.mobile) {
            return (
                <div className="play_bar_mobile">
                    {this.state.challenged ? this.showChallengedBox() : ''}
                    {this.state.playing ? this.showVsBoard() : ''}
                    <div className="controls_heading_mobile">
                        <div style={{ 'margin': '10px' }}>
                            <i className="fas fa-chess"></i> Game Room <i className="fas fa-chess-knight"></i>
                        </div>
                    </div>
                    <center>
                        {
                            this.gameTypes.map((gameType) => {
                                return (
                                    <button className={this.state.gameType === gameType ? "current_type_button_mobile" : "type_button_mobile"}
                                        onClick={() => this.setType(gameType)}
                                        key={gameType}>{gameType}</button>

                                );
                            })
                        }

                        <div className="smaller_heading_mobile">
                            <div style={{ 'margin': '5px' }}>
                                <i style={{'transform': 'translate(0, 1vw)'}} className="far fa-clock"></i>
                                {
                                    this.times.map((time) => {
                                        return (
                                            <button className={this.state.gameTime === time ? "current_time_button_mobile" : "time_button_mobile"}
                                                onClick={() => this.setTime(time)}
                                                key={time}> {time}:00</button>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="small_heading_mobile">
                            <i className="fas fa-users"></i> Players
                </div>
                        {this.lobbyButton()}
                        {

                            this.state.playerList.map((player, idx) => {
                                if (player === this.props.user.username) {
                                    return (
                                        <div className="player_bar_mobile" key={idx} >
                                            <div className="player_icon_mobile">
                                                <i className="fas fa-user"></i>
                                            </div>
                                            {player + ' (' + this.playerRatings[player] + ')'}
                                            <br />
                                            <button
                                                className="time_button_mobile challenge_mobile"
                                                style={{ 'color': 'lightgray' }}
                                            > (This is you)</button>
                                        </div>
                                    );
                                }
                                else {
                                    return (
                                        <div className="player_bar_mobile" key={idx} >
                                            <div className="player_icon_mobile">
                                                <i className="fas fa-user"></i>
                                            </div>
                                            {player + ' (' + this.playerRatings[player] + ')'}
                                            <br />
                                            <button
                                                className="time_button_mobile challenge_mobile"
                                                onClick={() => this.challengePlayer(player)}
                                            > Challenge</button>
                                        </div>
                                    );
                                }
                            })
                        }
                    </center>
                </div>
            );
        }
        let num = this.state.playerList.length;
        return (
            <div className="battle_options">
                {this.state.challengePrompted ? this.showChallengeOptions() : ''}
                {this.state.hint ? this.showHint() : ''}
                {this.state.challenged ? this.showChallengedBox() : ''}
                {this.state.playing ? this.showVsBoard() : ''}
                <div className="play_bar"
                    onMouseEnter={() => { this.setHint('Play live matches with other users') }}
                    onMouseLeave={() => { this.setHint(false) }}
                >
                    <div className="controls_heading" style={{ 'height': '42px' }}>
                        <div style={{ 'margin': '10px' }}>
                            <i className="fas fa-users"></i> Multiplayer
                        </div>
                    </div>
                    
                    <center>

                        {this.lobbyButton()}
                        <div className="players_waiting">
                            {num === 0 ? '(no players online)' : num + ' player' + (num === 1 ? '' : 's') + ' online:'}
                            {

                                this.state.playerList.map((player, idx) => {
                                    if (player === this.props.user.username) {
                                        return (
                                            <div className="player_bar" key={idx}
                                                onMouseEnter={() => { this.setHint('You cannot challenge yourself') }}
                                                onMouseLeave={() => { this.setHint(false) }}
                                            >
                                                <div className="player_pic">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                                {player + ' (' + this.playerRatings[player] + ')'}
                                                <br />
                                                <div style={{ 'height': '25px', 'padding': '5px' }}

                                                > (This is you)</div>
                                            </div>
                                        );
                                    }
                                    else if (player === this.state.challengePrompted || player === this.state.challengeMade) {
                                        return (
                                            <div className="player_bar" key={idx}
                                                onMouseEnter={() => { this.setHint('You have a challenge pending with this player') }}
                                                onMouseLeave={() => { this.setHint(false) }}
                                            >
                                                <div className="player_pic">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                                {player + ' (' + this.playerRatings[player] + ')'}
                                                <br />
                                                <div style={{ 'height': '25px', 'padding': '5px', 'color': 'gray' }}

                                                > <br />Pending...</div>
                                            </div>
                                        );
                                    }
                                    else {
                                        return (
                                            <div className="player_bar" key={idx}
                                                onMouseEnter={() => { this.setHint('Challenge this player to a game') }}
                                                onMouseLeave={() => { this.setHint(false) }}
                                            >
                                                <div className="player_pic">
                                                    <i className="fas fa-user"></i>
                                                </div>
                                                {player + ' (' + this.playerRatings[player] + ')'}
                                                <br />
                                                <button
                                                    className="time_button challenge"
                                                    onClick={() => this.promptChallenge(player)}
                                                > Challenge Player</button>
                                            </div>
                                        );
                                    }
                                })
                            }
                            <div
                                className="pirate_right"
                                style={{
                                    'position': 'absolute',
                                    'top': '100%',
                                    'left': '150px',
                                    'transform': 'translate(0, -200px)'
                                }}
                            >
                            </div>
                            <div 
                                className="pirate_left"
                                style={{
                                    'position': 'absolute',
                                    'top': '100%',
                                    'transform': 'translate(0, -160px)'
                                }}    
                            >
                            </div>
                        </div>
                        <div style={{
                            'position': 'absolute',
                            'top': '100%',
                            'transform': 'translate(50%, -85px)'
                        }}>
                            No one to play with?
                        </div>
                        <button
                            id="invite_friend"
                            onMouseEnter={() => { this.setHint('Challenge a friend to play through email') }}
                            onMouseLeave={() => { this.setHint(false) }}
                            className="tour_button"
                            style={{
                                'position': 'absolute',
                                'top': '100%',
                                'transform': 'translate(-50%, -120%)',
                                'padding': '18px',
                                'height': '60px',
                                'width': '180px'
                            }}
                        >
                            Invite a Friend
                        </button>
                    </center>
                </div>
                <div className="flag_one">
                </div>
                <div className="play_bar">
                    <Link to={'/play'} className="controls_heading" style={{ 'height': '42px', 'textDecoration': 'none', 'cursor': 'auto' }}>
                        
                            <div style={{ 'margin': '10px' }}>
                                <i className="fas fa-robot"></i> Play Computer
                            </div>
                        
                    </Link>
                    
                    <center>
                    <div className="computer_block">
                    </div>
                    
                        <Link to={'/play'}>
                            <button
                                id="play_computer"
                                onMouseEnter={() => { this.setHint('Play an unrated game against the computer') }}
                                onMouseLeave={() => { this.setHint(false) }}
                                className="tour_button"
                                style={{
                                    'position': 'absolute',
                                    'top': '100%',
                                    'transform': 'translate(-50%, -120%)',
                                    'padding': '18px',
                                    'height': '60px',
                                    'width': '160px'
                                }}
                            >
                                <div 
                                    className="sword" 
                                    style={{
                                        'float': 'right', 
                                        'width': '40px',
                                        'height': '40px',
                                        'transform': 'translate(0, -10px)'
                                    }}>
                                </div> 
                                <i className="fas fa-chess"></i> PLAY
                        </button>
                        </Link>
                    </center>
                </div>
            </div>
        );
    }
}

export default PlayBar;