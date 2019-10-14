import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';

class VsBoard extends React.Component {
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
            opponentTime: [this.props.gameTime, 0]
        }
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.abortDrag = this.abortDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
        this.flipBoard = this.flipBoard.bind(this);
        this.player = this.props.player;
        this.opponent = this.props.opponent;
        this.playerColor = this.props.color;
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
    }

    tickClock() {
        if (this.game.currentPlayer === this.playerColor){
            let newMinutes = this.state.playerTime[0];
            let newSeconds = this.state.playerTime[1] - 1;
            if (newSeconds < 0) {
                newSeconds = 59;
                newMinutes -= 1;
                if (newMinutes < 0){
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

        return (
            <div className="modal_back">
                <div style={{'position' : 'relative'}}>
                    <div className="challenge_box">
                        <div className="challenge_box_header">
                            {headMessage}
                        </div>
                        <center>
                            
                            <br/>
                        {endMessage}
                            <br/>
                            <br/>
                            <button className="time_button" onClick={this.props.leaveGame}>Leave Game</button>   
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
    }

    drawButtons() {
        return (
            <div className="offerDraw">
                <center>
                {this.opponent} offers a draw:
                <br/>
                <button className="time_button" onClick={() => this.respondToDrawOffer('accept')}>Accept</button>
                <button className="time_button" onClick={() => this.respondToDrawOffer('decline')}>Decline</button>
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
                    this.setState({});
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

    beginDrag(e) {
        if (e.target.className.includes('fa-chess')) {
            this.setState({ dragging: true, dragY: e.clientY, dragX: e.clientX });
            this.origin = e.target.id;
            this.markToDrag = this.state.grid[parseInt(this.origin[0])][parseInt(this.origin[2])];
        }
    }

    endDrag(e) {
        if (this.state.dragging) {
            let destination = e.target.id;
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
                this.playSub.perform('relayMove', {'gameId': this.props.gameId, 'move': move, 'color': this.playerColor});
                this.currentPlayer = this.game.currentPlayer;
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false
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
        return (
            <div className="chess_table">
                <div
                    className={this.flipped ? "board flipped" : "board"}
                    onMouseMove={this.dragPiece}
                    onMouseLeave={this.abortDrag}
                >
                    {this.state.dragging ? this.displayDragPiece() : ''}
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
                                                onMouseDown={this.beginDrag}
                                                onMouseUp={this.endDrag}
                                                key={rIdx + cIdx}
                                                id={[rIdx, cIdx]}
                                                className={(rIdx + cIdx) % 2 === 0 ? 'w highlight' : 'b highlight'}
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
                                            onMouseDown={this.beginDrag}
                                            onMouseUp={this.endDrag}
                                            key={rIdx + cIdx}
                                            id={[rIdx, cIdx]}
                                            className={(rIdx + cIdx) % 2 === 0 ? 'w' : 'b'}
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
                <div className="board_controls">
                    <center>
                    <div className="controls_heading">
                            <i className="fas fa-chess-knight"></i>
                        <div style={{ 'marginLeft': '10px' }}>
                            Game
                        </div>
                    </div>
                        <button className="board_control_button" style={{ 'width': '50px' }} onClick={this.flipBoard}><i className="fas fa-retweet"></i></button>
                        <button className="board_control_button" style={{ 'width': '50px' }}  onClick={this.offerDraw}><i className="fas fa-handshake"></i></button>
                        <button className="board_control_button" style={{ 'width': '50px' }}  onClick={this.resign}><i className="fab fa-font-awesome-flag"></i></button>
                        <br/>
                    
                    
                    <div className="game_alert">
                    {this.state.drawOffered ? this.drawButtons() : ''}
                    {this.game.isGameOver() ? this.game.gameOverMessage : (this.game.inCheck ? 'Check!' : '')}
                    </div>

                    <br />
                    you: {this.player}
                    <br />
                    {this.state.playerTime[0]}:{this.state.playerTime[1]}
                    <br />
                    against: {this.opponent}
                    <br />
                    {this.state.opponentTime[0]}:{this.state.opponentTime[1]}
                    <br />

                    <div className="outer_list">
                        <div className="moves_list">
                            {
                                this.game.moves.map((move, idx) => {
                                    return (
                                        <div className={idx % 2 === 0 ? "inactive_move_light not" : "inactive_move_dark not"} key={idx}>
                                            {move}
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    </center>
                </div>
            </div>
        );
    }
}

export default VsBoard;