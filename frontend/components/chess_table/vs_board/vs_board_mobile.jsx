import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';
import { getPieceIcon } from '../piece';
import {
    seqToString
} from '../../../util/chess_util';

class VsBoardMobile extends React.Component {
    constructor(props) {
        super(props);
        this.flipped = (this.props.color === 'black');
        this.game = new Game(this.props.gameType);
        this.grid = this.game.grid;
        this.state = {
            grid: this.grid,
            dragging: false,
            flipped: this.flipped,
            drawOffered: false,
            gameIsDone: false,
            playerTime: [this.props.gameTime, 0],
            opponentTime: [this.props.gameTime, 0],
            chatInput: '',
            showChat: false
        }
        this.chat = [],
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.abortDrag = this.abortDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
        this.flipBoard = this.flipBoard.bind(this);
        this.player = this.props.player;
        this.opponent = this.props.opponent;
        this.playerColor = this.props.color;
        this.opponentColor = this.playerColor === 'black' ? 'white' : 'black';
        this.highlightSquare = null;

        this.receiveBroadcast = this.receiveBroadcast.bind(this);

        this.offerDraw = this.offerDraw.bind(this);
        this.resign = this.resign.bind(this);
        this.respondToDrawOffer = this.respondToDrawOffer.bind(this);
        this.endTheGame = this.endTheGame.bind(this);

        this.startGame = this.startGame.bind(this);
        this.isMovePawnPromotion = this.isMovePawnPromotion.bind(this);
        this.handlePawnPromotion = this.handlePawnPromotion.bind(this);
        this.drawButtons = this.drawButtons.bind(this);
        this.showEnding = this.showEnding.bind(this);
        this.tickClock = this.tickClock.bind(this);
        this.startClock = this.startClock.bind(this);
        this.getBlackPoints = this.getBlackPoints.bind(this);
        this.getWhitePoints = this.getWhitePoints.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChatInput = this.handleChatInput.bind(this);
        this.sendChat = this.sendChat.bind(this);
        this.toggleChat = this.toggleChat.bind(this);
    }


    toggleChat() {
        this.setState({ showChat: (this.state.showChat ? false : true) })
    }


    sendChat() {
        this.playSub.perform('relayMessage', { 'gameId': this.props.gameId, 'chat': this.state.chatInput, 'player': this.player });
        this.setState({ chatInput: '' });
    }

    handleChatInput(e) {
        this.setState({ chatInput: e.target.value });
    }

    handleClick(e) {
        if (this.state.dragging) {
            this.endDrag(e.target);
            this.setState({dragging: false});       
        }
        else {
            this.beginDrag(e.target);
        }
    }

    getBlackPoints() {
        if (this.game.points[0] > this.game.points[1]){
            return ' +' + (this.game.points[0] - this.game.points[1]).toString();
        }
        else {
            return '';
        }
    }

    getWhitePoints() {
        if (this.game.points[1] > this.game.points[0]) {
            return ' +' + (this.game.points[1] - this.game.points[0]).toString();
        }
        else {
            return '';
        }
    }

    tickClock() {
        if (this.game.currentPlayer === this.playerColor){
            let newMinutes = this.state.playerTime[0];
            let newSeconds = this.state.playerTime[1] - 1;
            if (newSeconds < 0) {
                newSeconds = 59;
                newMinutes -= 1;
                if (newMinutes < 0){
                    newMinutes = 0;
                    newSeconds = 0;
                    this.setState({playerTime: [newMinutes, newSeconds]});
                    window.clearInterval(this.clockInterval);
                    this.playSub.perform('relayTimeout', { 'gameId': this.props.gameId, 'color': this.playerColor });
                }
            }
            this.setState({
                playerTime: [newMinutes, newSeconds]
            });
        }
        else {
            let newMinutes = this.state.opponentTime[0];
            let newSeconds = this.state.opponentTime[1] - 1;
            if (newSeconds < 0) {
                newSeconds = 59;
                newMinutes -= 1;
            }
            this.setState({
                opponentTime: [newMinutes, newSeconds]
            });
        }
    }

