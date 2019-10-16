import { getLastMove } from '../../../util/chess_util';

import { 
    getPieceColor,
    getPieceType,
    getPieceMoves,
    getAllMoves,
    inCheck,
    getBlackPoints,
    getWhitePoints
 } from './chess_helper';

export class Game {
    constructor(gameType) {
        // this.grid = [
        //     ['-', 'N', '-', '-', 'K', '-', '-', 'R'],
        //     ['P', 'P', 'P', 'P', 'P', '-', '-', '-'],
        //     ['-', '-', '-', '-', '-', '-', '-', '-'],
        //     ['-', '-', '-', '-', '-', '-', '-', '-'],
        //     ['-', '-', '-', '-', '-', 'r', '-', '-'],
        //     ['-', '-', '-', '-', '-', '-', '-', '-'],
        //     ['-', '-', '-', '-', 'p', 'p', 'p', 'p'],
        //     ['-', 'q', '-', '-', 'k', '-', '-', 'r']
        // ];
        this.gameSoFar = [];
        this.capturedPieces = [[], []]; //black pieces, white pieces
        this.getString = this.getString.bind(this);
        this.makeMove = this.makeMove.bind(this);
        this.isGameOver = this.isGameOver.bind(this);
        this.isMoveLegal = this.isMoveLegal.bind(this);
        this.getAIMove = this.getAIMove.bind(this);
        this.makeAIMove = this.makeAIMove.bind(this);
        this.gameTypes = ['Standard', 'Chess960', 'Pawn Clash'];
        this.gameType = gameType;
        this.levels = [0, 1];
        this.level = 1; ///0 is you play both players, 1 is random move, 2 is use API maybe???
        this.started = false;
        this.inCheck = false;
        this.gameOverMessage = '';
        this.handleSpecialMove = this.handleSpecialMove.bind(this);
        this.moves = [];
        this.initializeGrid = this.initializeGrid.bind(this);
        this.initializeGrid();
        this.points = [getBlackPoints(this.grid), getWhitePoints(this.grid)];
    }

    initializeGrid() {
        if (this.gameType === 'Pawn Clash'){
            this.grid = [
                ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
                ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['-', '-', '-', '-', '-', '-', '-', '-'],
                ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
            ];
        }
        else if (this.gameType === 'Chess960') {
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
            let row = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'];
            let newRow = [];
            while (row.length > 0){
                let nextIdx = Math.floor(Math.random()*(row.length));
                newRow.push(row[nextIdx]);
                row = row.slice(0, nextIdx).concat(row.slice(nextIdx + 1));
            }
            this.grid[0] = newRow;
            this.grid[7] = newRow.map( (mark) => {
                return mark.toLowerCase();
            });
        }
        else if (this.gameType instanceof Array) {
            console.log(this.gameType);
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
            this.grid[0] = this.gameType;
            this.grid[7] = this.gameType.map( (mark) => {
                return mark.toLowerCase();
            });
        }
        else {
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
        }
        // else {
        //     this.grid = [
        //         ['-', '-', '-', '-', '-', '-', '-', 'K'],
        //         ['-', '-', '-', '-', '-', '-', '-', '-'],
        //         ['-', '-', '-', '-', '-', '-', '-', '-'],
        //         ['-', '-', '-', '-', '-', '-', '-', '-'],
        //         ['-', '-', '-', '-', '-', '-', '-', '-'],
        //         ['-', '-', '-', '-', '-', '-', '-', '-'],
        //         ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        //         ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r']
        //     ];
        // }
        this.gameSoFar.push(this.getString());
    }

    start() {
        this.playing = true;
        this.currentPlayer = 'white';
        this.gameOverMessage = '';
    }

    isGameOver() {
        if (getAllMoves(this.currentPlayer, this.grid, this).length === 0) {
            if (this.inCheck) {
                this.gameOverMessage = 'Checkmate!';
            }
            else {
                this.gameOverMessage = 'Stalemate';
            }
            return true;
        }
        return false;
    }

