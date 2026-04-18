export class UI {
    static initGrid(handleMoveCallback) {
        const maskHoles = document.getElementById('mask-holes');
        const clickGrid = document.getElementById('click-grid');
        maskHoles.innerHTML = ''; clickGrid.innerHTML = '';
        for (let c = 0; c < 7; c++) {
            const colEl = document.createElement('div');
            colEl.onclick = () => handleMoveCallback(c);
            clickGrid.appendChild(colEl);
            for (let r = 0; r < 6; r++) {
                const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", 40 + c * 70); circle.setAttribute("cy", 40 + r * 70);
                circle.setAttribute("r", 30); circle.setAttribute("fill", "black");
                maskHoles.appendChild(circle);
            }
        }
    }

    static updateScores(scores, currentPlayer) {
        document.getElementById('p1-wins').innerText = scores[1];
        document.getElementById('p2-wins').innerText = scores[2];
        document.getElementById('p1-score-card').classList.toggle('active', currentPlayer === 1);
        document.getElementById('p2-score-card').classList.toggle('active', currentPlayer === 2);
    }

    static updateSpecials(specials) {
        ['cross', 'diag', 'flash'].forEach(t => {
            document.getElementById(`cnt-p1-${t}`).innerText = `x${specials[1][t]}`;
            document.getElementById(`cnt-p2-${t}`).innerText = `x${specials[2][t]}`;
        });
    }

    static createParticles(x, y, color) {
        const container = document.getElementById('board-container');
        for (let i = 0; i < 12; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = Math.random() * 8 + 4;
            p.style.width = p.style.height = size + 'px';
            p.style.backgroundColor = color;
            p.style.left = x + 'px'; p.style.top = y + 'px';
            container.appendChild(p);
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 100 + 50;
            p.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) scale(0)`, opacity: 0 }
            ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0, .9, .57, 1)', fill: 'forwards' }).onfinish = () => p.remove();
        }
    }

    static createShockwave(x, y) {
        const sw = document.createElement('div');
        sw.className = 'shockwave';
        sw.style.left = (x - 30) + 'px'; sw.style.top = (y - 30) + 'px';
        document.getElementById('board-container').appendChild(sw);
        setTimeout(() => sw.remove(), 500);
    }

    static redraw(board) {
        const container = document.getElementById('discs-container');
        container.innerHTML = '';
        board.forEach((row, r) => row.forEach((p, c) => {
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
}