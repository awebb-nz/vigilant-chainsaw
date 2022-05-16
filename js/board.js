
class Cell {
    values;
    clicks = 0;

    constructor(vals) {
        this.values = vals;
    }

    get current() {
        return this.values[this.clicks];
    }

    step() {
        this.clicks += 1;
    }
}

class Board {

    constructor(state) {
        console.log("board", state);
        this.rows = state.rows;
        this.columns = state.columns;
        this.cells = new Map();
        for (var row = 0; row < this.rows; row++){
            for (var col = 0; col < this.columns; col++){
                let key = [row, col];
                this.cells[key] = new Cell(state.scores[row][col]);
            } 
        }
    }
    
}