    showEnding(ending) {
        let headMessage = 'Checkmate!';
        let endMessage = '';
        switch(ending) {
            case 'Checkmate!':
                endMessage = this.winner + ' won by checkmate.'
                break;
            case 'accept':
                headMessage = 'Draw';
                endMessage = 'Game is a draw by agreement.';
                break;
            case 'Stalemate':
                headMessage = 'Stalemate';
                endMessage = 'The game is a stalemate.';
                break;
            case 'resign':
                headMessage = 'Resignation';
                endMessage = this.winner + ' won by resignation.'
                break;
            case 'timeout':
                headMessage = 'Timeout';
                endMessage = this.winner + ' won on time.'
                window.clearInterval(this.clockInterval);
                break;
            default:
                break;
        }
        if (this.winner) {
            if (this.winner === this.player) {
                endMessage = endMessage + ' Your rating went up by four points.';
            }
            else {
                endMessage = endMessage + ' Your rating went down by four points.';
            }
        }
        else {
            endMessage = endMessage + ' Your rating remains the same.'
        }

        return (
            <div className="modal_back">
                <div style={{'position' : 'relative'}}>
                    <div className="challenge_box_mobile">
                        <div className="challenge_box_header_mobile">
                            {headMessage}
                        </div>
                        <center>
                            
                            <br/>
                        {endMessage}
                            <br/>
                            <br/>
                            <button className="time_button_mobile" onClick={this.props.leaveGame}>Leave Game</button>   
                            <br/>
                            <br/>
                        </center>
                    </div>
                </div>
            </div>
        );
    }

    endTheGame(ending) {
        switch (ending) {
            case 'Checkmate!':
                this.winner = (this.game.currentPlayer === this.playerColor ?
                this.opponent :
                this.player );
        }
        this.setState({
            drawOffered: false,
            gameIsDone: ending
        });
        if (this.playerColor === 'white') {
            $.ajax({
                url: `/api/games`,
                method: 'POST',
                data: {
                    game: {
                        player_white: this.player,
                        player_black: this.opponent,
                        moves: seqToString(this.game.gameSoFar),
                        winner: this.winner,
                        ending: ending
                    }
                }
            });
        }
        let oldRating = this.props.userRating;
        let newRating = parseInt(oldRating);
        if (this.winner) {
            newRating = this.winner === this.player ?
                newRating + 4 :
                newRating - 4
        }
        $.ajax({
            url: `/api/users/${this.props.userId}`,
            method: 'PATCH',
            data: {
                'user': {
                    rating: newRating
                }
            }
        });
    }

    drawButtons() {
        return (
            <div className="offerDraw_mobile">
                <center>
                Draw offered:
                <button className="time_button_mobile" onClick={() => this.respondToDrawOffer('accept')}>Accept</button>
                <button className="time_button_mobile" onClick={() => this.respondToDrawOffer('decline')}>Decline</button>
                </center>
            </div>
        );
    }

    offerDraw() {
        this.playSub.perform('relayDraw', { 'gameId': this.props.gameId, 'message': 'offer', 'color': this.playerColor});
    }

    respondToDrawOffer(response) {
        this.playSub.perform('relayDraw', { 'gameId': this.props.gameId, 'message': response, 'color': this.playerColor });
    }

    resign() {
        this.playSub.perform('relayResign', { 'gameId': this.props.gameId, 'color': this.playerColor });
    }

    receiveBroadcast(data) {
        if (data.gameId === this.props.gameId){
            if (data.move) {
                if (data.color !== this.playerColor) {
                    this.game.makeMove(data.move);
                    this.highlightSquare = data.move[1];
                    this.currentPlayer = this.game.currentPlayer;
                    this.setState({opponentTime: data.time});
                }
                if (this.game.isGameOver()) {
                    this.endTheGame(this.game.gameOverMessage);
                }
            }
            if (data.message) {
                if (data.color !== this.playerColor) {
                    this.setState({ drawOffered: true });
                }
                if (data.message === 'accept') {
                    this.endTheGame('accept');
                }
                if (data.message === 'decline') {
                    this.setState({drawOffered: false});
                }
            }
            if (data.resign) {
                this.winner = (this.playerColor === data.color ?
                this.opponent :
                this.player);
                this.endTheGame('resign');
            }
            if (data.timeout) {
                this.winner = (this.playerColor === data.color ?
                    this.opponent :
                    this.player);
                this.endTheGame('timeout');
            }
            if (data.chat) {
                this.chat.push([data.player, data.chat]);
                this.setState({});
            }
        }
    }

    componentDidMount() {
        this.playSub = App.cable.subscriptions.create(
            { channel: 'Playing' },
            {
                received: (data) => {
                    this.receiveBroadcast(data);
                }
            }
        );
        this.startGame();
        this.setState({});
        this.startClock();
    }

    startClock() {
        this.clockInterval = window.setInterval(this.tickClock, 1000);
    }

    componentWillUnmount() {
        App.cable.subscriptions.remove(this.playSub);
        window.clearInterval(this.clockInterval);
    }

    handlePawnPromotion(move) {
        this.displayPromotion = true;
        move[1].push('special');
        move[1].push(this.game.currentPlayer === 'white' ? 'q' : 'Q' );
        return move;
    }

