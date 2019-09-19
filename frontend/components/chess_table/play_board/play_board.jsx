import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';

class PlayBoard extends React.Component {
    constructor(props) {
        super(props);
        this.flipped = false;
        this.game = new Game;
        this.grid = this.game.grid;
        this.state = {
            grid: this.grid,
            dragging: false,
            flipped: this.flipped
        }
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
        this.flipBoard = this.flipBoard.bind(this);
        this.player = this.props.player;
        this.playerColor = 'white';
        this.compColor = 'black';
        this.startGame = this.startGame.bind(this);
        this.testMove = this.testMove.bind(this);
    }

    testMove() {
        this.game.makeMove([[0, 1], [2, 2]]);
        this.grid = this.game.grid;
        this.setState({grid: this.grid});
    }

    startGame(e) {
        this.game.start();
        this.currentPlayer = this.game.currentPlayer;
        this.setState({});
    }

    flipBoard(e) {
        this.flipped = this.flipped ? false : true;
        if (!this.game.started){
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
            'fontSize': '5vmin',
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
            if (destination !== this.origin && this.game.isMoveLegal(move, this.currentPlayer)) {
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

    render() {
        return (
            <div className="chess_table">
                <div
                    className={this.flipped ? "board flipped" : "board"}
                    onMouseMove={this.dragPiece}
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
                    
                    <button className={"board_control_button"} onClick={this.flipBoard}><i className="fas fa-retweet"></i> Flip</button>
                    <br/>
                    {this.player} plays {this.playerColor}.
                    <br/>
                    Computer plays {this.compColor}.
                    </center>
                    <button className={"board_control_button"} onClick={this.startGame}> Start Game</button>
                    <button className={"board_control_button"} onClick={this.testMove}> Test Move</button>
                    <br/>
                    {this.game.playing ? this.currentPlayer + "'s turn" : ''}
                    <br/>
                    {this.game.inCheck ? 'Check!' : 'no check'}
                    <br/>
                    {this.game.isGameOver() ? 'CheckMate!' : ''}
                </div>
            </div>
        );
    }
}

export default PlayBoard;