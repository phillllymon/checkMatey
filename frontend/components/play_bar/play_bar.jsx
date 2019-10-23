import React from 'react';
import ChessTableContainer from '../chess_table/chess_table_container';
import { Link } from 'react-router-dom';


class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.times = [2, 5, 10, 15];
        this.gameTypes = ['Standard', 'Chess960', 'Pawn Clash'];
        this.state = {
            visible: false,
            challenged: false,
            gameType: 'Standard',
            gameTime: 10,
            playerList: [],
            currentMessage: '',
            playing: false,
            hint: false
            
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

        this.mobile = typeof window.orientation !== 'undefined';
    }

    showHint() {
        if (this.props.hints && !this.state.playing){
            return (
                <div className="hint">
                    <i className="fas fa-question-circle"></i> {this.state.hint}
                </div>
            );
        }
        return '';
    }

    setHint(newHint) {
        this.setState({hint: newHint});
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
            }
            if (data.playerBlack === this.props.user.username) {
                this.startGame('black', data.playerWhite, data.gameId, data.gameType, data.gameTime);
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
                <button
                    className={this.mobile ? "board_control_button_mobile" : "board_control_button"}
                    onClick={this.enterLobby}
                    onMouseEnter={() => { this.setHint('Become visible for other players to challenge you') }}
                    onMouseLeave={() => { this.setHint(false) }}
                ><i className="fas fa-sign-in-alt"></i> Enter Lobby</button>
            );
        }
        else {
            return (
                <button
                    className={this.mobile ? "board_control_button_mobile" : "board_control_button"}
                    onClick={this.leaveLobby}
                    onMouseLeave={() => { this.setHint(false) }}
                ><i className="fas fa-sign-in-alt" style={{
                    'transform' : 'rotate(180deg)'
                }}></i> Leave Lobby</button>
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
        return (
            <div className="play_bar"
                onMouseEnter={() => { this.setHint('Play live matches with other users') }}
                onMouseLeave={() => { this.setHint(false) }}
            >
                {this.state.hint ? this.showHint() : ''}
                {this.state.challenged ? this.showChallengedBox() : ''}
                {this.state.playing ? this.showVsBoard() : ''}
                <div className="controls_heading" style={{'height': '42px'}}>
                    <div style={{'margin' : '10px'}}>
                    <i className="fas fa-chess"></i> Game Room <i className="fas fa-chess-knight"></i>
                    </div>
                </div>
                <center>
                {
                    this.gameTypes.map((gameType) => {
                        return (
                            <button className={this.state.gameType === gameType ? "current_type_button" : "type_button"}
                                onMouseEnter={() => {this.setHint('To challenge another player, first select the game type')}}
                                onMouseLeave={() => {this.setHint(false)}}
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
                <div className="small_heading"
                        onMouseEnter={() => { this.setHint('Here you see other users waiting to play') }}
                        onMouseLeave={() => { this.setHint(false) }}    
                >
                        <i className="fas fa-users"></i> Players
                </div>
                {this.lobbyButton()}
                <div className="players_waiting">
                {
                    this.state.playerList.length === 0 ? '(There are no players waiting)' :
                    this.state.playerList.map((player, idx) => {
                        if (player === this.props.user.username){
                            return (
                                <div className="player_bar" key={idx} 
                                    onMouseEnter={() => { this.setHint('You cannot challenge yourself') }}
                                    onMouseLeave={() => { this.setHint(false) }}
                                >
                                    {player + ' (' + this.playerRatings[player] + ')'}
                                    <br />
                                    <i className="fas fa-user"></i> (This is you)
                                </div>
                            );
                        }
                        else if (player === 'T1000robot') {
                            return (
                                <div className="player_bar" key={idx} >
                                    {player + ' (' + this.playerRatings[player] + ')'}
                                    <br/>
                                    <button
                                        className="time_button challenge"
                                        onClick={() => this.challengePlayer(player)}
                                    >
                                        <Link
                                            to={'/play'}
                                            style={{
                                                'textDecoration': 'none',
                                                'color': 'lightgray'
                                            }}>
                                            <i className="fas fa-robot"></i> Challenge
                                        </Link>
                                    </button>
                                </div>
                                
                            );
                        }
                        else {
                            return (
                                <div className="player_bar" key={idx} 
                                    onMouseEnter={() => { this.setHint('Challenge this player to a game') }}
                                    onMouseLeave={() => { this.setHint(false) }}
                                >
                                    {player + ' (' + this.playerRatings[player] + ')'}
                                    <br />
                                    <button
                                        className="time_button challenge"
                                        onClick={() => this.challengePlayer(player)}
                                    ><i className="fas fa-user"></i> Challenge</button>
                                </div>
                            );
                        }
                    })
                }
                </div>
                </center>
            </div>
        );
    }
}

export default PlayBar;