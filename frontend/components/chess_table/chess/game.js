

import { 
    getPieceColor,
    getPieceType,
    getPieceMoves,
    getAllMoves,
    inCheck,
    canCastle
 } from './chess_helper';

export class Game {
    constructor() {
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
        this.gameSoFar = ['RNBQKBNRPPPPPPPP--------------------------------pppppppprnbqkbnr'];
        this.getString = this.getString.bind(this);
        this.makeMove = this.makeMove.bind(this);
        this.isGameOver = this.isGameOver.bind(this);
        this.isMoveLegal = this.isMoveLegal.bind(this);
        this.getAIMove = this.getAIMove.bind(this);
        this.makeAIMove = this.makeAIMove.bind(this);
        this.level = 1; ///0 is you play both players, 1 is random move, 2 is use API maybe???
        this.started = false;
        this.inCheck = false;
    }

    start() {
        this.playing = true;
        this.currentPlayer = 'white';
    }

    isGameOver() {
        return (this.inCheck && getAllMoves(this.currentPlayer, this.grid).length === 0);
    }

    makeMove(move) {
        let origin = move[0];
        let destination = move[1];
        this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
        this.grid[origin[0]][origin[1]] = '-';
        this.gameSoFar.push(this.getString());
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.inCheck = inCheck(this.currentPlayer, this.grid);
        //console.log(canCastle(this, 7));
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