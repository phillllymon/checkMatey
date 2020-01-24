import { snapshotToGrid } from '../../../util/chess_util';
import { Game } from './game';

export const makeTestGame = (oldGame) => {
    let answer = new Game('Standard');
    answer.grid = oldGame.grid.map((row) => {
        return row.map((spot) => {
            return spot;
        });
    });
    answer.moves = oldGame.moves.map((move) => {
        return move;
    });
    answer.currentPlayer = oldGame.currentPlayer;
    return answer;
};

export const getPossibleMoves = (game) => {
    let answer = [];
    let origins = [];
    game.grid.forEach((row, rIdx) => {
        row.forEach((mark, cIdx) => {
            if (getPieceColor(mark) === game.currentPlayer) {
                origins.push([rIdx, cIdx]);
            }
        });
    });
    origins.forEach((origin) => {
        let mark = game.grid[origin[0]][origin[1]];
        let pieceType = getPieceType(mark);
        getPieceMoves(origin, pieceType, game.currentPlayer, game.grid, game).forEach((destination) => {
            answer.push([origin, destination]);
        });
    });
    return answer;
};

export const getBlackPoints = (grid) => {
    const pointValues = {
        'p': 0,
        'r': 0,
        'n': 0,
        'b': 0,
        'q': 0,
        'k': 0,
        '-': 0,
        'P': 1,
        'R': 5,
        'N': 3,
        'B': 3,
        'Q': 9,
        'K': 0,
    }
    let answer = 0;
    grid.forEach( (row) => {
        row.forEach( (mark) => {
            answer += pointValues[mark];
        });
    });
    return answer;
};

export const getWhitePoints = (grid) => {
    const pointValues = {
        'p': 1,
        'r': 5,
        'n': 3,
        'b': 3,
        'q': 9,
        'k': 0,
        '-': 0,
        'P': 0,
        'R': 0,
        'N': 0,
        'B': 0,
        'Q': 0,
        'K': 0,
    }
    let answer = 0;
    grid.forEach((row) => {
        row.forEach((mark) => {
            answer += pointValues[mark];
        });
    });
    return answer;
};

export const getPieceColor = (mark) => {
    if (['P', 'R', 'B', 'K', 'Q', 'N'].includes(mark)) {
        return 'black';
    }
    else if (['p', 'r', 'b', 'k', 'q', 'n'].includes(mark)) {
        return 'white';
    }
    return 'empty';
};

export const getPieceType = (mark) => {
    if (mark === 'p' || mark === 'P'){
        return 'pawn';
    } else if (mark === 'k' || mark === 'K') {
        return 'king';
    } else if (mark === 'q' || mark === 'Q') {
        return 'queen';
    } else if (mark === 'n' || mark === 'N') {
        return 'knight';
    } else if (mark === 'b' || mark === 'B') {
        return 'bishop';
    } else if (mark === 'r' || mark === 'R') {
        return 'rook';
    }
    return 'empty';
};

export const canCastle = (game, side) => { //side is 0 or 7, for queen or kingside, respectively
    let answer = true;
    let color = game.currentPlayer;
    let kingSpace = (color === 'black' ? [0, 4] : [7, 4]);
    let rookSpace = [(color === 'black' ? 0 : 7), side];
    let kingMark = (color === 'black' ? 'K' : 'k');
    let rookMark = (color === 'black' ? 'R' : 'r');
    game.gameSoFar.forEach( (snapshot) => {
        let grid = snapshotToGrid(snapshot);
        if (grid[rookSpace[0]][rookSpace[1]] !== rookMark || grid[kingSpace[0]][kingSpace[1]] !== kingMark){
            answer = false;
        }
    });
    let checkSpots = getAllDumbMoves((color === 'black' ? 'white' : 'black'), game.grid, game);
    let castleDir = (side === 0 ? -1 : 1);
    let spots = [[ kingSpace[0], kingSpace[1] + castleDir ], [ kingSpace[0], kingSpace[1] + 2*castleDir]];
    spots.forEach( (spot) => {
        if (game.grid[spot[0]][spot[1]] !== '-'){
            answer = false;
        }
    });
    checkSpots.forEach( (checkSpot) => {
        spots.forEach( (spot) => {
            if (checkSpot[0] === spot[0] && checkSpot[1] === spot[1]) {
                answer = false;
            }
        });
    });
    if (inCheck(game.currentPlayer, game.grid, game)){
        answer = false;
    }
    return answer;
};

const findKing = (color, grid) => {
    let answer = [];
    grid.forEach((row, rIdx) => {
        row.forEach((mark, cIdx) => {
            if (getPieceType(mark) === 'king' && getPieceColor(mark) === color){
                answer = [rIdx, cIdx];
            }
        });
    });
    return answer;
};

