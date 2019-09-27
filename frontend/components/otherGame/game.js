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
    constructor(preview = false, nextPiece = this.generatePiece()) {
        this.home = [0, 4];
        this.startGrid = [];
        for(let i = 0; i < 20; i++) {
            let row = ['empty', 'empty', 'empty', 'empty', 'empty', 'empty',
                'empty', 'empty', 'empty', 'empty'];
            this.startGrid.push(row);
        }
        this.nextPiece = nextPiece;
        this.nextGrid = [
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty'],
            ['empty', 'empty', 'empty', 'empty']
        ];
        this.nextGrid = this.nextPiece.placePiece(this.nextGrid, this, [0, 1]);
        this.grid = this.startGrid;
        this.gameOver = true;
        this.score = 0;
        this.preview = preview;
    }

    start() {
        this.gameOver = false;
        this.currentPiece = this.nextPiece;
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
                return new Tetrino(...iPiece);
            case 1:
                return new Tetrino(...aPiece);
            case 2:
                return new Tetrino(...tPiece);
            case 3:
                return new Tetrino(...lPiece);
            case 4:
                return new Tetrino(...jPiece);
            case 5:
                return new Tetrino(...sPiece);
            case 6:
                return new Tetrino(...zPiece);
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
        let multiplier = 0;
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
                multiplier += 1;
                if (this.lines % 10 === 0) {
                    this.level++;
                }
            }
        });
        let scoreAmt = 100 * (multiplier * multiplier);
        this.score += this.preview ? scoreAmt/2 : scoreAmt;
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
            this.score += 5;
            this.currentPiece = this.nextPiece;
            this.nextPiece = this.generatePiece();
            this.grid = this.currentPiece.placePiece(this.grid, this);
            this.nextGrid = [
                ['empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty'],
                ['empty', 'empty', 'empty', 'empty']
            ];
            this.nextGrid = this.nextPiece.placePiece(this.nextGrid, this, [0, 1]);
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

