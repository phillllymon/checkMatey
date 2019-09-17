
class Game {
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
        this.gameSoFar = ['RNBQKBNRPPPPPPPP--------------------------------pppppppprnbqkbnr'];
        this.getString = this.getString.bind(this);
        console.log(this.getString);
    }

    makeMove(move) {
        let origin = [move[0]];
        let destination = [move[1]];
        this.grid[destination[0]][destination[1]] = this.grid[origin[0]][origin[1]];
        this.grid[origin[0]][origin[1]] = '-';
        this.gameSoFar.push(this.getString());
    }

    getString() {
        let answer = '';
        this.grid.forEach( (row) => {
            answer += row.join('');
        });
        return answer;
    }

}