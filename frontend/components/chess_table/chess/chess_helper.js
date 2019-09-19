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

export const getAllMoves = (color, grid) => {
    let answer = [];
    grid.forEach((row, rIdx) => {
        row.forEach((mark, cIdx) => {
            if (getPieceColor(mark) === color) {
                let origin = [rIdx, cIdx];
                let pieceType = getPieceType(mark);
                answer = answer.concat(getPieceMoves(origin, pieceType, color, grid));
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

export const inCheck = (color, grid) => {
    let kingSpot = findKing(color, grid);
    let moves = getAllDumbMoves((color === 'white' ? 'black' : 'white'), grid);
    let answer = false;
    moves.forEach((spot) => {
        if (spot[0] === kingSpot[0] && spot[1] === kingSpot[1]) {
            answer = true;
        }
    });
    return answer;
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

export const getPieceMoves = (origin, pieceType, pieceColor, grid) => {
    if (pieceType === 'pawn') {
        let moves = getPawnMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
    } else if (pieceType === 'king') {
        let moves = getKingMoves(origin, pieceColor, grid);
        let purgeMoves = purgeCheckMoves(moves, origin, pieceColor, grid);
        return purgeMoves;
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
    let advMark = grid[advSpot[0]][advSpot[1]];
    if (advMark === '-' && onBoard(advSpot)){
        answer.push(advSpot);
        if (origin[0] === ( color === 'black' ? 1 : 6 )) {
            let advTwoSpot = [ advSpot[0] + advDir, advSpot[1] ];
            let advTwoMark = grid[advTwoSpot[0]][advTwoSpot[1]];
            if (advTwoMark === '-' && onBoard(advSpot)) {
                answer.push(advTwoSpot);
            }
        }
    }

    let capSteps = [[advDir, 1],[advDir, -1]]
    let capSpots = capSteps.map( (step) => {
        return [ origin[0] + step[0], origin[1] + step[1]];
    });
    capSpots.forEach( (spot) => {
        if (onBoard(spot)){
            let capMark = grid[spot[0]][spot[1]];
            let capColor = color === 'black' ? 'white' : 'black';
            if (getPieceColor(capMark) === capColor){
                answer.push(spot);
            }
        }
    });
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



