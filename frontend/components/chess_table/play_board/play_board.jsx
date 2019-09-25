import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';

class PlayBoard extends React.Component {
    constructor(props) {
        super(props);
        this.flipped = false;
        this.game = new Game('960');
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
        this.playerColor = 'white';
        this.compColor = 'black';
        this.startGame = this.startGame.bind(this);
        this.takeComputerTurn = this.takeComputerTurn.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.gameButton = this.gameButton.bind(this);
        this.setLevel = this.setLevel.bind(this);
        this.typeSetting = 'Standard';
        this.setType = this.setType.bind(this);
        this.isMovePawnPromotion = this.isMovePawnPromotion.bind(this);
        this.handlePawnPromotion = this.handlePawnPromotion.bind(this);
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

    setType(typeSetting) {
        this.typeSetting = typeSetting;
        if (!this.game.playing){
            this.resetGame();
        }
        this.setState({});
    }

    setLevel(level) {
        this.game.level = level;
        this.setState({});
    }

    resetGame() {
        this.game = new Game(this.typeSetting);
        this.grid = this.game.grid;
        this.setState({
            grid: this.grid
        });
    }

    startGame(e) {
        this.game.start();
        this.currentPlayer = this.game.currentPlayer;
        this.setState({});
        if (this.currentPlayer === this.compColor){
            this.takeComputerTurn();
        }
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

    takeComputerTurn(){
        this.grid = this.game.makeAIMove();
        this.currentPlayer = this.game.currentPlayer;
        this.setState({
            grid: this.grid
        });
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
                    this.game.makeMove(this.handlePawnPromotion(move));
                }
                else {
                    this.game.makeMove(move);
                }
                this.currentPlayer = this.game.currentPlayer;   //pawn promotion has to replicate from here
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false
                });
                this.markToDrag = null;
                this.origin = null;
                /////COMPUTER TURN BELOW ///////
                if (!this.game.isGameOver()){
                    setTimeout( () => {
                        this.takeComputerTurn();
                    }, Math.random()*1500);
                }
                /////COMPUTER TURN ABOVE ///////        
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

    gameButton() {
        if (this.game.playing) {
            return (
                <button className={"board_control_button"} onClick={this.resetGame}> Reset Game</button>
            );
        }
        else {
            return (
                <button className={"board_control_button"} onClick={this.startGame}> Start Game</button>
            );
        }
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
                        {
                            this.game.gameTypes.map((gameType) => {
                                return (
                                    <button className={this.typeSetting === gameType ? "current_type_button" : "type_button"}
                                        onClick={() => this.setType(gameType)}
                                        key={gameType}>{gameType}</button>

                                );
                            })
                        }
                    <br/>
                    
                    <button className={"board_control_button"} onClick={this.flipBoard}><i className="fas fa-retweet"></i></button>
                    {this.gameButton()}
                        <div className="controls_heading">
                            <i className="fas fa-robot"></i>
                            <div style={{ 'marginLeft': '10px' }}>
                                Level
                            </div>
                        </div>
                        {
                            this.game.levels.map( (level) => {
                                return (
                                    <button className={this.game.level === level ? "current_level_button" : "level_button"}
                                    onClick={() => this.setLevel(level)} 
                                    key={level}>{level}</button>
                                    
                                );
                            })
                        }
                    <div className="colors">
                        <span className={this.game.playing && this.currentPlayer === this.playerColor ? "active_player" : ""} style={{ 'color': this.playerColor }} ><i className="fas fa-user"></i></span> 
                        <span className={this.game.playing && this.currentPlayer === this.compColor ? "active_player" : ""}  style={{ 'color': this.compColor }} ><i className="fas fa-robot"></i></span>
                    </div>
                    
                    
                    
                    
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

export default PlayBoard;