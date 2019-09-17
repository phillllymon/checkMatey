import React from 'react';
import Game from './game';
import Cell from './cell';

class Tetris extends React.Component {
    constructor(props) {
        super(props);
        this.game = new Game;
        this.grid = this.game.grid;
        this.piecePos = [2, 4];
        this.state = {
            grid: this.game.grid,
            level: 1
        };
        this.handleInput = this.handleInput.bind(this);
        this.startGame = this.startGame.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
        this.startButton = this.startButton.bind(this);
    }

    startGame(e) {
        this.setState({playing: true});
        this.game = new Game;
        this.game.start();
        this.level = this.game.level;
        this.grid = this.game.grid;
        this.setState({grid: this.grid});
        this.pieceInterval = setInterval( () => {
            this.grid = this.game.advanceGame();
            if (this.game.gameOver) {
                clearInterval(this.pieceInterval);
                this.setState({ playing: false });
                console.log('end of game');
            }
            this.setState({ grid: this.grid });
            if (this.game.level !== this.level){
                this.level = this.game.level;
                this.nextLevel();
            }
        }, 1150 - (this.game.level)*100);
    }

    nextLevel() {
        clearInterval(this.pieceInterval);
        this.pieceInterval = setInterval(() => {
            if (this.game.level !== this.level) {
                this.level = this.game.level;
                this.nextLevel();
            }
            this.grid = this.game.advanceGame();
            if (this.game.gameOver){
                clearInterval(this.pieceInterval);
                this.setState({playing: false});
                console.log('end of game');
            }
            this.setState({ grid: this.grid });
        }, 1150 - (this.game.level) * 100);
    }

    handleInput(e) {
        if (!this.game.gameOver){
            if (e.keyCode === 32) {
                this.grid = this.game.dropPiece();
            }
            if (e.keyCode === 87 || e.keyCode === 38) {
                this.grid = this.game.rotateLeft();
            }
            else if (e.keyCode === 65 || e.keyCode === 37) {
                this.grid = this.game.moveLeft(); 
            }
            else if (e.keyCode === 83 || e.keyCode === 40) {
                this.grid = this.game.moveDown();
            }
            else if (e.keyCode === 68 || e.keyCode === 39) {
                this.grid = this.game.moveRight();
            }
            this.setState({ grid: this.grid });
        }
    }

    startButton(){
        return (
            <button onClick={this.startGame}>Start Game</button>
        );
    }

    render() {
        return (
            <div onKeyDown={this.handleInput} tabIndex="0" className="game_box">
                
                    <div className="play_area">
                        {
                            this.state.grid.map( (row, rIdx) => {
                                return (
                                    row.map( (cell, cIdx) => {
                                        return (
                                            <Cell key={[rIdx, cIdx]} status={cell} pos={[rIdx, cIdx]} />
                                        );
                                    })
                                );
                            })
                        }
                    </div>
                    <div>
                        {this.state.playing ? '' : this.startButton()}
                    </div>
                
            </div>
        );
    }
}

export default Tetris;