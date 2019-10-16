import React from 'react';

const Piece = (props) => {
    const grayedStyleBlack = {
        'color': 'rgba(0, 0, 0, 0.3)'
    };
    const grayedStyleWhite = {
        'color': 'rgba(0, 0, 0, 0.05)'
    };
    switch (props.mark) {
        case '-':
            return (
                <div className="black_piece">
                    <i id={props.pos}></i>
                </div>
            );
        case 'R':
            return(
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-rook"></i>
                </div>
            );
        case 'N':
            return (
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-knight"></i>
                </div>
            );
        case 'B':
            return (
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-bishop"></i>
                </div>
            );
        case 'Q':
            return (
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-queen"></i>
                </div>
            );
        case 'K':
            return (
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-king"></i>
                </div>
            );
        case 'P':
            return (
                <div className="black_piece" style={props.grayed ? grayedStyleBlack : {}}>
                    <i id={props.pos} className="fas fa-chess-pawn"></i>
                </div>
            );
        case 'p':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-pawn"></i>
                </div>
            );
        case 'r':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-rook"></i>
                </div>
            );
        case 'n':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-knight"></i>
                </div>
            );
        case 'b':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-bishop"></i>
                </div>
            );
        case 'q':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-queen"></i>
                </div>
            );
        case 'k':
            return (
                <div className="white_piece" style={props.grayed ? grayedStyleWhite : {}}>
                    <i id={props.pos} className="fas fa-chess-king"></i>
                </div>
            );
    }
}

export default Piece;

export const getPieceIcon = (mark) => {
    switch (mark) {
        case 'p':
            return (<i className="fas fa-chess-pawn" style={{'marginLeft': '3px'}}></i>);
        case 'r':
            return (<i className="fas fa-chess-rook" style={{ 'marginLeft': '3px' }}></i>);
        case 'n':
            return (<i className="fas fa-chess-knight" style={{ 'marginLeft': '3px' }}></i>);
        case 'b':
            return (<i className="fas fa-chess-bishop" style={{ 'marginLeft': '3px' }}></i>);
        case 'k':
            return (<i className="fas fa-chess-king" style={{ 'marginLeft': '3px' }}></i>);
        case 'q':
            return (<i className="fas fa-chess-queen" style={{ 'marginLeft': '3px' }}></i>);
        case 'P':
            return (<i className="fas fa-chess-pawn" style={{ 'marginLeft': '3px' }}></i>);
        case 'R':
            return (<i className="fas fa-chess-rook" style={{ 'marginLeft': '3px' }}></i>);
        case 'N':
            return (<i className="fas fa-chess-knight" style={{ 'marginLeft': '3px' }}></i>);
        case 'B':
            return (<i className="fas fa-chess-bishop" style={{ 'marginLeft': '3px' }}></i>);
        case 'Q':
            return (<i className="fas fa-chess-queen" style={{ 'marginLeft': '3px' }}></i>);
        case 'K':
            return (<i className="fas fa-chess-king" style={{ 'marginLeft': '3px' }}></i>);
        default:
            return null;
    }
}