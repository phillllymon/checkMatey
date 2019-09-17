export const makeSnapshot = (grid) => {
    let answer = '';
    grid.forEach( (row) => {
        answer += row.join('');
    });
    return answer;
}

export const getChessMoves = (seq) => {
    let answer = ['some move'];
    seq.forEach( (snapshot) => {
        answer.push('different move');
    });
    return answer;
}

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
}

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
}