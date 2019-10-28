import React from 'react';
import Game from './game';
import CellMobile from './cell_mobile';

class TetrisMobile extends React.Component {
    constructor(props) {
        super(props);
        this.game = new Game;
        this.grid = this.game.grid;
        this.piecePos = [2, 4];
        this.state = {
            grid: this.game.grid,
            nextGrid: this.game.nextGrid,
            level: 1, 
            enteredName: '',
            fullScreen: false
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
        this.fullScreen = this.fullScreen.bind(this);

        
    }

    componentWillUnmount() {
        clearInterval(this.pieceInterval);
    }

    togglePreview(e) {
        e.target.blur();
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
    }

    startGame(e) {
        this.setState({playing: true});
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

    handleControls(input) {
        if (!this.game.gameOver) {
            if (input === 'drop') {
                this.grid = this.game.dropPiece();
            }
            if (input === 'rotate') {
                this.grid = this.game.rotateLeft();
            }
            else if (input === 'left') {
                this.grid = this.game.moveLeft();
            }
            else if (input === 'down') {
                this.grid = this.game.moveDown();
            }
            else if (input === 'right') {
                this.grid = this.game.moveRight();
            }
            this.setState({ grid: this.grid });
        }
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
            <button className="start_button_mobile" onClick={this.startGame}>Start Game</button>
        );
    }

    fullScreen(e) {
        const theGame = document.getElementById("full");
        if (theGame.requestFullscreen){
            theGame.requestFullscreen();
        }
        else if (theGame.mozRequestFullScreen) {
            theGame.mozRequestFullScreen();
        }
        else if (theGame.webkitRequestFullscreen) {
            theGame.webkitRequestFullscreen();
        }
        else if (theGame.msRequestFullscreen) {
            theGame.msRequestFullscreen();
        }
        this.setState({fullScreen: true});
    }

    componentDidMount() {
        this.getHighScore();
        const theGame = document.getElementById("full");
        const playArea = document.getElementById("play");
        this.playHeight = playArea.offsetHeight;
        this.totalHeight = window.innerHeight;
        this.controlsHeight = this.totalHeight - this.playHeight;
        //this.fullScreen();
    }

    render() {
        return (
            
                <div 
                    onClick={this.fullScreen} 
                    id="full" 
                    className="full_screen"
                    onKeyDown={this.handleInput} tabIndex="0"
                > 
                
                    {this.promptName ? this.askForName() : ''}
                
                
                    <div className="play_area_mobile" id="play">
                        {
                            this.state.grid.map( (row, rIdx) => {
                                return (
                                    row.map( (cell, cIdx) => {
                                        return (
                                            <CellMobile key={[rIdx, cIdx]} status={cell} pos={[rIdx, cIdx]} />
                                        );
                                    })
                                );
                            })
                        }
                    </div>
                    <div className="side_mobile">
                        <div className="tetris_stats_mobile preview_box">
                            <center>
                                Next:
                            <div className="display_preview_mobile">
                                {this.game.preview ? this.state.nextGrid.map((row, rIdx) => {
                                    return (
                                        row.map((cell, cIdx) => {
                                            return <CellMobile key={[rIdx, cIdx]} status={cell} />
                                        })
                                    );

                                }) : ''
                                }
                            </div>
                            </center>
                                <button className={this.game.preview ? "toggle_button_mobile button_on_mobile" : "toggle_button_mobile"}
                                    onClick={this.togglePreview}><i className="fas fa-circle"></i></button>
                                {this.game.preview ? 'on' : 'off'}
                        </div>
                        <div className="tetris_stats_mobile">
                            <center>
                                Score:
                            <br />
                                {this.game.score}
                                <br />
                                Level: {this.game.level}
                                <br />
                                Lines: {this.game.lines}
                            </center>
                        </div>
                        <div className="tetris_stats_mobile">
                            <center>
                                Record: 
                                <br />
                                {this.highScore}
                            <div className="smaller_text_mobile">{this.leader}<br/>{this.highTime.slice(0, 10)}</div>
                            </center>
                        </div>
                        <button
                        onTouchStart={() => this.handleControls('down')}
                        style={{
                            'width': '100%',
                            'height': '28vw'
                        }}
                        className="tetris_control_button">
                        <i className="fas fa-arrow-down"></i>
                        </button>
                        <button
                        onTouchStart={() => this.handleControls('drop')}
                        style={{
                            'width': '100%',
                            'height': '28vw'
                        }}
                        className="tetris_control_button">
                        <i className="fas fa-download"></i>
                        </button>
                    </div>
                    <div id="controls" style={{
                            'height': '25vh',
                            'width': '100%',
                            'backgroundColor': 'green',
                            'display': 'flex'
                        }}>
                        <button
                        onTouchStart={() => this.handleControls('left')}
                        style={{
                            'width': '100%',
                            
                        }}
                        className="tetris_control_button">
                        <i className="fas fa-arrow-left"></i><br /><br /><br />
                        </button>
                        <button
                        onTouchStart={(e) => {
                            e.preventDefault();
                            this.handleControls('rotate')
                        }}
                        style={{
                            'width': '100%',
                            
                        }}
                        className="tetris_control_button">
                        <i className="fas fa-undo"></i><br /><br /><br />
                        </button>
                        <button
                        onTouchStart={(e) => this.handleControls('right')}
                        style={{
                            'width': '100%',
                            
                        }}
                        className="tetris_control_button">
                        <i className="fas fa-arrow-right"></i><br/><br/><br/>
                        </button>
                    </div>
                    
                    
                    
                    
                    {this.state.playing ? '' : this.startButton()}
                </div>
           
            
        );
    }
}

export default TetrisMobile;