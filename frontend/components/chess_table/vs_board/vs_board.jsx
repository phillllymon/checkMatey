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
            flipped: this.flipped
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

        this.receiveBroadcast = this.receiveBroadcast.bind(this);

        this.offerDraw = this.offerDraw.bind(this);
        this.resign = this.resign.bind(this);

        this.startGame = this.startGame.bind(this);
        this.isMovePawnPromotion = this.isMovePawnPromotion.bind(this);
        this.handlePawnPromotion = this.handlePawnPromotion.bind(this);
    }

    offerDraw() {
        console.log('offer draw');
    }

    resign() {
        console.log('resign');
    }

    receiveBroadcast(data) {
        if (data.move) {
            if (data.color !== this.playerColor &&
                data.gameId === this.props.gameId) {
                this.game.makeMove(data.move);
                this.currentPlayer = this.game.currentPlayer;
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
    }

    componentWillUnmount() {
        App.cable.subscriptions.remove(this.playSub);
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
        return (
            <div className="chess_table">
                <div
                    className={this.flipped ? "board flipped" : "board"}
                    onMouseMove={this.dragPiece}
                    onMouseLeave={this.abortDrag}
                >
                    {this.state.dragging ? this.displayDragPiece() : ''}
                    {
                        this.grid.map((row, rIdx) => {
                            return (
                                row.map((spot, cIdx) => {
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
                        <button className="board_control_button" onClick={this.flipBoard}><i className="fas fa-retweet"></i></button>
                        <button className="board_control_button" onClick={this.offerDraw}><i className="fas fa-handshake"></i></button>
                        <button className="board_control_button" onClick={this.resign}><i className="fab fa-font-awesome-flag"></i></button>
                        <br/>
                    <br/>
                    you: {this.player}
                    <br/>
                    you play: {this.playerColor}
                    <br/>
                    against: {this.opponent}
                    <br/>
                    {this.game.currentPlayer}'s turn
                    <br/>
                    type: {this.props.gameType instanceof Array ? 'someArray' : this.props.gameType}
                    <br/>
                    time: {this.props.gameTime}
                    <br/>
                    game id: {this.props.gameId}
                    
                    <div className="game_alert">
                    {this.game.inCheck ? (this.game.isGameOver() ? 'Checkmate!' : 'Check!' ) : ''}<br/>
                    </div>
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