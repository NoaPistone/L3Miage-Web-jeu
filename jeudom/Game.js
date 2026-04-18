export class Game {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = Array.from({ length: 6 }, () => Array(7).fill(0));
        this.currentPlayer = 1;
        this.isGameOver = false;
        this.mode = 'classic';
        this.scores = { 1: 0, 2: 0 };
        this.specials = { 1: { cross: 1, diag: 1, flash: 1 }, 2: { cross: 1, diag: 1, flash: 1 } };
    }

    resetBoard() {
        this.board = Array.from({ length: 6 }, () => Array(7).fill(0));
        this.isGameOver = false;
        this.specials = { 1: { cross: 1, diag: 1, flash: 1 }, 2: { cross: 1, diag: 1, flash: 1 } };
    }

    getAvailableRow(c) {
        for (let r = 5; r >= 0; r--) {
            if (this.board[r][c] === 0) return r;
        }
        return -1;
    }

    checkWin() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                const p = this.board[r][c];
                if (p === 0) continue;
                for (let [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
                    let count = 1;
                    for (let i = 1; i < 4; i++) {
                        let nr = r + dr * i, nc = c + dc * i;
                        if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && this.board[nr][nc] === p) count++;
                        else break;
                    }
                    if (count >= 4) return true;
                }
            }
        }
        return false;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== 0);
    }

    applyGravity() {
        for (let c = 0; c < 7; c++) {
            let column = [];
            for (let r = 0; r < 6; r++) if (this.board[r][c] !== 0) column.push(this.board[r][c]);
            for (let r = 5; r >= 0; r--) this.board[r][c] = column.length > 0 ? column.pop() : 0;
        }
    }
}