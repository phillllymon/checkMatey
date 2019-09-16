import React from 'react';

const Piece = (props) => {
    switch (props.mark) {
        case '-':
            return (
                <div className="black_piece">
                    <i id={props.pos}></i>
                </div>
            );
        case 'R':
            return(
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-rook"></i>
                </div>
            );
        case 'N':
            return (
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-knight"></i>
                </div>
            );
        case 'B':
            return (
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-bishop"></i>
                </div>
            );
        case 'Q':
            return (
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-queen"></i>
                </div>
            );
        case 'K':
            return (
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-king"></i>
                </div>
            );
        case 'P':
            return (
                <div className="black_piece">
                    <i id={props.pos} className="fas fa-chess-pawn"></i>
                </div>
            );
        case 'p':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-pawn"></i>
                </div>
            );
        case 'r':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-rook"></i>
                </div>
            );
        case 'n':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-knight"></i>
                </div>
            );
        case 'b':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-bishop"></i>
                </div>
            );
        case 'q':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-queen"></i>
                </div>
            );
        case 'k':
            return (
                <div className="white_piece">
                    <i id={props.pos} className="fas fa-chess-king"></i>
                </div>
            );
    }
}

export default Piece;