import { Game } from './Game.js';
import { UI } from './UI.js';

class ConnectFour {
    constructor() {
        this.game = new Game();
        this.selectedSpecial = null;
        this.flashActive = false;

        UI.initGrid((c) => this.handleMove(c));
        this.bindEvents();
        this.updateGlobalUI();
    }

    bindEvents() {

        document.getElementById('btn-new-round').onclick = () => this.initRound();
        document.getElementById('btn-modal-reset').onclick = () => {
            document.getElementById('modal').style.display = 'none';
            this.initRound();
        };
        document.getElementById('btn-modal-change-mode').onclick = () => {
            this.game.scores = { 1: 0, 2: 0 };
            document.getElementById('modal').style.display = 'none';
            document.getElementById('mode-selector').style.display = 'flex';
        };


        document.getElementById('btn-mode-classic').onclick = () => this.setMode('classic');
        document.getElementById('btn-mode-aram').onclick = () => this.setMode('aram');


        document.querySelectorAll('.special-item').forEach(el => {
            el.onclick = () => {
                const type = el.id.split('-').pop();
                if (type === 'flash') this.activateFlash();
                else this.selectSpecial(type);
            };
        });
    }

    setMode(m) {
        this.game.mode = m;
        document.getElementById('mode-selector').style.display = 'none';
        const displayEl = document.getElementById('mode-display');
        displayEl.innerHTML = (m === 'aram') ? 'Mode: <span style="color: #10b981;">SPECIAL</span>' : 'Mode: CLASSIQUE';
        this.initRound();
    }

    initRound() {
        this.game.resetBoard();
        this.flashActive = false;
        this.selectedSpecial = null;
        document.getElementById('discs-container').innerHTML = '';
        document.getElementById('board-container').classList.remove('flash-active');
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('used', 'selected'));

        const showPanels = this.game.mode === 'aram';
        document.getElementById('inventory-p1').style.display = showPanels ? 'block' : 'none';
        document.getElementById('inventory-p2').style.display = showPanels ? 'block' : 'none';

        this.updateGlobalUI();
    }

    selectSpecial(type) {
        if (this.game.isGameOver || this.game.specials[this.game.currentPlayer][type] === 0) return;
        this.selectedSpecial = (this.selectedSpecial === type) ? null : type;
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedSpecial) {
            document.getElementById(`p${this.game.currentPlayer}-exp-${type}`).classList.add('selected');
        }
    }

    activateFlash() {
        if (this.game.isGameOver || this.game.specials[this.game.currentPlayer].flash === 0) return;
        this.selectedSpecial = (this.selectedSpecial === 'flash') ? null : 'flash';
        document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));
        if (this.selectedSpecial === 'flash') {
            document.getElementById(`p${this.game.currentPlayer}-flash`).classList.add('selected');
        }
    }

    async handleMove(col) {
        if (this.game.isGameOver) return;
        if (this.flashActive) {
            this.flashActive = false;
            document.getElementById('board-container').classList.remove('flash-active');
        }

        const row = this.game.getAvailableRow(col);
        if (row === -1) return;

        const p = this.game.currentPlayer;
        const spec = this.selectedSpecial;

        const disc = document.createElement('div');
        const isExplosion = spec && spec !== 'flash';
        disc.className = `disc ${isExplosion ? 'special-black' : 'player' + p} ${isExplosion ? 'exp-' + spec : ''}`;
        disc.style.left = `${10 + col * 70}px`;
        disc.style.transform = `translateY(-100px)`;
        document.getElementById('discs-container').appendChild(disc);

        requestAnimationFrame(() => disc.style.transform = `translateY(${10 + row * 70}px)`);

        if (isExplosion) {
            this.game.specials[p][spec] = 0;
            document.getElementById(`p${p}-exp-${spec}`).classList.add('used');
            this.selectedSpecial = null;
            document.querySelectorAll('.special-item').forEach(el => el.classList.remove('selected'));

            this.game.board[row][col] = p;
            disc.setAttribute('data-pos', `${row}-${col}`);

            await new Promise(r => setTimeout(r, 650));
            await this.executeExplosion(row, col, spec);

            if (!this.game.isGameOver) {
                this.game.currentPlayer = p === 1 ? 2 : 1;
                this.updateGlobalUI();
            }
        } else {
            this.game.board[row][col] = p;
            disc.setAttribute('data-pos', `${row}-${col}`);

            if (spec === 'flash') {
                this.game.specials[p].flash = 0;
                document.getElementById(`p${p}-flash`).classList.add('used');
                this.selectedSpecial = null;
                this.flashActive = true;
            }

            const winner = this.game.checkWin(); 

            if (winner !== 0) {
                
                setTimeout(() => {
                    this.handleWin(winner); 
                }, 1000);

            } else if (this.game.checkDraw()) {
                setTimeout(() => {
                    this.handleDraw();
                }, 1000);

            } else {
                this.game.currentPlayer = p === 1 ? 2 : 1;
                if (this.flashActive) document.getElementById('board-container').classList.add('flash-active');
                this.updateGlobalUI();
            }
        }
    }

    async executeExplosion(r, c, type) {
        const color = (this.game.currentPlayer === 1) ? 'var(--p1-color)' : 'var(--p2-color)';
        let targets = (type === 'cross')
            ? [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
            : [[r - 1, c - 1], [r - 1, c + 1], [r + 1, c - 1], [r + 1, c + 1]];

        UI.createShockwave(40 + c * 70, 40 + r * 70);

        targets.forEach(([tr, tc]) => {
            if (tr >= 0 && tr < 6 && tc >= 0 && tc < 7) {
                const targetDisc = document.querySelector(`.disc[data-pos="${tr}-${tc}"]`);
                if (targetDisc) {
                    UI.createParticles(40 + tc * 70, 40 + tr * 70, color);
                    UI.createShockwave(40 + tc * 70, 40 + tr * 70);
                    targetDisc.classList.add('exploding');
                    this.game.board[tr][tc] = 0;
                }
            }
        });

        await new Promise(r => setTimeout(r, 400));
        this.game.applyGravity();
        UI.redraw(this.game.board);
        await new Promise(r => setTimeout(r, 300));

        const winner = this.game.checkWin(); 

        if (winner !== 0) {
            setTimeout(() => {
                this.handleWin(winner);
            }, 1200);
        } else if (this.game.checkDraw()) {
            setTimeout(() => {
                this.handleDraw();
            }, 1000);
        } else {

            this.game.currentPlayer = this.game.currentPlayer === 1 ? 2 : 1;
            this.updateGlobalUI();
        }
    }

    handleWin(player) {
        this.game.isGameOver = true;
        this.game.scores[player]++;
        this.updateGlobalUI();
        const winnerName = (player === 1) ? 'ROUGE' : 'JAUNE';
        const modalTitle = document.getElementById('modal-title');
        modalTitle.innerHTML = `VICTOIRE DU JOUEUR <span style="color: var(--p${player}-color)">${winnerName}</span> !`;
        setTimeout(() => document.getElementById('modal').style.display = 'flex', 500);
    }

    handleDraw() {
        this.game.isGameOver = true;
        document.getElementById('modal-title').innerHTML = `<span style="color: #cbd5e1">MATCH NUL !</span>`;
        setTimeout(() => document.getElementById('modal').style.display = 'flex', 500);
    }

    updateGlobalUI() {
        UI.updateScores(this.game.scores, this.game.currentPlayer);
        UI.updateSpecials(this.game.specials);
    }
}

new ConnectFour();