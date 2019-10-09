import React from 'react';
//import { createConsumer } from '@rails/actioncable';

class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            playerList: ['Mr Poopface'],
            messages: ['one', 'two', 'three'],
            currentMessage: ''
        }

        this.enterLobby = this.enterLobby.bind(this);
        this.receiveBroadcast = this.receiveBroadcast.bind(this);
        this.announcePresence = this.announcePresence.bind(this);
        this.requestRollCall = this.requestRollCall.bind(this);
        this.challengePlayer = this.challengePlayer.bind(this);
    }

    challengePlayer(player) {
        console.log('trying to challenge ' + player);
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
            if (!this.state.playerList.includes(data.user)) {
                this.state.playerList.splice(this.state.playerList.indexOf(data.user));
            }
        }
        else if (data.challenger) {
            console.log(data.challenger + ' challenges ' + data.challengee);
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