    isMovePawnPromotion(move) {
        let origin = move[0];
        let destination = move[1];
        if (this.grid[origin[0]][origin[1]] === 'p' && destination[0] === 0){
            return true;
        }
        if (this.grid[origin[0]][origin[1]] === 'P' && destination[0] === 7) {
            return true;
        }
        return false;
    }

    startGame(e) {
        this.game.start();
        this.currentPlayer = this.game.currentPlayer;
    }

    flipBoard(e) {
        this.flipped = this.flipped ? false : true;
        if (!this.game.playing){
            this.playerColor = this.playerColor === 'white' ? 'black' : 'white';
            this.compColor = this.playerColor === 'white' ? 'black' : 'white';
        }
        this.setState({ flipped: this.flipped });
    }

    displayDragPiece() {
        let dragStyle = {
            'position': 'fixed',
            'transform': 'translate(-50%, -50%)',
            'height': 'auto',
            'width': 'auto',
            'fontSize': '6vmin',
            'cursor': 'grabbing',
            'pointerEvents': 'none',
            top: this.state.dragY,
            left: this.state.dragX,
        };
        return (
            <div style={dragStyle}>
                <Piece
                    mark={this.markToDrag}
                />
            </div>
        );
    }

    dragPiece(e) {
        if (this.state.dragging) {
            this.setState({ dragY: e.clientY, dragX: e.clientX });
        }
    }

    beginDrag(target) {
        if (target.className.includes('fa-chess')) {
            this.setState({ dragging: true});
            this.origin = target.id;
            this.markToDrag = this.state.grid[parseInt(this.origin[0])][parseInt(this.origin[2])];
        }
    }

