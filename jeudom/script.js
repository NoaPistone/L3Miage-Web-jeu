class ConnectFour {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        // Coordonnées absolues pour la zone SVG 500x430
        this.CELL_SIZE = 60;
        this.GAP = 10;
        this.MARGIN_X = 10;
        this.MARGIN_Y = 10;

        this.board = [];
        this.currentPlayer = 1;
        this.scores = { 1: 0, 2: 0 };
        this.undosAvailable = { 1: 1, 2: 1 };
        this.moveStack = [];
        this.isGameOver = false;
        this.blockedCol = null;
        this.blockedTurns = 0;

        this.initGrid();
        this.bindEvents();
        this.initRound();
    }

    initGrid() {
        const maskHoles = document.getElementById('mask-holes');
        const clickGrid = document.getElementById('click-grid');
        
        clickGrid.innerHTML = '';
        maskHoles.innerHTML = '';

        for (let c = 0; c < this.COLS; c++) {
            // Création des colonnes de clic
            const colEl = document.createElement('div');
            colEl.addEventListener('mouseenter', () => this.showGhost(c));
            colEl.addEventListener('mouseleave', () => this.clearGhost());
            colEl.addEventListener('click', () => this.handleMove(c));
            clickGrid.appendChild(colEl);

            // Création des trous dans le masque SVG
            for (let r = 0; r < this.ROWS; r++) {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const cx = this.MARGIN_X + (this.CELL_SIZE/2) + c * (this.CELL_SIZE + this.GAP);
                const cy = this.MARGIN_Y + (this.CELL_SIZE/2) + r * (this.CELL_SIZE + this.GAP);
                circle.setAttribute("cx", cx);
                circle.setAttribute("cy", cy);
                circle.setAttribute("r", this.CELL_SIZE / 2);
                circle.setAttribute("fill", "black"); // Le noir crée le trou dans le masque
                maskHoles.appendChild(circle);
            }
        }
    }

    bindEvents() {
        document.getElementById('btn-undo').onclick = () => this.undoMove();
        document.getElementById('btn-new-round').onclick = () => this.initRound();
        document.getElementById('btn-reset').onclick = () => this.resetMatch();
        document.getElementById('btn-modal-reset').onclick = () => this.resetMatch();
    }

    initRound() {
        this.board = Array.from({ length: this.ROWS }, () => Array(this.COLS).fill(0));
        this.isGameOver = false;
        this.moveStack = [];
        this.undosAvailable = { 1: 1, 2: 1 };
        this.blockedCol = null;
        this.blockedTurns = 0;
        document.getElementById('discs-container').innerHTML = '';
        document.getElementById('win-highlights-layer').innerHTML = ''; // Effacer contours victoire
        this.updateUI();
    }

    resetMatch() {
        this.scores = { 1: 0, 2: 0 };
        document.getElementById('modal').style.display = 'none';
        this.initRound();
    }

    handleMove(col) {
        if (this.isGameOver || col === this.blockedCol) return;
        const row = this.getAvailableRow(col);
        if (row === -1) return;

        this.board[row][col] = this.currentPlayer;
        const discId = `d-${Date.now()}`;
        this.moveStack.push({ row, col, player: this.currentPlayer, id: discId });
        
        this.dropDisc(row, col, this.currentPlayer, discId);
        this.playSound('sfx-drop');

        const winLine = this.checkWin(row, col);
        if (winLine) {
            this.handleWin(winLine);
        } else if (this.board[0].every(c => c !== 0)) {
            this.isGameOver = true;
            document.getElementById('game-status').innerText = "Match Nul !";
        } else {
            this.processTwist();
            this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
            this.updateUI();
        }
    }

    getAvailableRow(col) {
        for (let r = this.ROWS - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) return r;
        }
        return -1;
    }

    dropDisc(row, col, player, id) {
        const container = document.getElementById('discs-container');
        const disc = document.createElement('div');
        disc.className = `disc player${player}`;
        disc.id = id;
        
        const x = this.MARGIN_X + col * (this.CELL_SIZE + this.GAP);
        const y = this.MARGIN_Y + row * (this.CELL_SIZE + this.GAP);
        
        disc.style.left = `${x}px`;
        disc.style.transform = `translateY(-80px)`; // Départ hors champ
        container.appendChild(disc);

        // Transition de chute
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                disc.style.transform = `translateY(${y}px)`;
            });
        });
    }

    handleWin(line) {
        this.isGameOver = true;
        this.scores[this.currentPlayer]++;
        this.playSound('sfx-win');
        
        // --- MODIFICATION ICI pour encadrement BLANC par-dessus ---
        setTimeout(() => {
            const winLayer = document.getElementById('win-highlights-layer');
            line.forEach(pos => {
                // Créer un cercle SVG pour le contour blanc
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                const cx = this.MARGIN_X + (this.CELL_SIZE/2) + pos.c * (this.CELL_SIZE + this.GAP);
                const cy = this.MARGIN_Y + (this.CELL_SIZE/2) + pos.r * (this.CELL_SIZE + this.GAP);
                circle.setAttribute("cx", cx);
                circle.setAttribute("cy", cy);
                circle.setAttribute("r", this.CELL_SIZE / 2 - 1); // Légèrement plus petit que le trou
                circle.classList.add('win-ring'); // Classe CSS pour le stroke blanc lumineux
                winLayer.appendChild(circle);
            });
        }, 610); // Attend la fin de la chute
        // -----------------------------------------------------------

        this.updateUI();
        if (this.scores[this.currentPlayer] >= 2) {
            setTimeout(() => {
                const winnerColor = this.currentPlayer === 1 ? "Rouge" : "Jaune";
                document.getElementById('modal-title').innerText = `Le Joueur ${winnerColor} Gagne !`;
                document.getElementById('modal').style.display = 'flex';
            }, 1500);
        }
    }

    showGhost(col) {
        if (this.isGameOver || col === this.blockedCol) return;
        const row = this.getAvailableRow(col);
        if (row === -1) return;

        const container = document.getElementById('discs-container');
        const ghost = document.createElement('div');
        ghost.className = `disc player${this.currentPlayer} ghost`;
        ghost.id = 'ghost-disc';
        
        const x = this.MARGIN_X + col * (this.CELL_SIZE + this.GAP);
        const y = this.MARGIN_Y + row * (this.CELL_SIZE + this.GAP);
        
        ghost.style.left = `${x}px`;
        ghost.style.transform = `translateY(${y}px)`;
        container.appendChild(ghost);
    }

    clearGhost() {
        const ghost = document.getElementById('ghost-disc');
        if (ghost) ghost.remove();
    }

    undoMove() {
        if (this.moveStack.length === 0 || this.isGameOver) return;
        if (this.undosAvailable[this.currentPlayer] <= 0) return;
        const last = this.moveStack.pop();
        this.board[last.row][last.col] = 0;
        this.undosAvailable[this.currentPlayer]--;
        const el = document.getElementById(last.id);
        if(el) el.remove();
        this.updateUI();
    }

    updateUI() {
        document.getElementById('p1-wins').innerText = this.scores[1];
        document.getElementById('p2-wins').innerText = this.scores[2];
        document.getElementById('p1-score-card').classList.toggle('active', this.currentPlayer === 1);
        document.getElementById('p2-score-card').classList.toggle('active', this.currentPlayer === 2);
        document.getElementById('p1-undo-pill').innerText = `Undo: ${this.undosAvailable[1]}`;
        document.getElementById('p2-undo-pill').innerText = `Undo: ${this.undosAvailable[2]}`;
        
        if (!this.isGameOver) {
            const playerColor = this.currentPlayer === 1 ? "Rouge" : "Jaune";
            document.getElementById('game-status').innerText = `Tour du Joueur ${playerColor}`;
        }
    }

    checkWin(r, c) {
        const p = this.board[r][c];
        const dirs = [[[0,1],[0,-1]], [[1,0],[-1,0]], [[1,1],[-1,-1]], [[1,-1],[-1,1]]];
        for (let d of dirs) {
            let line = [{r, c}];
            for (let [dr, dc] of d) {
                let nr = r + dr, nc = c + dc;
                while (nr >= 0 && nr < this.ROWS && nc >= 0 && nc < this.COLS && this.board[nr][nc] === p) {
                    line.push({r: nr, c: nc});
                    nr += dr; nc += dc;
                }
            }
            if (line.length >= 4) return line;
        }
        return null;
    }

    processTwist() {
        if (!document.getElementById('twist-mode').checked) { this.blockedCol = null; return; }
        if (this.blockedTurns > 0) {
            this.blockedTurns--;
            if (this.blockedTurns === 0) this.blockedCol = null;
        } else if (Math.random() < 0.15) {
            this.blockedCol = Math.floor(Math.random() * this.COLS);
            this.blockedTurns = 3;
            alert("Une colonne a été bloquée par le sort !");
        }
    }

    playSound(id) {
        if (document.getElementById('sound-toggle').checked) {
            const s = document.getElementById(id);
            if(s) { s.currentTime = 0; s.play().catch(() => {}); }
        }
    }
}

new ConnectFour();