//dumb moves means they include moving yourself into check
export const getAllDumbMoves = (color, grid) => {
    let answer = [];
    grid.forEach((row, rIdx) => {
        row.forEach((mark, cIdx) => {
            if (getPieceColor(mark) === color){
                let origin = [rIdx, cIdx];
                let pieceType = getPieceType(mark);
                answer = answer.concat(getPieceDumbMoves(origin, pieceType, color, grid));
            }
        });
    });
    return answer;
};

export const getAllMoves = (color, grid, game) => {
    let answer = [];
    grid.forEach((row, rIdx) => {
        row.forEach((mark, cIdx) => {
            if (getPieceColor(mark) === color) {
                let origin = [rIdx, cIdx];
                let pieceType = getPieceType(mark);
                answer = answer.concat(getPieceMoves(origin, pieceType, color, grid, game));
            }
        });
    });
    return answer;
}

const onBoard = (spot) => {
    if (spot[0] > 7 || spot[0] < 0){
        return false;
    }
    if (spot[1] > 7 || spot[1] < 0){
        return false;
    }
    return true;
};

export const inCheck = (color, grid, game) => {
    let kingSpot = findKing(color, grid);
    // let moves = getAllDumbMoves((color === 'white' ? 'black' : 'white'), grid, game);
    // let answer = false;
    // moves.forEach((spot) => {
    //     if (spot[0] === kingSpot[0] && spot[1] === kingSpot[1]) {
    //         answer = true;
    //     }
    // });
    // return answer;

    let diags = [
        [1, 1],
        [-1, -1],
        [-1, 1],
        [1, -1]
    ];
    for (let n = 0; n < diags.length; n++) {
        let dir = diags[n];
        let i = 1;
        while (i < 8) {
            let spot = [kingSpot[0] + (i * dir[0]), kingSpot[1] + (i * dir[1])];
            if (onBoard(spot)) {
                let mark = grid[spot[0]][spot[1]];
                if (getPieceColor(mark) === color) {
                    break;
                }
                if (getPieceColor(mark) === (color === 'black' ? 'white' : 'black') 
                && (getPieceType(mark) === 'bishop' || getPieceType(mark) === 'queen')) {
                    return true;
                }
            }
            else {
                break;
            }
            i++;
        }
    }

    return false;
};

export const purgeCheckMoves = (moves, origin, color, grid) => {
    let mark = grid[origin[0]][origin[1]];
    let answer = [];
    moves.forEach((move) => {
        let newGrid = grid.map( (row) => {
            return row.map( (mark) => {
                return mark;
            });
        });
        newGrid[move[0]][move[1]] = mark;
        newGrid[origin[0]][origin[1]] = '-';
        if (!inCheck(color, newGrid)) {
            answer.push(move);
        }
    });
    return answer;
}

export const getPieceMoves = (origin, pieceType, pieceColor, grid, game) => {
    if (pieceType === 'pawn') {
        let moves = getPawnMoves(origin, pieceColor, grid, game);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        let specialMoves = getPawnSpecialMoves(origin, pieceColor, grid, game);
        return purgeMoves.concat(specialMoves);
    } else if (pieceType === 'king') {
        let moves = getKingMoves(origin, pieceColor, grid, game);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        let specialMoves = getKingSpecialMoves(origin, pieceColor, grid, game);
        return purgeMoves.concat(specialMoves);
    } else if (pieceType === 'queen') {
        let moves = getQueenMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
    } else if (pieceType === 'knight') {
        let moves = getKnightMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
    } else if (pieceType === 'bishop') {
        let moves = getBishopMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
    } else if (pieceType === 'rook') {
        let moves = getRookMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
    }
}

//includes moving into check
export const getPieceDumbMoves = (origin, pieceType, pieceColor, grid) => {
    if (pieceType === 'pawn') {
        return getPawnMoves(origin, pieceColor, grid);
    } else if (pieceType === 'king') {
        return getKingMoves(origin, pieceColor, grid);
    } else if (pieceType === 'queen') {
        return getQueenMoves(origin, pieceColor, grid);
    } else if (pieceType === 'knight') {
        return getKnightMoves(origin, pieceColor, grid);
    } else if (pieceType === 'bishop') {
        return getBishopMoves(origin, pieceColor, grid);
    } else if (pieceType === 'rook') {
        return getRookMoves(origin, pieceColor, grid);
    }
}

export const getPawnMoves = (origin, color, grid) => {
    let thisPieceColor = getPieceColor(grid[origin[0]][origin[1]]);
    if (thisPieceColor !== color){
        return false;
    }
    let answer = [];
    let advDir = color === 'black' ? 1 : -1;
    
    let advSpot = [ origin[0] + advDir, origin[1] ];
    if (onBoard(advSpot)){
        let advMark = grid[advSpot[0]][advSpot[1]];
        if (onBoard(advSpot) && advMark === '-') {
            answer.push(advSpot);
            if (origin[0] === (color === 'black' ? 1 : 6)) {
                let advTwoSpot = [advSpot[0] + advDir, advSpot[1]];
                let advTwoMark = grid[advTwoSpot[0]][advTwoSpot[1]];
                if (advTwoMark === '-' && onBoard(advSpot)) {
                    answer.push(advTwoSpot);
                }
            }
        }

        let capSteps = [[advDir, 1], [advDir, -1]]
        let capSpots = capSteps.map((step) => {
            return [origin[0] + step[0], origin[1] + step[1]];
        });
        capSpots.forEach((spot) => {
            if (onBoard(spot)) {
                let capMark = grid[spot[0]][spot[1]];
                let capColor = color === 'black' ? 'white' : 'black';
                if (getPieceColor(capMark) === capColor) {
                    answer.push(spot);
                }
            }
        });
    }
    return answer;
};

