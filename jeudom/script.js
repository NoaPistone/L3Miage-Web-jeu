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
        this.flashActive = false;

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
        const displayEl = document.getElementById('mode-display');
        if (m === 'aram') {
            displayEl.innerHTML = 'Mode: <span style="color: #10b981; font-weight: bold;">SPECIAL</span>';
        } else {
            displayEl.innerHTML = 'Mode: CLASSIQUE';
        }
        this.initRound();
    }

    initRound() {
        this.board = Array.from({ length: 6 }, () => Array(7).fill(0));
        this.isGameOver = false;
        this.flashActive = false;
        this.selectedSpecial = null;
        this.specials = { 1: { cross: 1, diag: 1, flash: 1 }, 2: { cross: 1, diag: 1, flash: 1 } };

        document.getElementById('discs-container').innerHTML = '';
        document.getElementById('board-container').classList.remove('flash-active');

        document.querySelectorAll('.special-item').forEach(el => {
            el.classList.remove('used', 'selected');
        });

        const showPanels = this.mode === 'aram';
        document.getElementById('inventory-p1').style.display = showPanels ? 'block' : 'none';
        document.getElementById('inventory-p2').style.display = showPanels ? 'block' : 'none';
        this.updateUI();
    }

    selectSpecial(type) {
        if (this.isGameOver || this.specials[this.currentPlayer][type] === 0) return;
        this.selectedSpecial = (this.selectedSpecial === type) ? null : type;
        
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedSpecial) {
            document.getElementById(`p${this.currentPlayer}-exp-${this.selectedSpecial}`).classList.add('selected');
        }
    }


    activateFlash() {
        if (this.isGameOver || this.specials[this.currentPlayer].flash === 0) return;
        this.selectedSpecial = (this.selectedSpecial === 'flash') ? null : 'flash';
        
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedSpecial === 'flash') {
            document.getElementById(`p${this.currentPlayer}-flash`).classList.add('selected');
        }
    }


    async handleMove(col) {
        if (this.isGameOver) return;

        if (this.flashActive) {
            this.flashActive = false;
            document.getElementById('board-container').classList.remove('flash-active');
        }

        const row = this.getAvailableRow(col);
        if (row === -1) return;

        const p = this.currentPlayer;
        const spec = this.selectedSpecial;

        
        const disc = document.createElement('div');
        const isExplosion = spec && spec !== 'flash';
        disc.className = `disc ${isExplosion ? 'special-black' : 'player' + p} ${isExplosion ? 'exp-' + spec : ''}`;
        disc.style.left = `${10 + col * 70}px`;
        disc.style.transform = `translateY(-100px)`;
        document.getElementById('discs-container').appendChild(disc);
        requestAnimationFrame(() => disc.style.transform = `translateY(${10 + row * 70}px)`);

        
        if (isExplosion) {
            
            this.specials[p][spec] = 0;
            document.getElementById(`p${p}-exp-${spec}`).classList.add('used');
            this.selectedSpecial = null;
            document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));

            this.board[row][col] = p;
            disc.setAttribute('data-pos', `${row}-${col}`);

            await new Promise(r => setTimeout(r, 650)); 
            await this.executeExplosion(row, col, spec); 

            
            if (!this.isGameOver) {
                this.currentPlayer = p === 1 ? 2 : 1;
                this.updateUI();
            }

        } else {
            
            this.board[row][col] = p;
            disc.setAttribute('data-pos', `${row}-${col}`);

            if (spec === 'flash') {
                this.specials[p].flash = 0;
                document.getElementById(`p${p}-flash`).classList.add('used');
                this.selectedSpecial = null;
                this.flashActive = true;
            }

            
            const win = this.checkWin();
            if (win) {
                this.handleWin(p); 
            } else if (this.checkDraw()) { 
                this.handleDraw();
            } else {
                this.currentPlayer = p === 1 ? 2 : 1;
                if (this.flashActive) document.getElementById('board-container').classList.add('flash-active');
                this.updateUI();
            }
        }
    }

    async executeExplosion(r, c, type) {
        const color = (this.currentPlayer === 1) ? 'var(--p1-color)' : 'var(--p2-color)';

        let targets = (type === 'cross')
            ? [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
            : [[r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1]];

    
        this.createShockwave(40 + c * 70, 40 + r * 70);

        targets.forEach(([tr, tc]) => {
            if (tr >= 0 && tr < 6 && tc >= 0 && tc < 7) {
                const targetDisc = document.querySelector(`.disc[data-pos="${tr}-${tc}"]`);
                if (targetDisc) {
                    
                    const x = 40 + tc * 70;
                    const y = 40 + tr * 70;

                    
                    this.createParticles(x, y, color);
                    this.createShockwave(x, y);

                    targetDisc.classList.add('exploding');
                    this.board[tr][tc] = 0;
                }
            }
        });

        await new Promise(r => setTimeout(r, 400));
        this.applyGravity();
        await new Promise(r => setTimeout(r, 300));
        const win = this.checkWin();
        if (win) {
            this.handleWin(this.currentPlayer);
        } else if (this.checkDraw()) { 
            this.handleDraw();
        }
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
                for (let [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
                    let count = 1;
                    for (let i = 1; i < 4; i++) {
                        let nr = r + dr * i, nc = c + dc * i;
                        if (nr >= 0 && nr < 6 && nc >= 0 && nc < 7 && this.board[nr][nc] === p) count++; else break;
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
        ['cross', 'diag', 'flash'].forEach(t => {
            document.getElementById(`cnt-p1-${t}`).innerText = `x${this.specials[1][t]}`;
            document.getElementById(`cnt-p2-${t}`).innerText = `x${this.specials[2][t]}`;
        });
    }

    bindEvents() {
        document.getElementById('btn-new-round').onclick = () => this.initRound();
        document.getElementById('btn-modal-reset').onclick = () => {

            document.getElementById('modal').style.display = 'none';
            this.initRound();
        };

        document.getElementById('btn-modal-change-mode').onclick = () => {
            
            this.scores = { 1: 0, 2: 0 };
            
            document.getElementById('modal').style.display = 'none';
            
            document.getElementById('mode-selector').style.display = 'flex';
        };
    }

    handleWin(player) {
        this.isGameOver = true;
        this.scores[player]++;
        this.updateUI();

        const winnerName = (player === 1) ? 'ROUGE' : 'JAUNE';
        const winnerColor = (player === 1) ? 'var(--p1-color)' : 'var(--p2-color)';

        const modalTitle = document.getElementById('modal-title');
        modalTitle.innerHTML = `VICTOIRE PAR COMBO DU JOUEUR <span style="color: ${winnerColor}">${winnerName}</span> !`;

        setTimeout(() => {
            document.getElementById('modal').style.display = 'flex';
        }, 500);
    }

    createParticles(x, y, color) {
        const container = document.getElementById('board-container');
        const particleCount = 12; 

        for (let i = 0; i < particleCount; i++) {
            const p = document.createElement('div');
            p.className = 'particle';

            
            const size = Math.random() * 8 + 4;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.backgroundColor = color;

            
            p.style.left = x + 'px';
            p.style.top = y + 'px';

            container.appendChild(p);

            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            const destinationX = Math.cos(angle) * velocity;
            const destinationY = Math.sin(angle) * velocity;

            
            p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${destinationX}px, ${destinationY}px) scale(0)`, opacity: 0 }
            ], {
                duration: 600 + Math.random() * 400,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            }).onfinish = () => p.remove();
        }
    }

    createShockwave(x, y) {
        const sw = document.createElement('div');
        sw.className = 'shockwave';
        sw.style.left = (x - 30) + 'px'; 
        sw.style.top = (y - 30) + 'px';
        sw.style.width = '60px';
        sw.style.height = '60px';
        document.getElementById('board-container').appendChild(sw);
        setTimeout(() => sw.remove(), 500);
    }

    checkDraw() {
        
        return this.board[0].every(cell => cell !== 0);
    }

    handleDraw() {
        this.isGameOver = true;
        const modalTitle = document.getElementById('modal-title');
        modalTitle.innerHTML = `<span style="color: #cbd5e1">MATCH NUL !</span>`;
        setTimeout(() => {
            document.getElementById('modal').style.display = 'flex';
        }, 500);
    }


}
const game = new ConnectFour();