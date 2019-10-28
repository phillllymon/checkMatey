import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';
import { getPieceIcon } from '../piece';

class PlayBoard extends React.Component {
    constructor(props) {
        super(props);
        this.flipped = false;
        this.game = new Game('960');
        this.grid = this.game.grid;
        this.state = {
            grid: this.grid,
            dragging: false,
            flipped: this.flipped,
            hint: false,
            popup: false
        }
        this.started = false;
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
        this.showHint = this.showHint.bind(this);
        this.setHint = this.setHint.bind(this);
        this.switchSides = this.switchSides.bind(this);
        this.popupWindow = this.popupWindow.bind(this);
        this.getBlackPoints = this.getBlackPoints.bind(this);
        this.getWhitePoints = this.getWhitePoints.bind(this);
    }

    getBlackPoints() {
        if (this.game.points[0] > this.game.points[1]) {
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

    popupWindow() {
        return (
            <div className="modal_back">
                <div style={{ 'position': 'relative' }}>
                    <div className="challenge_box">
                        <div className="challenge_box_header">
                            Game in progress
                        </div>
                        <center>
                            <br/>
                            Abandon current game?
                            <br/>
                            <br/>
                            <button onClick={this.resetGame} className="time_button" >Yes, start new game</button>
                            <button onClick={() => {this.setState({popup: false})}} className="time_button" >No, keep playing</button>
                            <br/>
                            <br/>
                        </center>
                    </div>
                </div>
            </div>
        );
    }

    showHint() {
        if (this.props.hints) {
            return (
                <div className="hint">
                    <i className="fas fa-question-circle"></i> {this.state.hint}
                </div>
            );
        }
        return '';
    }

    setHint(newHint) {
        this.setState({ hint: newHint });
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
        if (!this.started){
            this.resetGame();
            this.setState({});
        }
        else {
            this.setState({ popup: true });
        }
    }

    setLevel(level) {
        this.game.level = level;
        this.setState({});
    }

    resetGame() {
        this.game = new Game(this.typeSetting);
        this.grid = this.game.grid;
        this.setState({
            popup: false,
            grid: this.grid
        });
        this.startGame();
    }

    startGame(e) {
        this.started = false;
        this.game.start();
        this.currentPlayer = this.game.currentPlayer;
        this.setState({});
        if (this.currentPlayer === this.compColor){
            this.takeComputerTurn();
        }
    }

    componentDidMount() {
        this.startGame();
    }

    switchSides(e) {
        this.flipped = this.flipped ? false : true;
        this.playerColor = this.playerColor === 'white' ? 'black' : 'white';
        this.compColor = this.playerColor === 'white' ? 'black' : 'white';
        this.setState({ flipped: this.flipped });
        if (this.currentPlayer === this.compColor) {
            this.takeComputerTurn();
        }
    }

    flipBoard(e) {
        this.flipped = this.flipped ? false : true;
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
        setTimeout( () => {
            this.grid = this.game.makeAIMove();
            this.currentPlayer = this.game.currentPlayer;
            this.setState({
                grid: this.grid
            });
        }, Math.random() * 500 + 500);
    }

    endDrag(e) {
        if (this.state.dragging) {
            if (!this.game.playing){
                this.setHint("Click 'Start Game' to being playing")
                setTimeout( () => {
                    this.setState({hint: false});
                }, 1000);
            }
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
                this.started = true;
                this.currentPlayer = this.game.currentPlayer;   //pawn promotion has to replicate from here
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false
                });
                this.markToDrag = null;
                this.origin = null;
                /////COMPUTER TURN BELOW ///////
                this.takeComputerTurn();
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
                <button className={"board_control_button"} style={{ 'height': '35px', 'padding': '5px' }} onClick={this.resetGame}> Restart Game</button>
            );
        }
        else {
            return (
                <button 
                    className={"board_control_button"} 
                    onClick={this.startGame}
                    onMouseEnter={() => { this.setHint('Begin Playing') }}
                    onMouseLeave={() => { this.setHint(false) }}
                > Start Game</button>
            );
        }
    }

    render() {
        let controlsHeight = (0.6 * window.innerWidth < 0.9 * window.innerHeight ?
            0.6 * window.innerWidth :
            0.9 * window.innerHeight);
        let movesHeight = controlsHeight - 495;
        return (
            <div className="chess_table">
                {this.state.popup ? this.popupWindow() : ''}
                {this.state.hint ? this.showHint() : ''}
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
                                {this.gameButton()}
                        </div>
                    </div>
                        {
                            this.game.gameTypes.map((gameType) => {
                                return (
                                    <button className={this.typeSetting === gameType ? "current_type_button" : "type_button"}
                                        onClick={() => this.setType(gameType)}
                                        onMouseEnter={() => { this.setHint("Set the type of game you'd like to play") }}
                                        onMouseLeave={() => { this.setHint(false) }}
                                        key={gameType}>{gameType}</button>

                                );
                            })
                        }
                    <br/>
                    
                    
                        <div className="controls_heading">
                            <div style={{ 'marginLeft': '10px' }}>
                                Level:
                            </div>
                        
                        {
                            this.game.levels.map( (level) => {
                                return (
                                    <button className={this.game.level === level ? "current_level_button" : "level_button"}
                                    onClick={() => this.setLevel(level)} 
                                        onMouseEnter={() => { this.setHint("Set computer level (level 0 means you play both sides)") }}
                                        onMouseLeave={() => { this.setHint(false) }}
                                    key={level}>{level}</button>
                                    
                                );
                            })
                        }
                        </div>
                        <div>
                            {this.game.level > 0 ? 'Play against AI' : 'You play both sides'}
                        </div>
                    <div className="captured_pieces" style={{ 'color': this.compColor }}>
                        {
                            this.game.capturedPieces[(this.playerColor === 'black' ? 1 : 0)].map((mark, idx) => {
                                return (
                                    <span key={idx}>{getPieceIcon(mark)}</span>
                                )
                            })
                        }
                        {this.compColor === 'black' ? this.getBlackPoints() : this.getWhitePoints()}
                    </div>
                    <div className="colors"> 
                        <div 
                            className={this.game.playing && this.currentPlayer === this.compColor ? "active_player" : ""}  
                            style={{ 'color': this.compColor }} 
                        >
                            <i className="fas fa-robot"></i> 
                        </div>
                        <div className="controls_text" style={{ 'color': this.compColor }}>
                            <div>plays {this.compColor}</div>
                        </div>
                    </div>
                        <button
                            className="board_control_button"
                            onClick={this.switchSides}
                        >
                                <i className="fas fa-arrow-up"></i> Swap <i className="fas fa-arrow-down"></i>
                        </button>
                        
                    <div className="colors"> 
                        <div
                            className={this.game.playing && this.currentPlayer === this.playerColor ? "active_player" : ""}
                            style={{ 'color': this.playerColor }}
                        >
                            <i className="fas fa-user"></i>
                        </div>
                        <div className="controls_text" style={{'color': this.playerColor}}>
                            <div>plays {this.playerColor}</div>
                        </div>
                    </div>
                    <div className="captured_pieces" style={{ 'color': this.playerColor }}>
                        {
                            this.game.capturedPieces[(this.compColor === 'black' ? 1 : 0)].map((mark, idx) => {
                                return (
                                    <span key={idx}>{getPieceIcon(mark)}</span>
                                )
                            })
                        }
                        {this.playerColor === 'black' ? this.getBlackPoints() : this.getWhitePoints()}
                    </div>
                    
                    
                    
                    
                    
                    <div className="outer_list">
                            <div style={{ 'height': `${movesHeight}px` }} className="moves_list">
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
                    <button
                        className={"board_control_button"}
                        onClick={this.flipBoard}
                        onMouseEnter={() => { this.setHint(this.game.playing ? 'Flip Board' : 'Change which color you play') }}
                        onMouseLeave={() => { this.setHint(false) }}
                    ><i className="fas fa-retweet"></i> Flip Board</button>
                    <button
                        className="board_control_button"
                        onClick={this.props.backToHome}
                    >
                        Quit
                    </button>
                    </center>
                </div>
            </div>
        );
    }
}

export default PlayBoard;