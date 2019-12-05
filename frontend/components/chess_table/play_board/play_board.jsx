import React from 'react';
import Piece from '../piece';
import { Game } from '../chess/game';
import { getPieceIcon } from '../piece';
import { getPieceColor } from '../chess/chess_helper';

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
            popup: false,
            suggestLogin: false
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
        this.highlightSquare = null;
        this.setProgress = this.setProgress.bind(this);
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
        if (this.gameOverMessage) {
            return (
                <div className="modal_back">
                    <div style={{ 'position': 'relative' }}>
                        <div className="challenge_box">
                            <div className="challenge_box_header">
                                {this.gameOverMessage}
                        </div>
                            <center>
                                <br />
                                {this.gameOverMessage === 'Checkmate!' ? (this.game.currentPlayer === 'white' ? 'Black' : 'White') + ' wins!' : 'The game ends in stalemate.'}
                            <br />
                                <br />
                                <button onClick={this.resetGame} className="time_button" >New Game</button>
                                <button onClick={this.props.backToHome} className="time_button" >Leave Board</button>
                                <br />
                                <br />
                            </center>
                        </div>
                    </div>
                </div>
            );
        }
        return (
            <div className="modal_back">
                <div style={{ 'position': 'relative' }}>
                    <div className="challenge_box">
                        <div className="challenge_box_header">
                            Game in progress!
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

    showSuggestion() {
        if (this.state.suggestLogin) {
            return (
                <div 
                    className="suggest_login"
                >
                    <div 
                        className="dismiss_circle"
                        onClick={() => this.setState({suggestLogin: false})}
                    >
                        X
                    </div>
                    Ready to see more of CheckMatey?
                        <button
                        className="board_control_button"
                        style={{
                            'backgroundColor': 'orange',
                            'color': 'white'
                        }}
                        onClick={() => {
                            this.props.setTour(1);
                            this.props.login({ username: 'DemoUser', password: '123456', demo: true });
                        }}
                    >
                        Demo Login
                        </button>
                </div>
            );
        }
        else {
            return '';
        }
    }

    showHint() {
        if (this.props.hints) {
            let picId = '';
            if (this.state.hint === 'In Pawn Clash, the pawns begin on the 4th and 5th ranks.') {
                picId = "pawn_clash_diagram";
            }
            else if (this.state.hint === 'In Chess960, your capital pieces start in a random order.') {
                picId = "chess_960_diagram";
            }
            return (
                <div className="hint">
                    <div
                        className="dismiss_circle"
                        style={{
                            'display': this.state.hint === 'Check!' ? 'flex' : 'none',
                            'position': 'absolute',
                            'left': '10px',
                            'top': '10px'
                        }}
                        onClick={() => this.setState({ hint: false })}
                    >
                        X
                    </div>
                    <div id={picId}>
                    </div>
                    {this.state.hint}
                </div>
            );
        }
        return '';
    }

    setHint(newHint, hintKey = 0) {
        if (hintKey === 0) {
            this.setState({ hint: newHint });
        }
        else {
            switch (hintKey) {
                case 1:
                    this.setState({ hint: 'Select Standard Chess'});
                    break;
                case 2:
                    this.setState({ hint: 'In Chess960, your capital pieces start in a random order.' });
                    break;
                case 3:
                    this.setState({ hint: 'In Pawn Clash, the pawns begin on the 4th and 5th ranks.' });
                    break;
                case 4:
                    this.setState({ hint: 'Check!'});
                    break;
                default:
                    break;
            }
        }
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
        if (this.game.currentPlayer === this.compColor) {
            this.takeComputerTurn();
        }
        this.setState({});
    }

    resetGame() {
        this.highlightSquare = null;
        let level = this.game.level;
        this.game = new Game(this.typeSetting);
        this.game.level = level;
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
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
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

    setProgress(newVal) {
        this.setState({progress: newVal});
    }

    takeComputerTurn(){
        if (!this.game.isGameOver()){
            this.setState({ progress: true });
            setTimeout(() => {
                document.body.style.cursor = 'wait';
                this.grid = this.game.makeAIMove(this.setProgress);
                setTimeout(() => {
                    this.setState({progress: false});
                }, 100);
                document.body.style.cursor = 'default';
                this.highlightSquare = this.game.AIMove[1];
                this.currentPlayer = this.game.currentPlayer;
                if (this.game.inCheck && !this.game.isGameOver()) {
                    this.setHint('', 4);
                }
                this.setState({
                    grid: this.grid
                });
                if (this.game.isGameOver()) {
                    this.gameOverMessage = this.game.gameOverMessage;
                    this.setState({ popup: true });
                }
            }, (this.game.level > 2 ? 100 : Math.random() * 500 + 500));
        }
        if (this.game.isGameOver()) {
            this.gameOverMessage = this.game.gameOverMessage;
            this.setState({ popup: true });
        }
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
            if (getPieceColor(this.grid[parseInt(this.origin[0])][parseInt(this.origin[2])]) 
                === (this.currentPlayer === 'white' ? 'black' : 'white')) {
                this.setHint("You're playing " + this.playerColor + "!");
                setTimeout(() => {
                    this.setState({ hint: false });
                }, 3000);
            }
            if (destination !== this.origin && this.game.isMoveLegal(move, this.currentPlayer) && this.game.level === 0) {
                this.game.makeMove(move);
                this.highlightSquare = move[1];
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
                this.highlightSquare = move[1];
                if (this.game.moves.length > 4 && !this.alreadyAsked && !this.props.userId) {
                    this.setState({suggestLogin: true});
                    this.alreadyAsked = true;
                }
                this.started = true;
                this.currentPlayer = this.game.currentPlayer;   //pawn promotion has to replicate from here
                this.grid = this.game.grid;
                this.setState({
                    grid: this.grid,
                    dragging: false,
                    hint: false
                });
                this.markToDrag = null;
                this.origin = null;
                this.takeComputerTurn(); /////COMPUTER TURN 
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
        let highlightSquare = this.highlightSquare;
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
                                {this.gameButton()}
                        </div>
                    </div>
                        {
                            this.state.suggestLogin ? this.showSuggestion() : this.game.gameTypes.map((gameType, idx) => {
                                return (
                                    <button className={this.typeSetting === gameType ? "current_type_button" : "type_button"}
                                        onClick={() => this.setType(gameType)}
                                        onMouseEnter={() => { this.setHint('', idx + 1) }}
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
                                        onMouseEnter={() => { this.setHint(level === 0 ? "Set computer level (Level 0 means you play both sides)" : level === 3 ? 
                                        'Important Note: Computer turn may take up to a minute!': 'Higher number means harder computer') }}
                                        onMouseLeave={() => { this.setHint(false) }}
                                    key={level}>{level}</button>
                                    
                                );
                            })
                        }
                        </div>
                        <div>
                            {this.game.level > 0 ? (this.game.level > 1 ? this.game.level > 2 ? 'Play against hard AI' : 'Play against medium AI' : 'Play against easy AI') : 'You play both sides'}
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
                            <div>{this.state.progress ? 'thinking...' : 'Computer'} <br/>{this.state.progress ? '' : 'plays ' + this.compColor}</div>
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
                            <div>You <br/>play {this.playerColor}</div>
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
                            <div style={{ 'height': `${movesHeight > 0 ? movesHeight : 0}px` }} className="moves_list">
                            {
                                movesHeight > 0 ? this.game.moves.map((move, idx) => {
                                    return (
                                        <div className={idx % 2 === 0 ? "inactive_move_light not" : "inactive_move_dark not"} key={idx}>
                                            {move}
                                        </div>
                                    );
                                }) : ''
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