import React from 'react';
import Piece from '../piece';
import { 
    makeSnapshot, 
    getLastMove, 
    stringToSeq, 
    seqToSnapshots,
    snapshotToGrid,
    getChessMoves
} from '../../../util/chess_util';

class ShowBoard extends React.Component {
    constructor(props) {
        super(props);
        this.flipped = false;
        this.snapshots = seqToSnapshots(stringToSeq(this.props.seq.content));
        this.posNum = 0;
        this.moves = getChessMoves(this.snapshots);
        this.grid = snapshotToGrid(this.snapshots[this.posNum]);
        this.state = {
            grid: this.grid,
            dragging: false,
            flipped: this.flipped,
            description: ''
        }
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
        this.flipBoard = this.flipBoard.bind(this);
        this.showNextMove = this.showNextMove.bind(this);
        this.showPrevMove = this.showPrevMove.bind(this);
        this.showFirstMove = this.showFirstMove.bind(this);
        this.showLastMove = this.showLastMove.bind(this);
        this.showMoveNumber = this.showMoveNumber.bind(this);
        this.getMoveList = this.getMoveList.bind(this);
        this.abortDrag = this.abortDrag.bind(this);
    }

    showMoveNumber(num) {
        this.posNum = num;
        this.grid = snapshotToGrid(this.snapshots[this.posNum]);
        this.setState({ grid: this.grid });
    }

    getMoveList() {
        return (
            <div>
                hello
            </div>
        );
    }

    showNextMove(e) {
        if (this.posNum < this.snapshots.length - 1){
            this.posNum++;
            this.grid = snapshotToGrid(this.snapshots[this.posNum]);
            this.setState({grid: this.grid});
        }
    }

    showPrevMove(e) {
        if (this.posNum > 0){
            this.posNum--;
            this.grid = snapshotToGrid(this.snapshots[this.posNum]);
            this.setState({ grid: this.grid });
        }
    }

    showFirstMove(e) {
        this.posNum = 0;
        this.grid = snapshotToGrid(this.snapshots[this.posNum]);
        this.setState({ grid: this.grid });
    }

    showLastMove(e) {
        this.posNum = this.snapshots.length - 1;
        this.grid = snapshotToGrid(this.snapshots[this.posNum]);
        this.setState({ grid: this.grid });
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

    endDrag(e) {
        if (this.state.dragging) {
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
                        <i className="fas fa-external-link-square-alt"></i>
                        <div style={{ 'marginLeft': '10px' }}>
                            Moves
                            </div>
                    </div>
                    
                    <button className={"board_control_button"} onClick={this.flipBoard}><i className="fas fa-retweet"></i> Flip</button>
                    <br/>
                    <div className="record_controls">
                            <div className="record_button" onClick={this.showFirstMove}> <i className="fas fa-step-backward"></i> </div>
                            <div className="record_button" onClick={this.showPrevMove}><i className="fas fa-chevron-left"></i>Prev </div>
                            
                            <div className="record_button" onClick={this.showNextMove}> Next<i className="fas fa-chevron-right"></i></div>
                            <div className="record_button" onClick={this.showLastMove}> <i className="fas fa-step-forward"></i> </div>
                    </div>
                    
                    <div className="outer_list">
                        <div className="moves_list" style={{ 'fontSize': '15px' }}>
                            {
                                this.moves.map((move, idx) => {
                                    if (this.posNum === idx) {
                                        return (
                                            <div onClick={() => this.showMoveNumber(idx)} className="active_move" key={idx}>
                                                {move}
                                            </div>
                                        );
                                    }
                                    return (
                                        <div onClick={() => this.showMoveNumber(idx)} className={idx % 2 === 0 ? "inactive_move_light" : "inactive_move_dark"} key={idx}>
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

export default ShowBoard;