export const getPawnSpecialMoves = (origin, color, grid, game) => {
    let answer = [];
    if (origin[0] === (color === 'white' ? 3 : 4)){
        let advDir = (color === 'white' ? -1 : 1);
        let enemyDirs = [1, -1];
        enemyDirs.forEach((dir) => {
            let enemySpot = [origin[0], origin[1] + dir];
            let enemy = grid[enemySpot[0]][enemySpot[1]];
            if (enemy === (color === 'white' ? 'P' : 'p')){
                let snapshots = game.gameSoFar;
                let prevGrid = snapshotToGrid(snapshots[snapshots.length - 2]);
                let enemyOrigin = [origin[0] + (2*advDir), enemySpot[1]];
                if (prevGrid[enemyOrigin[0]][enemyOrigin[1]] === enemy && prevGrid[enemySpot[0]][enemySpot[1]] === '-'){
                    answer.push([ origin[0] + advDir, origin[1] + dir, 'special', 'enPassant' ]);
                }
            }
        });
    }
    return answer;
};

export const getKingMoves = (origin, color, grid) => {
    let answer = []
    let steps = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    let spots = steps.map( (step) => {
        return [origin[0] + step[0], origin[1] + step[1]];
    });
    spots.forEach( (spot) => {
        if (onBoard(spot)) {
            let spotMark = grid[spot[0]][spot[1]];
            if (spotMark === '-'){
                answer.push(spot);
            }
            else if (getPieceColor(spotMark) !== color){
                answer.push(spot);
            }
        }
    });
    return answer;
};

export const getKingSpecialMoves = (origin, color, grid, game) => {
   
    let answer = [];
    if (canCastle(game, 7)) {
        let newMove = [origin[0], origin[1] + 2, 'special', 'castleKing'];
        answer.push(newMove);
    }
    if (canCastle(game, 0)) {
        let newMove = [origin[0], origin[1] - 2, 'special', 'castleQueen'];
        answer.push(newMove);
    }
    return answer;
}

export const getKnightMoves = (origin, color, grid) => {
    let answer = []
    let steps = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    let spots = steps.map((step) => {
        return [origin[0] + step[0], origin[1] + step[1]];
    });
    spots.forEach((spot) => {
        if (onBoard(spot)) {
            let spotMark = grid[spot[0]][spot[1]];
            if (spotMark === '-') {
                answer.push(spot);
            }
            else if (getPieceColor(spotMark) !== color) {
                answer.push(spot);
            }
        }
    });
    return answer;
};

export const getQueenMoves = (origin, color, grid) => {
    let answer = [];
    let dirs = [
        [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ];
    dirs.forEach( (dir) => {
        let dist = 1;
        while (dist < 8){
            let spot = [origin[0] + (dir[0]*dist), origin[1] + (dir[1]*dist)];
            if (onBoard(spot)){
                let spotMark = grid[spot[0]][spot[1]];
                if (spotMark === '-'){
                    answer.push(spot);
                }
                else if (getPieceColor(spotMark) !== color) {
                    answer.push(spot);
                    break;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
            dist++;
        }
    });
    return answer;
};

export const getBishopMoves = (origin, color, grid) => {
    let answer = [];
    let dirs = [
        [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
    dirs.forEach((dir) => {
        let dist = 1;
        while (dist < 8) {
            let spot = [origin[0] + (dir[0] * dist), origin[1] + (dir[1] * dist)];
            if (onBoard(spot)) {
                let spotMark = grid[spot[0]][spot[1]];
                if (spotMark === '-') {
                    answer.push(spot);
                }
                else if (getPieceColor(spotMark) !== color) {
                    answer.push(spot);
                    break;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
            dist++;
        }
    });
    return answer;
};

export const getRookMoves = (origin, color, grid) => {
    let answer = [];
    let dirs = [
        [-1, 0], [0, -1], [0, 1], [1, 0]
    ];
    dirs.forEach((dir) => {
        let dist = 1;
        while (dist < 8) {
            let spot = [origin[0] + (dir[0] * dist), origin[1] + (dir[1] * dist)];
            if (onBoard(spot)) {
                let spotMark = grid[spot[0]][spot[1]];
                if (spotMark === '-') {
                    answer.push(spot);
                }
                else if (getPieceColor(spotMark) !== color) {
                    answer.push(spot);
                    break;
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
            dist++;
        }
    });
    return answer;
};



