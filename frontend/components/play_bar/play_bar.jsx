import React from 'react';
import ChessTableContainer from '../chess_table/chess_table_container';
import { Link } from 'react-router-dom';
import { makeEmailChallenge } from '../../actions/ui_actions';


class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.times = [2, 5, 10, 15];
        this.gameTypes = ['Standard', 'Chess960', 'Pawn Clash'];
        this.state = {
            visible: true,
            challenged: false,
            challengedEmail: false,
            gameType: 'Standard',
            gameTime: 10,
            playerList: [],
            currentMessage: '',
            playing: false,
            hint: false,
            emailChallengePrompted: false,
            challengePrompted: false,
            challengeMade: false,
            emailInput: '',
            personalMessage: '',
            friendName: '',
            yourName: '',
            showGameOptions: false,
            showMessage: false
            
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
        this.promptEmailChallenge = this.promptEmailChallenge.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.sendEmailChallenge = this.sendEmailChallenge.bind(this);
        this.displayOptionControls = this.displayOptionControls.bind(this);
        this.describeGame = this.describeGame.bind(this);
        this.handleYourNameInput = this.handleYourNameInput.bind(this);
        this.handlePersonalMessageInput = this.handlePersonalMessageInput.bind(this);
        this.handleFriendNameInput = this.handleFriendNameInput.bind(this);
        this.announceChallengeId = this.announceChallengeId.bind(this);
        this.challengeEmail = this.challengeEmail.bind(this);
        this.showChallengedBoxEmail = this.showChallengedBoxEmail.bind(this);
        this.acceptChallengeEmail = this.acceptChallengeEmail.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.messageToShow = this.messageToShow.bind(this);

        this.mobile = typeof window.orientation !== 'undefined';
    }

    showMessage(message) {
        this.setState({ showMessage: message });
        setTimeout( () => {
            this.setState({ showMessage: false });
        }, 8000);
    }

    messageToShow() {
        return (
            <div className="hint">
                {this.state.showMessage}
            </div>
        );
    }

    handlePersonalMessageInput(e) {
        this.setState({ personalMessage: e.target.value });
    }

    handleFriendNameInput(e) {
        this.setState({ friendName: e.target.value });
    }

    handleYourNameInput(e) {
        this.setState({ yourName: e.target.value });
    }

    sendEmailChallenge(e) {
        e.preventDefault();
        this.showMessage('Challenge Sent!');
        let yourName = this.state.yourName;
        let message = this.state.personalMessage;
        let challengeId = Math.random().toString().slice(2);
        if (yourName === '') {
            yourName = 'A User';
        }
        if (message === '') {
            message = "Let's Play!"
        }
        this.props.makeEmailChallenge([challengeId, this.state.gameType, this.state.gameTime]);
        $.ajax({
            url: `/api/email`,
            method: 'POST',
            data: { email: {
                address: this.state.emailInput,
                friendName: this.state.friendName,
                yourName: yourName,
                message: message,
                challengeId: challengeId,
                gameType: this.state.gameType,
                gameTime: this.state.gameTime
            }}
        });
        this.setState({ 
            emailChallengePrompted: false, 
            showGameOptions: false, 
            emailInput: '',
            yourName: '',
            friendName: '',
            personalMessage: ''
        });
    }

    handleEmailInput(e) {
        this.setState({ emailInput: e.target.value });
    }

    promptEmailChallenge() {
        this.setState({ emailChallengePrompted: true });
    }

    promptChallenge(player) {
        this.setState({challengePrompted: player});
    }

    showEmailChallengeOptions() {
        return (
            <div className="modal_back" style={{zIndex:3}} onClick={() => {
                this.setState({
                    emailChallengePrompted: false,
                    showGameOptions: false,
                    emailInput: '',
                    yourName: '',
                    friendName: '',
                    personalMessage: ''
                });
            }}>
                <div className="challenge_box" onClick={(e) => e.stopPropagation()} >
                    <div className="challenge_box_header">
                        Challenge by Email
                    </div>
                    <center style={{ 'padding': '10px', 'maxHeight': '90vh', 'overflow': 'auto'}}>
                            <form onSubmit={this.sendEmailChallenge}>
                                Enter your friend's email:
                                <input
                                    className="enter_email"
                                    type="email"
                                    value={this.state.emailInput}
                                    onChange={this.handleEmailInput}
                                />
                                <br/>
                                Your friend will receive a link containing your 
                                challenge.
                                <br/>
                                <br/>
                                <button 
                                    className="tour_button" type="submit" 
                                >
                                    Send Challenge!
                                </button>
                                <br/>
                                <br/>
                                <div style={{'fontSize': '70%'}}>
                                    Optional:
                                </div>
                                <input
                                    className="enter_email"
                                    style={{'width': '40%', 'fontSize': '70%'}}
                                    type="text"
                                    placeholder="friend's name"
                                    value={this.state.friendName}
                                    onChange={this.handleFriendNameInput}
                                />
                                <input
                                    className="enter_email"
                                style={{ 'width': '40%', 'fontSize': '70%' }}
                                    type="text"
                                    placeholder="your name"
                                    value={this.state.yourName}
                                    onChange={this.handleYourNameInput}
                                />
                                <input
                                    className="enter_email"
                                    style={{'fontSize': '70%'}}
                                    type="text"
                                    placeholder="personal message"
                                    value={this.state.personalMessage}
                                    onChange={this.handlePersonalMessageInput}
                                />
                            </form>
                            <button
                                className="time_button challenge"
                                onClick={(e) => {
                                    this.setState({ 
                                        emailChallengePrompted: false,
                                        showGameOptions: false,
                                        emailInput: '',
                                        yourName: '',
                                        friendName: '',
                                        personalMessage: ''
                                    });
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                className="time_button challenge"
                                onClick={(e) => {
                                    this.setState({showGameOptions: true});
                                }}
                            >
                                Edit Challenge Details
                            </button>
                            <br/>
                            {this.state.showGameOptions ? this.describeGame() : ''}
                            {this.state.showGameOptions ? this.displayOptionControls() : ''}
                        </center>
                </div>
            </div>
        );
    }

    describeGame() {
        return (
            <div>
                <br/>
                You are sending a challenge for a {this.state.gameType} game
                with {this.state.gameTime} minutes on the clock.
                <br/>
                <br/>
            </div>
        );
    }

    displayOptionControls() {
        return (
            <div>
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

                < div className = "smaller_heading" >
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
                </div >
            </div>
        );
    }

    showChallengeOptions() {
        return (
            <div className="modal_back">
                <div className="challenge_box">
                    <div className="challenge_box_header">
                        Challenge Options:
                    </div>
                    <center>
                        <br/>
                        {this.displayOptionControls()}
                        <br/>
                        <button
                            className="board_control_button"
                            onClick={() => this.setState({ challengePrompted: false })}
                        >
                            Cancel
                        </button>
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
                    </center>
                </div>
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
                    backToLobby={this.enterLobby}
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

    acceptChallengeEmail() {
        this.waitSub.perform('relayAcceptance', {
            'playerWhoChallenged': this.state.challengedEmail.challenger,
            'playerWhoAccepts': this.props.user.username,
            'gameType': this.state.challengedEmail.gameType,
            'gameTime': this.state.challengedEmail.gameTime
        });
        this.setState({ challengedEmail: false });
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
            <div className="modal_back">
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

    showChallengedBoxEmail() {
        return (
            <div className="modal_back">
                <div className={this.mobile ? "challenge_box_mobile" : "challenge_box"}>
                    <center>
                        <div className={this.mobile ? "challenge_box_header_mobile" : "challenge_box_header"}>
                            Ready to Play?
                    </div>
                        <br />
                        {this.state.challengedEmail.challenger} is ready for your match!
                    <br />
                        <br />
                        <button className={this.mobile ? "board_control_button_mobile" : "board_control_button"}
                            onClick={this.acceptChallengeEmail}
                        >Begin!</button>
                        <br />
                        <br />
                    </center>
                </div>
            </div>
        );
    }

    challengeEmail(player, gameType, gameTime) {
        this.waitSub.perform('relayEmailChallenge', {
            'challengerEmail': this.props.user.username,
            'challengeeEmail': player,
            'gameType': gameType,
            'gameTime': gameTime
        });
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

    announceChallengeId() {
        this.waitSub.perform('relayChallengeId', { 'challengeId': this.props.user.email, 'username': this.props.user.username }); //if user had email challenge link, challengeId is saved as that user's email
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
        else if (data.challengeId) {
            this.props.challenges.forEach( (challenge) => {
                if (challenge[0] === data.challengeId) {
                    this.challengeEmail(data.username, challenge[1], challenge[2]);
                    this.props.clearChallenges();
                    this.showMessage('Your email challenge has been answered!');
                }
            });
        }
        else if (data.challengerEmail) {
            if (this.props.user.username === data.challengeeEmail) {
                this.setState({
                    challengedEmail: {
                        challenger: data.challengerEmail,
                        gameType: data.gameType,
                        gameTime: data.gameTime
                    }
                });
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
        setTimeout(this.requestRollCall, 600);
        setTimeout(this.announceChallengeId, 1000);
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
                    onMouseEnter={() => { this.setHint('Become invisible') }}
                    onMouseLeave={() => { this.setHint(false) }}
                ><i className="fas fa-eye-slash"></i> {this.mobile ? 'Leave Lobby' : ''}</div>
            );
        }
    }

    render() {
        if (this.mobile) {
            return (
                <div className="play_bar_mobile">
                    {this.state.challengedEmail ? this.showChallengedBoxEmail() : ''}
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
        let height = (window.innerHeight * 0.4 < 300 ? 300 : window.innerHeight * 0.4) - 150;
        return (
            <div className="battle_options">
                {this.state.emailChallengePrompted ? this.showEmailChallengeOptions() : ''}
                {this.state.challengePrompted ? this.showChallengeOptions() : ''}
                {this.state.hint ? this.showHint() : ''}
                {this.state.challenged ? this.showChallengedBox() : ''}
                {this.state.challengedEmail ? this.showChallengedBoxEmail() : ''}
                {this.state.playing ? this.showVsBoard() : ''}
                {this.state.showMessage ? this.messageToShow() : ''}
                <div className="play_bar"
                    id="multiplayer" 
                    onMouseEnter={() => { this.setHint('Play live matches with other users') }}
                    onMouseLeave={() => { this.setHint(false) }}
                >
                    <div className="controls_heading better_color" style={{ 'height': '42px' }}>
                        <div style={{ 'margin': '10px' }}>
                            <i className="fas fa-users"></i> Multiplayer
                        </div>
                    </div>
                    
                    <center>

                        
                        <div className="players_waiting" style={{'height': `${height}px`, 'overflow': 'auto'}}>
                            {this.lobbyButton()}
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
                            No one to challenge?
                        </div>
                        <button
                            id="invite_friend"
                            onMouseEnter={() => { this.setHint('Challenge a friend to play through email') }}
                            onMouseLeave={() => { this.setHint(false) }}
                            onClick={this.promptEmailChallenge}
                            className="tour_button"
                            style={{
                                'position': 'absolute',
                                'top': '100%',
                                'transform': 'translate(-50%, -110%)',
                                'padding': '18px',
                                'height': '60px',
                                'width': '180px',
                                'margin': '0'
                            }}
                        >
                            Invite a Friend
                        </button>
                    </center>
                </div>
                
                    <div className="flag_two">
                    </div>
                
                <div className="play_bar" id="compGame">
                    <Link to={'/play'} className="controls_heading better_color" style={{ 'height': '42px', 'textDecoration': 'none', 'cursor': 'auto' }}>
                        
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
                                    'transform': 'translate(-50%, -110%)',
                                    'padding': '18px',
                                    'height': '60px',
                                    'width': '180px',
                                    'margin': '0'
                                }}
                            >
                                <div 
                                    className="sword" 
                                    style={{
                                        'float': 'left', 
                                        'width': '40px',
                                        'height': '40px',
                                        'transform': 'translate(0, -10px)'
                                    }}>
                                </div> 
                                PLAY <i className="fas fa-chess" style={{
                                    'float': 'right',
                                    'width': '40px',
                                    'height': '40px',
                                    'fontSize': '35px',
                                    'transform': 'translate(0, -10px)'
                                }}></i>
                        </button>
                        </Link>
                    </center>
                </div>
            </div>
        );
    }
}

export default PlayBar;