    endDrag(target) {
        if (this.state.dragging) {
            let destination = target.id;
            let move = [
                [ parseInt(this.origin[0]), parseInt(this.origin[2]) ], 
                [ parseInt(destination[0]), parseInt(destination[2]) ]
            ];
            if (destination !== this.origin && this.game.isMoveLegal(move, this.currentPlayer) && this.game.level === 0) {
                this.game.makeMove(move);
                this.currentPlayer = this.game.currentPlayer;
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false
                });
                this.markToDrag = null;
                this.origin = null;
            }
            if (destination !== this.origin && this.game.isMoveLegal(move, this.currentPlayer) && this.currentPlayer === this.playerColor) {
                if (this.isMovePawnPromotion(move)){
                    move = this.handlePawnPromotion(move);
                }
                this.game.makeMove(move);
                this.highlightSquare = move[1];
                this.playSub.perform('relayMove', {
                    'gameId': this.props.gameId, 
                    'move': move, 
                    'color': this.playerColor, 
                    'time': this.state.playerTime
                });
                this.currentPlayer = this.game.currentPlayer;
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false,
                    drawOffered: false
                });
                this.markToDrag = null;
                this.origin = null;   
            }
            else {
                this.setState({
                    grid: this.grid,
                    dragging: false
                });
                this.markToDrag = null;
                this.origin = null;
            }
        }
    }

    abortDrag(e) {
        this.setState({
            grid: this.grid,
            dragging: false
        });
        this.markToDrag = null;
        this.origin = null;
    }

    render() {
        let highlightSquare = this.highlightSquare;
        if (this.state.showChat) {
            return (
                <div className="chess_table_mobile">
                    <div className="board_controls_mobile">
                        <center>

                            <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.flipBoard}><i className="fas fa-retweet"></i></button>
                            <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.offerDraw}><i className="fas fa-handshake"></i></button>
                            <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.resign}><i className="fab fa-font-awesome-flag"></i></button>
                            <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.toggleChat}><i className="fas fa-chess"></i></button>
                            <br />
                        </center>
                        <div className="controls_heading_mobile">
                            <i className="fas fa-comments"></i>
                            <input
                                style={{
                                    'marginRight': '2vw',
                                    'marginLeft': '2vw',
                                    'width': '100%'
                                }}
                                className="bigger"
                                type="text"
                                value={this.state.chatInput}
                                onChange={this.handleChatInput}
                            />
                            <button className="send_button_mobile" onClick={this.sendChat}>Send</button>
                        </div>
                        <div className="chat_mobile">
                            {
                                this.chat.map((message, idx) => {
                                    return (
                                        <div className={idx % 2 === 0 ? "inactive_move_light bigger" : "inactive_move_dark bigger"} key={idx}>
                                            <i style={{ 'fontSize': '60%' }}>{message[0]}:</i>
                                            <br />
                                            {message[1]}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="chess_table_mobile">
                <div className="board_controls_mobile">
                    <center>

                        <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.flipBoard}><i className="fas fa-retweet"></i></button>
                        <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.offerDraw}><i className="fas fa-handshake"></i></button>
                        <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.resign}><i className="fab fa-font-awesome-flag"></i></button>
                        <button className="board_control_button_mobile" style={{ 'width': '20vw' }} onClick={this.toggleChat}><i className="fas fa-comments"></i></button>
                        <br />

                        <div className="captured_pieces_mobile" style={{ 'color': this.opponentColor }}>
                            {
                                this.game.capturedPieces[(this.opponentColor === 'black' ? 0 : 1)].map((mark, idx) => {
                                    return (
                                        <span key={idx}>{getPieceIcon(mark)}</span>
                                    )
                                })
                            }
                            {this.opponentColor === 'black' ? this.getBlackPoints() : this.getWhitePoints()}
                        </div>
                        <div className="player_info_mobile">
                            <div className={this.game.playing && this.currentPlayer === this.opponentColor ? "current_player_mobile" : "player_mobile"}
                                style={{ 'color': this.opponentColor }} >
                                <i className="fas fa-user" style={{ 'marginRight': '10px' }}></i> {this.opponent}
                            </div>
                            <div className={this.game.playing && this.currentPlayer === this.opponentColor ? "current_player_mobile" : "player_mobile"}
                                style={{ 'color': this.opponentColor }} >
                                <i className="far fa-clock" style={{ 'marginRight': '10px' }}></i> {this.state.opponentTime[0]}:{this.state.opponentTime[1] < 10 ? '0' : ''}{this.state.opponentTime[1]}

                            </div>
                        </div>
                        
                <div
                    className={this.flipped ? "board_mobile flipped_mobile" : "board_mobile"}
                >
                    {this.state.gameIsDone ? this.showEnding(this.state.gameIsDone) : ''}
                    {
                        this.grid.map((row, rIdx) => {
                            return (
                                row.map((spot, cIdx) => {
                                    if (highlightSquare && 
                                        highlightSquare[0] === rIdx &&
                                        highlightSquare[1] === cIdx) {
                                        return (
                                            <div
                                                onClick={this.handleClick}
                                                key={rIdx + cIdx}
                                                id={[rIdx, cIdx]}
                                                className={(rIdx + cIdx) % 2 === 0 ? 'w_mobile highlight_mobile' : 'b_mobile highlight_mobile'}
                                            >
                                                <Piece
                                                    grayed={this.state.dragging &&
                                                        parseInt(this.origin[0]) === rIdx
                                                        && parseInt(this.origin[2]) === cIdx ?
                                                        true : false}
                                                    pos={[rIdx, cIdx]}
                                                    mark={this.state.grid[rIdx][cIdx]}
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div
                                            onClick={this.handleClick}
                                            key={rIdx + cIdx}
                                            id={[rIdx, cIdx]}
                                            className={(rIdx + cIdx) % 2 === 0 ? 'w_mobile' : 'b_mobile'}
                                        >
                                            <Piece
                                                grayed={this.state.dragging &&
                                                    parseInt(this.origin[0]) === rIdx
                                                    && parseInt(this.origin[2]) === cIdx ?
                                                    true : false}
                                                pos={[rIdx, cIdx]}
                                                mark={this.state.grid[rIdx][cIdx]}
                                            />
                                        </div>
                                    );
                                })
                            );
                        })
                    }
                </div>
                
                <div className="player_info_mobile">
                    <div className={this.game.playing && this.currentPlayer === this.playerColor ? "current_player_mobile" : "player_mobile"}
                        style={{ 'color': this.playerColor }} >
                        <i className="fas fa-user" style={{ 'marginRight': '10px' }}></i> {this.player}
                    </div>
                    <div className={this.game.playing && this.currentPlayer === this.playerColor ? "current_player_mobile" : "player_mobile"}
                        style={{ 'color': this.playerColor }} >
                        <i className="far fa-clock" style={{ 'marginRight': '10px' }}></i> {this.state.playerTime[0]}:{this.state.playerTime[1] < 10 ? '0' : ''}{this.state.playerTime[1]}
                    </div>
                </div>
                        <div className="captured_pieces_mobile" style={{ 'color': this.playerColor }}>
                            {
                                this.game.capturedPieces[(this.opponentColor === 'black' ? 1 : 0)].map((mark, idx) => {
                                    return (
                                        <span key={idx}>{getPieceIcon(mark)}</span>
                                    )
                                })
                            }
                            {this.playerColor === 'black' ? this.getBlackPoints() : this.getWhitePoints()}
                        </div>
                    
                    
                        <div className="game_alert_mobile">
                    {this.state.drawOffered ? this.drawButtons() : ''}
                    {this.game.isGameOver() ? this.game.gameOverMessage : (this.game.inCheck ? 'Check!' : '')}
                    </div>

                    </center>
                    
                </div>
            </div>
        );
    }
}

export default VsBoardMobile;