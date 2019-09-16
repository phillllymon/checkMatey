import React from 'react';
import Piece from './piece';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.grid = [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['-', '-', '-', '-', '-', '-', '-', '-'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
        ];
        this.state = {
            grid: this.grid,
            dragging: false
        }
        this.dragPiece = this.dragPiece.bind(this);
        this.beginDrag = this.beginDrag.bind(this);
        this.endDrag = this.endDrag.bind(this);
        this.displayDragPiece = this.displayDragPiece.bind(this);
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
            this.setState({dragging: true});
            this.origin = e.target.id;
            this.markToDrag = this.grid[parseInt(this.origin[0])][parseInt(this.origin[2])];
        }
    }

    endDrag(e) {
        if (this.state.dragging){
            let destination = e.target.id;
            this.grid[parseInt(destination[0])][parseInt(destination[2])] = this.markToDrag;
            this.grid[parseInt(this.origin[0])][parseInt(this.origin[2])] = '-';
            this.setState({
                grid: this.grid,
                dragging: false
            });
            this.markToDrag = null;
            this.origin = null;
        }
    }

    render() {
        return (
            <div 
                className="board"
                onMouseMove={this.dragPiece}
            >
                { this.state.dragging ? this.displayDragPiece() : ''}
                {
                    this.state.grid.map( (row, rIdx) => {
                        return (
                            row.map( (spot, cIdx) => {
                                return (
                                    <div
                                        onMouseDown={this.beginDrag}
                                        onMouseUp={this.endDrag}
                                        key={rIdx + cIdx} 
                                        id={[rIdx, cIdx]}
                                        className={ (rIdx + cIdx) % 2 === 0 ? 'w' : 'b' }
                                    >
                                        <Piece
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
        );
    }
}

export default Board;