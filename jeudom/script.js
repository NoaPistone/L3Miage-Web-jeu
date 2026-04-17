class ConnectFour {
    constructor() {
        this.ROWS = 6; this.COLS = 7;
        this.board = Array.from({ length: 6 }, () => Array(7).fill(0));
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.mode = 'classic';
        this.selectedSpecial = null;
        this.specials = { 1: { cross: 1, diag: 1, flash: 1 }, 2: { cross: 1, diag: 1, flash: 1 } };
        this.isGameOver = false;

        this.initGrid();
        this.bindEvents();
    }

    initGrid() {
        const maskHoles = document.getElementById('mask-holes');
        const clickGrid = document.getElementById('click-grid');
        maskHoles.innerHTML = ''; clickGrid.innerHTML = '';
        for (let c = 0; c < 7; c++) {
            const colEl = document.createElement('div');
            colEl.onclick = () => this.handleMove(c);
            clickGrid.appendChild(colEl);
            for (let r = 0; r < 6; r++) {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", 40 + c * 70); circle.setAttribute("cy", 40 + r * 70);
                circle.setAttribute("r", 30); circle.setAttribute("fill", "black");
                maskHoles.appendChild(circle);
            }
        }
    }

    setMode(m) {
        this.mode = m;
        document.getElementById('mode-selector').style.display = 'none';
        this.initRound();
    }

    initRound() {
        this.board = Array.from({ length: 6 }, () => Array(7).fill(0));
        this.isGameOver = false;
        document.getElementById('discs-container').innerHTML = '';
        document.getElementById('board-container').classList.remove('flash-active');
        this.updateUI();
    }

    selectSpecial(type) {
        if (this.isGameOver || this.specials[this.currentPlayer][type] === 0) return;
        this.selectedSpecial = (this.selectedSpecial === type) ? null : type;
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedSpecial) document.getElementById(`p${this.currentPlayer}-exp-${type}`).classList.add('selected');
    }

    activateFlash() {
        if (this.isGameOver || this.specials[this.currentPlayer].flash === 0) return;
        this.specials[this.currentPlayer].flash = 0;
        document.getElementById('board-container').classList.add('flash-active');
        document.getElementById(`p${this.currentPlayer}-flash`).classList.add('used');
        this.updateUI();
    }

    async handleMove(col) {
        if (this.isGameOver) return;
        const row = this.getAvailableRow(col);
        if (row === -1) return;

        const p = this.currentPlayer;
        const spec = this.selectedSpecial;

        // Créer le jeton
        const disc = document.createElement('div');
        disc.className = `disc ${spec ? 'special-black' : 'player' + p} ${spec ? 'exp-' + spec : ''}`;
        disc.style.left = `${10 + col * 70}px`;
        disc.style.transform = `translateY(-100px)`;
        document.getElementById('discs-container').appendChild(disc);

        // Animation de chute
        requestAnimationFrame(() => disc.style.transform = `translateY(${10 + row * 70}px)`);
        
        if (spec) {
            this.specials[p][spec] = 0;
            document.getElementById(`p${p}-exp-${spec}`).classList.add('used');
            this.selectedSpecial = null;
            document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
            
            await new Promise(r => setTimeout(r, 650));
            this.executeExplosion(row, col, spec);
        } else {
            this.board[row][col] = p;
            disc.setAttribute('data-pos', `${row}-${col}`);
        }

        const win = this.checkWin();
        if (win) {
            this.isGameOver = true;
            this.scores[p]++;
            setTimeout(() => { document.getElementById('modal').style.display = 'flex'; }, 500);
        } else {
            this.currentPlayer = p === 1 ? 2 : 1;
            document.getElementById('board-container').classList.remove('flash-active');
            this.updateUI();
        }
    }

    executeExplosion(r, c, type) {
        let targets = (type === 'cross') ? [[r-1, c], [r+1, c], [r, c-1], [r, c+1]] : [[r-1, c-1], [r-1, c+1], [r+1, c-1], [r+1, c+1]];
        targets.forEach(([tr, tc]) => {
            if (tr >= 0 && tr < 6 && tc >= 0 && tc < 7) {
                const targetDisc = document.querySelector(`.disc[data-pos="${tr}-${tc}"]`);
                if (targetDisc) targetDisc.classList.add('exploding');
                this.board[tr][tc] = 0;
            }
        });
        setTimeout(() => this.applyGravity(), 400);
    }

    applyGravity() {
        for (let c = 0; c < 7; c++) {
            let column = [];
            for (let r = 0; r < 6; r++) if (this.board[r][c] !== 0) column.push(this.board[r][c]);
            for (let r = 5; r >= 0; r--) this.board[r][c] = column.length > 0 ? column.pop() : 0;
        }
        this.redraw();
    }

    redraw() {
        const container = document.getElementById('discs-container');
        container.innerHTML = '';
        this.board.forEach((row, r) => row.forEach((p, c) => {
            if (p !== 0) {
                const d = document.createElement('div');
                d.className = `disc player${p}`;
                d.setAttribute('data-pos', `${r}-${c}`);
                d.style.left = `${10 + c * 70}px`;
                d.style.transform = `translateY(${10 + r * 70}px)`;
                container.appendChild(d);
            }
        }));
    }

    getAvailableRow(c) { for (let r = 5; r >= 0; r--) if (this.board[r][c] === 0) return r; return -1; }

    checkWin() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                const p = this.board[r][c]; if (p === 0) continue;
                for (let [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
                    let count = 1;
                    for (let i = 1; i < 4; i++) {
                        let nr = r+dr*i, nc = c+dc*i;
                        if (nr>=0 && nr<6 && nc>=0 && nc<7 && this.board[nr][nc]===p) count++; else break;
                    }
                    if (count >= 4) return true;
                }
            }
        }
        return false;
    }

    updateUI() {
        document.getElementById('p1-wins').innerText = this.scores[1];
        document.getElementById('p2-wins').innerText = this.scores[2];
        document.getElementById('p1-score-card').classList.toggle('active', this.currentPlayer === 1);
        document.getElementById('p2-score-card').classList.toggle('active', this.currentPlayer === 2);
        ['cross','diag','flash'].forEach(t => {
            document.getElementById(`cnt-p1-${t}`).innerText = `x${this.specials[1][t]}`;
            document.getElementById(`cnt-p2-${t}`).innerText = `x${this.specials[2][t]}`;
        });
    }

    bindEvents() {
        document.getElementById('btn-new-round').onclick = () => this.initRound();
        document.getElementById('btn-modal-reset').onclick = () => {
            this.scores = { 1: 0, 2: 0 };
            document.getElementById('modal').style.display = 'none';
            this.initRound();
        };
    }
}
const game = new ConnectFour();