    makeMove(move) {
        let origin = move[0];
        let destination = move[1];
        if (this.grid[destination[0]][destination[1]] !== '-'){
            if (this.currentPlayer === 'white'){
                this.capturedPieces[0].push(this.grid[destination[0]][destination[1]]);
            }
            else {
                this.capturedPieces[1].push(this.grid[destination[0]][destination[1]]);
            }
        }
        if (destination[2] === 'special'){
            this.handleSpecialMove(move);
        }
        else {
            this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
            this.grid[origin[0]][origin[1]] = '-';
            this.gameSoFar.push(this.getString());
            this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
            this.inCheck = inCheck(this.currentPlayer, this.grid);
            this.moves.push(getLastMove(this.gameSoFar));
        } 
        this.points = [getBlackPoints(this.grid), getWhitePoints(this.grid)];
    }

    handleSpecialMove(move) {
        let origin = move[0];
        let destination = move[1];
        if (move[1][3] === 'castleKing') {
            this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
            this.grid[origin[0]][origin[1]] = '-';
            let rookOrigin = [origin[0], 7];
            let rookDestination = [origin[0], 5];
            this.grid[rookDestination[0]][rookDestination[1]] = this.grid[rookOrigin[0]][rookOrigin[1]];
            this.grid[rookOrigin[0]][rookOrigin[1]] = '-';
            this.gameSoFar.push(this.getString());
            this.moves.push('0-0');
        }
        else if (move[1][3] === 'castleQueen') {
            this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
            this.grid[origin[0]][origin[1]] = '-';
            let rookOrigin = [origin[0], 0];
            let rookDestination = [origin[0], 3];
            this.grid[rookDestination[0]][rookDestination[1]] = this.grid[rookOrigin[0]][rookOrigin[1]];
            this.grid[rookOrigin[0]][rookOrigin[1]] = '-';
            this.gameSoFar.push(this.getString());
            this.moves.push('0-0-0');
        } else if (move[1][3] === 'enPassant') {
            this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
            this.grid[origin[0]][origin[1]] = '-';
            let capSpot = [origin[0], destination[1]];
            this.grid[capSpot[0]][capSpot[1]] = '-';
            this.gameSoFar.push(this.getString());
            this.moves.push(getLastMove(this.gameSoFar));
        }
        else {
            console.log('making a special move');
            this.grid[destination[0]][destination[1]] = move[1][3];
            this.grid[origin[0]][origin[1]] = '-';
            this.gameSoFar.push(this.getString());
            this.moves.push(getLastMove(this.gameSoFar));
        }
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.inCheck = inCheck(this.currentPlayer, this.grid);
    }

    isMoveLegal(move, color) {
        if (!this.playing) {
            return false;
        }
        let origin = move[0];
        let destination = move[1];
        let mark = this.grid[origin[0]][origin[1]];
        let pieceColor = getPieceColor(mark);
        if (pieceColor !== color){
            return false;
        }
        let pieceType = getPieceType(mark);
        let legalMoves = getPieceMoves(origin, pieceType, pieceColor, this.grid, this);
        let answer = false;
        legalMoves.forEach( (spot) => {
            if (destination[0] === spot[0] && destination[1] === spot[1]){
                answer = true;
                if (spot[2] === 'special'){
                    move[1] = spot;
                }
            }
        });
        return answer;
    }

    makeAIMove() {
        this.makeMove(this.getAIMove());
        return this.grid;
    }

    getAIMove() {
        let origins = [];
        this.grid.forEach( (row, rIdx) => {
            row.forEach( (mark, cIdx) => {
                if (getPieceColor(mark) === this.currentPlayer){
                    origins.push([rIdx, cIdx]);
                }
            });
        });
        let moves = [];
        origins.forEach( (origin) => {
            let mark = this.grid[origin[0]][origin[1]];
            let pieceType = getPieceType(mark);
            getPieceMoves(origin, pieceType, this.currentPlayer, this.grid, this).forEach( (destination) => {
                moves.push([origin, destination]);
            });
        });
        return moves[Math.floor(Math.random()*moves.length)];
    }

    getString() {
        let answer = '';
        this.grid.forEach( (row) => {
            answer += row.join('');
        });
        return answer;
    }

}