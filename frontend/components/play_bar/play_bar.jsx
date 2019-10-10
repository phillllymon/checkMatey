import React from 'react';
import ChessTableContainer from '../chess_table/chess_table_container';


class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            challenged: false,
            playerList: ['Mr Poopface'],
            messages: ['one', 'two', 'three'],
            currentMessage: '',
            playing: false
        }

        this.enterLobby = this.enterLobby.bind(this);
        this.receiveBroadcast = this.receiveBroadcast.bind(this);
        this.announcePresence = this.announcePresence.bind(this);
        this.requestRollCall = this.requestRollCall.bind(this);
        this.challengePlayer = this.challengePlayer.bind(this);
        this.showChallengedBox = this.showChallengedBox.bind(this);
        this.acceptChallenge = this.acceptChallenge.bind(this);
        this.startGame = this.startGame.bind(this);
        this.showVsBoard = this.showVsBoard.bind(this);
    }

    showVsBoard() {
        return (
            <div>
                woo you're playing!
                <ChessTableContainer mode={'vs'}/>
            </div>
        );
    }

    startGame(color) {
        this.setState({playing: true});
        console.log('begin game as ' + color);
    }

    acceptChallenge() {
        this.waitSub.perform('relayAcceptance', { 'playerWhoChallenged': this.state.challenged, 'playerWhoAccepts': this.props.user.username });
    }

    showChallengedBox() {
        return (
            <div className="challenge_box">
                You have been challenged by {this.state.challenged}.
                <button onClick={this.acceptChallenge}>Accept</button>
            </div>
        );
    }

    challengePlayer(player) {
        this.waitSub.perform('relayChallenge', {'challenger': this.props.user.username, 'challengee': player});
    }

    enterLobby() {
        this.requestRollCall();
        this.setState({visible: true});
        this.announcePresence();
    }

    announcePresence() {
        if (this.state.visible){
            this.waitSub.perform('relayPresence', { 'user': this.props.user.username });
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
                this.setState({ challenged: data.challenger });
            }
        }
        else if (data.playerWhite) {
            if (data.playerWhite === this.props.user.username) {
                this.startGame('white');
            }
            if (data.playerBlack === this.props.user.username) {
                this.startGame('black');
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
    }

    componentWillUnmount() {
        this.waitSub.perform('relayExit', { 'user': this.props.user.username });
        App.cable.subscriptions.remove(this.waitSub);
    }

    render() {
        return (
            <div className="play_bar">
                {this.state.challenged ? this.showChallengedBox() : ''}
                {this.state.playing ? this.showVsBoard() : ''}
                Waiting_Players
                <button onClick={this.enterLobby}>Enter Lobby</button>
                {
                    
                    this.state.playerList.map((player, idx) => {
                        return (
                            <div key={idx} onClick={() => this.challengePlayer(player)}>
                                {player}
                            </div>
                        );
                    })
                }
                
            </div>
        );
    }
}

export default PlayBar;