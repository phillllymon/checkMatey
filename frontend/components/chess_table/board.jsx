import React from 'react';
import Piece from './piece';
import { makeSnapshot, getLastMove, seqToString } from '../../util/chess_util';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.grid = this.startPosition();
        this.flipped = false;
        this.recording = false;
        this.seq = [];
        this.moves = [];
        this.state = {
            grid: this.grid,
            dragging: false,
            flipped: this.flipped,
            description: '',
            title: '',
            hint: false
        }
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
        this.resetBoard = this.resetBoard.bind(this);
        this.flipBoard = this.flipBoard.bind(this);
        this.startRecording = this.startRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);
        this.recordButton = this.recordButton.bind(this);
        this.postSequence = this.postSequence.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.abortDrag = this.abortDrag.bind(this);
        this.showHint = this.showHint.bind(this);
        this.setHint = this.setHint.bind(this);
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

    componentDidMount() {
        this.setHint("This board is for experimenting. No chess rules apply.");
        setTimeout( () => {
            if (this.mounted) this.setState({hint: false});
        }, 2500);
        this.mounted = true;
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    startPosition() {
        return [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
        ];
    }

    handleDescription(e) {
        this.setState({description: e.target.value});
    }

    handleTitle(e) {
        this.setState({title: e.target.value});
    }

    postSequence(e) {
        if (this.seq.length > 0 && this.state.description.length > 0 && this.state.title.length > 0) {
            let content = seqToString(this.seq, this.state.description, this.state.title);
            this.props.postSeq({content: content, post_type: "sequence"});
            this.props.history.push('/home');
        }
    }

    startRecording(e) {
        this.recording = true;
        this.seq = [makeSnapshot(this.grid)];
        this.moves = ['start'];
        this.setState({});
    }

    stopRecording(e) {
        this.recording = false;
        this.setState({});
    }

    flipBoard(e) {
        this.flipped = this.flipped ? false : true;
        this.setState({ flipped: this.flipped });
    }

    resetBoard(e) {
        this.grid = this.startPosition();
        this.setState({ grid: this.grid });
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
            this.setState({dragY: e.clientY, dragX: e.clientX});
        }
    }

    beginDrag(e) {
        if (e.target.className.includes('fa-chess')){
            this.setState({ dragging: true, dragY: e.clientY, dragX: e.clientX});
            this.origin = e.target.id;
            this.markToDrag = this.state.grid[parseInt(this.origin[0])][parseInt(this.origin[2])];
        }
    }

    endDrag(e) {
        if (this.state.dragging){
            let destination = e.target.id;
            if (destination !== this.origin) {
                this.grid[parseInt(destination[0])][parseInt(destination[2])] = this.markToDrag;
                this.grid[parseInt(this.origin[0])][parseInt(this.origin[2])] = '-';
                if (this.recording) {
                    this.seq.push(makeSnapshot(this.grid));
                    this.moves.push(getLastMove(this.seq));
                }
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

    recordButton() {
        if (this.recording) {
            return (
                <div className="record_controls">
                    <div className="record_button" 
                    onClick={this.stopRecording}><i className="fas fa-stop-circle"></i> Stop Recording....</div>
                </div>
            );
        }
        else {
            return (
                <div className="record_controls">
                    <div className="record_button" 
                        onMouseEnter={() => { this.setHint("When you're ready, start recording your moves") }}
                        onMouseLeave={() => { this.setHint(false) }}
                    onClick={this.startRecording}><i style={{'color': 'red'}} className="far fa-dot-circle"></i> Record Sequence</div>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="chess_table">
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
                        <i className="fas fa-chess-board"></i>
                        <div style={{ 'marginLeft': '10px' }}>
                            Sandbox
                            </div>
                    </div>
                        <button 
                            onMouseEnter={() => { this.setHint("Flip Board") }}
                            onMouseLeave={() => { this.setHint(false) }}
                        className={"board_control_button"} onClick={this.flipBoard}><i className="fas fa-retweet"></i> Flip</button>
                        <button 
                            onMouseEnter={() => { this.setHint("Reset Pieces") }}
                            onMouseLeave={() => { this.setHint(false) }}
                        className={"board_control_button"} onClick={this.resetBoard}><i className="fas fa-chess"></i> Reset</button>
                        Sequence Title:
                    <input
                            className="title_field"
                            value={this.state.title}
                            onChange={this.handleTitle}
                            onMouseEnter={() => { this.setHint("Give your sequence a name") }}
                            onMouseLeave={() => { this.setHint(false) }}
                        />
                        Description:
                    <textarea
                            className="title_field"
                            value={this.state.description}
                            onChange={this.handleDescription}
                            onMouseEnter={() => { this.setHint("Describe your sequence") }}
                            onMouseLeave={() => { this.setHint(false) }}
                        ></textarea>
                        
                        <button
                            className={this.seq.length > 0 &&
                                this.state.description.length > 0 && this.state.title.length ?
                                "seq_active_button" : "seq_post_button"}
                            onMouseEnter={() => { this.setHint("Give your recorded sequence a name and description to post it") }}
                            onMouseLeave={() => { this.setHint(false) }}
                            onClick={this.postSequence}>
                            Post Sequence
                        </button>

                    <div className="outer_list">
                        {this.recordButton()}
                        
                        <div className="moves_list" style={{'fontSize': '15px'}}>
                            {
                                this.moves.map((snapshot, idx) => {
                                    return (
                                        <div className={idx % 2 === 0 ? "inactive_move_light not" : "inactive_move_dark not"} key={idx}>
                                            {snapshot}
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

export default Board;