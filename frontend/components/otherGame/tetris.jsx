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
            nextGrid: this.game.nextGrid,
            level: 1, 
            enteredName: ''
        };
        this.interval = 1000;
        this.handleInput = this.handleInput.bind(this);
        this.startGame = this.startGame.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
        this.startButton = this.startButton.bind(this);
        this.highScore = 0;
        this.leader = 'no one';
        this.highTime = '';
        this.getHighScore = this.getHighScore.bind(this);
        this.endTheGame = this.endTheGame.bind(this);
        this.askForName = this.askForName.bind(this);
        this.saveScore = this.saveScore.bind(this);
        this.handleEnterName = this.handleEnterName.bind(this);
        this.togglePreview = this.togglePreview.bind(this);
    }

    componentDidMount() {
        this.getHighScore();
        this.startGame();
    }

    componentWillUnmount() {
        clearInterval(this.pieceInterval);
    }

    togglePreview(e) {
        e.target.blur();
        document.getElementById("the_game").focus();
        this.game.preview = this.game.preview ? false : true;
        this.setState({});
    }

    handleEnterName(e) {
        this.setState({enteredName: e.target.value})
    }

    askForName() {
        return (
            <div className="enter_name tetris_stats">
                <center>
                    <br/>
                New Highscore!
                <br/>
                <br/>
                
                <form onSubmit={this.saveScore}>
                    <input
                        type="text"
                        placeholder="enter your name"
                        value={this.state.enteredName}
                        onChange={this.handleEnterName}
                    />
                    <br/>
                    <input className="tetris_button" type="submit" value="Save Highscore"/>
                    <br/>
                    <br/>
                </form>
                </center>
            </div>
        );
    }

    getHighScore() {
        $.ajax({
            url: `/api/scores`,
            method: 'GET'
        }).then((res) => {
            this.highScore = res.score;
            this.leader = res.name;
            this.highTime = res.updated_at;
            this.setState({});
        });
    }

    saveScore(e) {
        e.preventDefault();
        this.promptName = false;
        $.ajax({
            url: `/api/scores`,
            method: 'POST',
            data: { score: { name: this.state.enteredName, score: this.game.score } }
        }).then((res) => {
            this.getHighScore();
        });
    }

    endTheGame() {
        if (this.game.score > this.highScore){
            this.promptName = true;
            this.setState({});
        }
        else {
            document.getElementById("start_button").focus();
        }
    }

    startGame(e) {
        this.setState({playing: true});
        document.getElementById("the_game").focus();
        this.game = new Game(this.game.preview, this.game.nextPiece);
        this.game.start();
        this.level = this.game.level;
        this.grid = this.game.grid;
        this.setState({grid: this.grid, nextGrid: this.game.nextGrid});
        this.pieceInterval = setInterval( () => {
            this.grid = this.game.advanceGame();
            if (this.game.gameOver) {
                clearInterval(this.pieceInterval);
                this.setState({ playing: false });
                this.endTheGame();
            }
            this.setState({ grid: this.grid, nextGrid: this.game.nextGrid });
            if (this.game.level !== this.level){
                this.level = this.game.level;
                this.nextLevel();
            }
        }, 1000);
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
                this.endTheGame();
            }
            this.setState({ grid: this.grid, nextGrid: this.game.nextGrid });
        }, Math.ceil(1000 / this.game.level));
        this.interval = Math.ceil(1000/this.game.level);
    }

    handleInput(e) {
        if (this.state.playing){
            e.preventDefault();
        }
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
            <button id="start_button" className="tetris_button" onClick={this.startGame}>New Game</button>
        );
    }

    describeControls(){
        return (
            <div className="tetris_stats" >
                <div className="smaller_text">
                <center>
                    Controls:
                    
                    <br/>
                    -WASD or arrow keys
                    <br/>
                    -SPACE BAR to drop
                    <br/>
                    
                </center>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div onKeyDown={this.handleInput} tabIndex="0" id="the_game" className="game_box">
                {this.promptName ? this.askForName() : ''}
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
                <div className="tetris_stats preview_box">
                    <div className="display_preview">
                        {this.game.preview ? this.state.nextGrid.map((row, rIdx) => {
                            return (
                                row.map((cell, cIdx) => {
                                    return <Cell key={[rIdx, cIdx]} status={cell} />
                                })
                            );

                        }) : ''
                        }
                    </div>
                    <center>
                    Next:
                    <br/>
                    <button className={this.game.preview ? "toggle_button button_on" : "toggle_button"}
                        onClick={this.togglePreview}><i className="fas fa-circle"></i></button>
                        {this.game.preview ? 'on ' : 'off'}
                    <br/>
                    <div className="smaller_text">
                        {this.game.preview ? '(half points)' : ''}
                    </div>
                    </center>
                </div>
                <div className="tetris_stats">
                    <center>
                    Leader: {this.leader}
                    <br />
                    Highscore: {this.highScore}
                    <br />
                    <div className="smaller_text">{this.highTime.slice(0, 10)}</div>
                    </center>
                </div>
                <div className="tetris_stats">
                    <center>
                    Score: 
                    <br/>
                    {this.game.score}
                    <br />
                    Level: {this.game.level}
                    <br />
                    Lines: {this.game.lines}
                    <div className="smaller_text">interval: {this.interval}</div>
                    </center>
                </div>
                    
                    {this.state.playing ? this.describeControls() : this.startButton()}
                
            </div>
        );
    }
}

export default Tetris;