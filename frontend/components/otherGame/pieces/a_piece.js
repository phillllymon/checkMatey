class aPiece {
    constructor() {
        this.spots = [[0, 0], [1, 0], [0, 1], [1, 1]];
        this.orientation = 0;
        this.orientations = {
            0: [[0, 0], [1, 0], [2, 0], [3, 0]],
        }
    }

    gameOver(grid, game) {
        this.spots.forEach((spot) => {
            let y = game.home[0] + spot[0];
            let x = game.home[1] + spot[1];
            if (grid[y][x] !== 'empty') {
                return true;
            }
        });
        return false;
    }

    placePiece(grid, game) {
        this.mark = 'a';
        this.pos = game.home;
        this.spots.forEach((spot) => {
            let y = game.home[0] + spot[0];
            let x = game.home[1] + spot[1];
            grid[y][x] = this.mark;
        });
        return grid;
    }

    rotateLeft(grid) {
        return grid;
    }

    canRotateLeft(grid) {
        return true;
    }

    canAdvance(grid) {
        let answer = true;
        if (this.orientation === 0) {
            if (this.pos[0] === 18) {
                return false;
            }
            let criticals = [[this.pos[0] + 2, this.pos[1]], [this.pos[0] + 2, this.pos[1] + 1]];
            criticals.forEach( (spot) => {
                if (grid[spot[0]][spot[1]] !== 'empty'){
                    answer = false;
                }
            });
        }
        return answer;
    }

    canMoveLeft(grid) {
        let answer = true;
        if (this.orientation === 0) {
            if (this.pos[1] === 0) {
                return false;
            }
            let criticals = [[ this.pos[0], this.pos[1] - 1], [this.pos[0] + 1, this.pos[1] - 1]];
            criticals.forEach((spot) => {
                if (grid[spot[0]][spot[1]] !== 'empty') {
                    answer = false;
                }
            });
        }
        return answer;
    }

    canMoveRight(grid) {
        let answer = true;
        if (this.orientation === 0) {
            if (this.pos[1] === 8) {
                return false;
            }
            let criticals = [[this.pos[0], this.pos[1] + 2], [this.pos[0] + 1, this.pos[1] + 2]];
            criticals.forEach((spot) => {
                if (grid[spot[0]][spot[1]] !== 'empty') {
                    answer = false;
                }
            });
        }
        return answer;
    }
}

export default aPiece;