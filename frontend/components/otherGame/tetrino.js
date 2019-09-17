class Tetrino {
    constructor(orients, advCrits, rLeftCrits, mLeftCrits, mRightCrits, mark) {
        this.orients = orients;
        this.orient = 0;
        this.spots = this.orients[0];
        this.advCrits = advCrits;
        this.rLeftCrits = rLeftCrits;
        this.mLeftCrits = mLeftCrits;
        this.mRightCrits = mRightCrits;
        this.mark = mark;
    }

    placePiece(grid, game) {
        this.pos = game.home;
        this.spots.forEach( (spot) => {
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

    canAdvance(grid) {
        let answer = true;
        this.advCrits[this.orient].map( (crit) => {
            return [this.pos[0] + crit[0], this.pos[1] + crit[1]];
        }).forEach( (spot) => {
            if (spot[0] < 0 || spot[0] > 19 || spot[1] < 0 || spot[1] > 9){
                answer = false;
            }
            else if (grid[spot[0]][spot[1]] !== 'empty'){
                answer = false;
            }
        });
        return answer;
    }

    canRotateLeft(grid) {
        let answer = true;
        this.rLeftCrits[this.orient].map((crit) => {
            return [this.pos[0] + crit[0], this.pos[1] + crit[1]];
        }).forEach((spot) => {
            if (spot[0] < 0 || spot[0] > 19 || spot[1] < 0 || spot[1] > 9) {
                answer = false;
            }
            else if (grid[spot[0]][spot[1]] !== 'empty') {
                answer = false;
            }
        });
        return answer;
    }

    canMoveRight(grid) {
        let answer = true;
        this.mRightCrits[this.orient].map((crit) => {
            return [this.pos[0] + crit[0], this.pos[1] + crit[1]];
        }).forEach((spot) => {
            if (spot[0] < 0 || spot[0] > 19 || spot[1] < 0 || spot[1] > 9) {
                answer = false;
            }
            else if (grid[spot[0]][spot[1]] !== 'empty') {
                answer = false;
            }
        });
        return answer;
    }

    canMoveLeft(grid) {
        let answer = true;
        this.mLeftCrits[this.orient].map((crit) => {
            return [this.pos[0] + crit[0], this.pos[1] + crit[1]];
        }).forEach((spot) => {
            if (spot[0] < 0 || spot[0] > 19 || spot[1] < 0 || spot[1] > 9) {
                answer = false;
            }
            else if (grid[spot[0]][spot[1]] !== 'empty') {
                answer = false;
            }
        });
        return answer;
    }

    rotateLeft(grid) {
        let newGrid = grid;
        if (this.canRotateLeft(grid)){
            let occs = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1]];
            });
            occs.forEach((occ) => {
                newGrid[occ[0]][occ[1]] = 'empty';
            });
            this.orient = (this.orient + 1) % this.orients.length;
            this.spots = this.orients[this.orient];
            occs = this.spots.map((spot) => {
                return [spot[0] + this.pos[0], spot[1] + this.pos[1]];
            });
            occs.forEach((occ) => {
                newGrid[occ[0]][occ[1]] = this.mark;
            });
        }
        return newGrid;
    }
}

export default Tetrino;