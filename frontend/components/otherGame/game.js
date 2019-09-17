import Tetrino from './tetrino';
import { 
    iPiece, 
    aPiece, 
    tPiece, 
    lPiece,
    jPiece,
    sPiece,
    zPiece
} from './tetrinos_types';

class Game {
    constructor() {
        this.home = [0, 4];
        this.startGrid = [];
        for(let i = 0; i < 20; i++) {
            let row = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty',
                'empty', 'empty', 'empty', 'empty'];
            this.startGrid.push(row);
        }
        this.grid = this.startGrid;
    }

    start() {
        this.gameOver = false;
        this.currentPiece = this.generatePiece();
        this.grid = this.startGrid;
        this.grid = this.currentPiece.placePiece(this.grid, this);
        this.level = 1;
        this.lines = 0;
    }

    endGame() {
        this.gameOver = true;
    }

    generatePiece() {
        switch (Math.floor(7*Math.random())){
            case 0:
                return new Tetrino(iPiece.orients, iPiece.advCrits, 
                    iPiece.rLeftCrits, iPiece.mLeftCrits, 
                    iPiece.mRightCrits, iPiece.mark);
            case 1:
                return new Tetrino(aPiece.orients, aPiece.advCrits,
                    aPiece.rLeftCrits, aPiece.mLeftCrits,
                    aPiece.mRightCrits, aPiece.mark);
            case 2:
                return new Tetrino(tPiece.orients, tPiece.advCrits,
                    tPiece.rLeftCrits, tPiece.mLeftCrits,
                    tPiece.mRightCrits, tPiece.mark);
            case 3:
                return new Tetrino(lPiece.orients, lPiece.advCrits,
                    lPiece.rLeftCrits, lPiece.mLeftCrits,
                    lPiece.mRightCrits, lPiece.mark);
            case 4:
                return new Tetrino(jPiece.orients, jPiece.advCrits,
                    jPiece.rLeftCrits, jPiece.mLeftCrits,
                    jPiece.mRightCrits, jPiece.mark);
            case 5:
                return new Tetrino(sPiece.orients, sPiece.advCrits,
                    sPiece.rLeftCrits, sPiece.mLeftCrits,
                    sPiece.mRightCrits, sPiece.mark);
            case 6:
                return new Tetrino(zPiece.orients, zPiece.advCrits,
                    zPiece.rLeftCrits, zPiece.mLeftCrits,
                    zPiece.mRightCrits, zPiece.mark);
        }
        
    }

    dropPiece() {
        while (this.currentPiece.canAdvance(this.grid)) {
            let occs = this.currentPiece.spots.map((spot) => {
                return [spot[0] + this.currentPiece.pos[0], spot[1] + this.currentPiece.pos[1]];
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1]] = 'empty';
            });
            occs.forEach((occ) => {
                this.grid[occ[0] + 1][occ[1]] = this.currentPiece.mark;
            });
            let pos = this.currentPiece.pos;
            this.currentPiece.pos = [pos[0] + 1, pos[1]];
        }
        return this.grid;
    }   

    clearLines() {
        this.grid.forEach((row, rIdx) => {
            let line = true;
            row.forEach((spot) => {
                if (spot === 'empty'){
                    line = false;
                }
            });
            if (line) {
                for (let i = rIdx; i > 0; i--){
                    for (let j = 0; j < 10; j++){
                        this.grid[i][j] = this.grid[i - 1][j];
                    }
                }
                this.grid[0] = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty',
                    'empty', 'empty', 'empty', 'empty'];
                this.lines++;
                if (this.lines % 10 === 0) {
                    this.level++;
                }
            }
        });
    }

    advanceGame() {
        //console.log(this.currentPiece.gameOver(this.grid, this));
        if (this.currentPiece.canAdvance(this.grid)){
            let occs = this.currentPiece.spots.map( (spot) => {
                return [spot[0] + this.currentPiece.pos[0], spot[1] + this.currentPiece.pos[1]];
            });
            occs.forEach( (occ) => {
                this.grid[occ[0]][ occ[1]] = 'empty';
            });
            occs.forEach((occ) => {
                this.grid[occ[0] + 1][ occ[1]] = this.currentPiece.mark;
            });
            let pos = this.currentPiece.pos;
            this.currentPiece.pos = [pos[0] + 1, pos[1]];
        }
        else {
            this.clearLines();
            this.currentPiece = this.generatePiece();
            this.grid = this.currentPiece.placePiece(this.grid, this);
        }
        return this.grid;
    }

    rotateLeft() {
        return this.currentPiece.rotateLeft(this.grid);
    }

    moveDown() {
        if (this.currentPiece.canAdvance(this.grid)) {
            let occs = this.currentPiece.spots.map((spot) => {
                return [spot[0] + this.currentPiece.pos[0], spot[1] + this.currentPiece.pos[1]];
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1]] = 'empty';
            });
            occs.forEach((occ) => {
                this.grid[occ[0] + 1][occ[1]] = this.currentPiece.mark;
            });
            let pos = this.currentPiece.pos;
            this.currentPiece.pos = [pos[0] + 1, pos[1]];
        }
        return this.grid;
    }

    moveLeft() {
        if (this.currentPiece.canMoveLeft(this.grid)){
            let occs = this.currentPiece.spots.map((spot) => {
                return [spot[0] + this.currentPiece.pos[0], spot[1] + this.currentPiece.pos[1]];
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1]] = 'empty';
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1] - 1] = this.currentPiece.mark;
            });
            let pos = this.currentPiece.pos;
            this.currentPiece.pos = [pos[0], pos[1] - 1];
        }
        return this.grid;
    }

    moveRight() {
        if (this.currentPiece.canMoveRight(this.grid)) {
            let occs = this.currentPiece.spots.map((spot) => {
                return [spot[0] + this.currentPiece.pos[0], spot[1] + this.currentPiece.pos[1]];
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1]] = 'empty';
            });
            occs.forEach((occ) => {
                this.grid[occ[0]][occ[1] + 1] = this.currentPiece.mark;
            });
            let pos = this.currentPiece.pos;
            this.currentPiece.pos = [pos[0], pos[1] + 1];
        }
        return this.grid;
    }


}



export default Game;

