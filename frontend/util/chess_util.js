export const makeSnapshot = (grid) => {
    let answer = '';
    grid.forEach( (row) => {
        answer += row.join('');
    });
    return answer;
};

export const getChessMoves = (snapshots) => {
    let answer = ['start'];
    for (let i = 0; i < snapshots.length - 1; i++){
        answer.push(getLastMove(snapshots.slice(i, i + 2)));
    }
    return answer;
};

export const getLastMove = (seq) => {
    let first = seq[seq.length - 2];
    let second = seq[seq.length - 1];
    let arr1 = first.split('');
    let arr2 = second.split('');
    let piece = '-';
    let spot = '0';
    let capture = '';
    arr2.forEach( (mark, idx) => {
        if (mark !== '-' && arr1[idx] !== mark) {
            piece = mark;
            spot = idx;
            if (arr1[idx] !== '-') {
                capture = 'x';
            }
            if (piece === 'p' || piece === 'P'){
                piece = '';
            }
            else {
                piece = piece.toUpperCase();
            }
        }
    });
    let rIdx = Math.floor(spot/8);
    let cIdx = spot % 8;
    return piece + capture + getCoords(rIdx, cIdx);
};

export const getCoords = (rIdx, cIdx) => {
    const fileNames = {
        0: 'a',
        1: 'b',
        2: 'c',
        3: 'd',
        4: 'e',
        5: 'f',
        6: 'g',
        7: 'h'
    }
    return fileNames[cIdx] + (8 - rIdx).toString();
};

export const seqToString = (seq, description = null, title = null) => {
    if (description && title) {
        return seq.join('') + '$)$($' + description + '$)$$($' + title;
    }
    else {
        return seq.join('');
    }
};

export const stringToSeq = (str) => {
    return str.split('$)$($')[0];
};

export const stringToDescription = (str) => {
    if (str.includes('$)$$($')) {
        return str.split('$)$($')[1].split('$)$$($')[0];
    }
    else {
        return str.split('$)$($')[1];
    }
};

export const stringToTitle = (str) => {
    if (str.includes('$)$$($')) {
        return str.split('$)$($')[1].split('$)$$($')[1];
    }
    else {
        return 'Sequence';
    }
};

export const seqToSnapshots = (str) => {
    let numMoves = str.length/64;
    let snapShots = [];
    for (let i = 0; i < numMoves; i++) {
        snapShots.push(str.slice(i*64, (i + 1)*64));
    }
    return snapShots;
};

export const snapshotToGrid = (str) => {
    let arr = str.split('');
    let rows = [];
    let row = [];
    for (let i = 0; i < 64; i++) {
        if (i % 8 === 0 && i > 0) {
            rows.push(row);
            row = [];
        }
        row.push(arr[i]);
    }
    rows.push(row);
    return rows;
};