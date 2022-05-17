
class Cell {
    values;
    position;
    clicks = 0;

    constructor(pos, vals) {
        this.position = pos;
        this.values = vals;
    }

    current = () => {
        return this.values[this.clicks];
    }

}

class Board {

    constructor(state) {
        this.rows = state.rows;
        this.columns = state.columns;
        this.clicks = 0;
        this.cells = new Map();
        for (var row = 0; row < this.rows; row++){
            for (var col = 0; col < this.columns; col++){
                let key = [row, col];
                let pos = row * this.rows + col;
                this.cells[key] = new Cell(pos, state.scores[row][col]);
            } 
        }
    }
    
    current = (row, col) => {
        return this.cells[[row, col]].current();
    }

    position = (row, col) => {
        return this.cells[[row, col]].position;
    }
}