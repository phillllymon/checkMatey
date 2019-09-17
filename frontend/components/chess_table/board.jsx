import React from 'react';
import Piece from './piece';
import { makeSnapshot, getLastMove, getCoords } from '../../util/chess_util';

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
            flipped: this.flipped
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

    startRecording(e) {
        this.recording = true;
        this.seq = [makeSnapshot(this.grid)];
        this.moves = ['sequence beginning'];
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

    recordButton() {
        if (this.recording) {
            return (
                <button onClick={this.stopRecording}>Stop Recording</button>
            );
        }
        else {
            return (
                <button onClick={this.startRecording}>Record Sequence</button>
            );
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
                    <div className="controls_heading">
                        <i className="fas fa-chess-board"></i>
                        <div style={{ 'marginLeft': '10px' }}>
                            Sandbox
                            </div>
                    </div>
                    <button onClick={this.resetBoard}>Reset Board</button>
                    <button onClick={this.flipBoard}>Flip Board</button>
                    {this.recordButton()}
                    <div style={{'fontSize': '15px'}}>
                        {
                            this.moves.map((snapshot, idx) => {
                                return (
                                    <div key={idx}>
                                        {snapshot}
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        ); 
    }
}

export default Board;