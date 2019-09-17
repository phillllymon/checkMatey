

class iPiece {
    constructor() {
        this.spots = [[0, 0], [1, 0], [2, 0], [3, 0]];
        this.orientation = 0;
        this.orientations = {
            0: [[0, 0], [1, 0], [2, 0], [3, 0]],
            1: [[1, -1], [1, 0], [1, 1], [1, 2]]
        }
    }

    placePiece(grid, game) {
        this.mark = 'i';
        this.pos = game.home;
        this.spots.forEach((spot) => {
            let y = game.home[0] + spot[0];
            let x = game.home[1] + spot[1];
            if (grid[y][x] === 'empty') {
                grid[y][x] = this.mark;
            }
            else {
                game.endGame();
            }
        });
        return grid;
    }

    rotateLeft(grid) {
        let newGrid = grid;
        if (this.canRotateLeft(grid)) {
            let occs = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1]];
            });
            occs.forEach((occ) => {
                newGrid[occ[0]][occ[1]] = 'empty';
            });
            this.orientation = (this.orientation + 1) % 2;
            this.spots = this.orientations[this.orientation];
            occs = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1]];
            });
            occs.forEach((occ) => {
                newGrid[occ[0]][occ[1]] = this.mark;
            });
        }
        return newGrid;
    }

    canRotateLeft(grid) {
        let newOrientation = (this.orientation + 1) % 2;
        let nextSpots = this.orientations[newOrientation];
        let newSpots = []
        nextSpots.forEach( (spot) => {
            if (spot[0] !== 1 || spot[1] !== 0) {
                newSpots.push(spot);
            }
        });
        let newOccs = newSpots.map((spot) => {
            return [spot[0] + this.pos[0], spot[1] + this.pos[1]];
        });
        let answer = true;
        newOccs.forEach((spot) => {
            if (spot[0] > 19 || spot[1] < 0 || spot[1] > 9){
                answer = false;
            }
            if (grid[spot[0]][spot[1]] !== 'empty') {
                answer = false;
            }
        });
        return answer;
    }

    canAdvance(grid) {
        let answer = true;
        if (this.orientation === 0) {
            if (this.pos[0] === 16) {
                return false;
            }
            let critical = [this.pos[0] + 4, this.pos[1]];
            if (grid[critical[0]][critical[1]] !== 'empty') {
                return false;
            }
        }
        else if (this.orientation === 1) {
            if (this.pos[0] === 18) {
                return false;
            }
            let criticals = this.spots.map((spot) => {
                return [spot[0] + this.pos[0] + 1, spot[1] + this.pos[1]];
            });
            criticals.forEach((spot) => {   
                if (grid[spot[0]][spot[1]] !== 'empty') {
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
            let criticals = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1] - 1];
            });
            criticals.forEach((spot) => {
                if (grid[spot[0]][spot[1]] !== 'empty') {
                    answer = false;
                }
            });
        }
        else if (this.orientation === 1) {
            if (this.pos[1] === 1) {
                return false;
            }
            let critical = [this.pos[0] + 1, this.pos[1] - 2]
            if (grid[critical[0]][critical[1]] !== 'empty') {
                return false;
            }
        }
        return answer;
    }

    canMoveRight(grid) {
        let answer = true;
        if (this.orientation === 0){
            if (this.pos[1] === 9){
                return false;
            }
            let criticals = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1] + 1];
            });
            criticals.forEach( (spot) => {
                if (grid[spot[0]][spot[1]] !== 'empty') {
                    answer = false;
                }
            });
        }
        else if (this.orientation === 1){
            if (this.pos[1] === 7) {
                return false;
            }
            let critical = [this.pos[0] + 1, this.pos[1] + 3]
            if (grid[critical[0]][critical[1]] !== 'empty') {
                return false;
            }
        }
        return answer;
    }
}

export default iPiece;