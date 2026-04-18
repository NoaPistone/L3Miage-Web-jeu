import Bouton from "../utils/Bouton.js";

export default class JeuTermine {
    constructor(canvas, ctx, jeux) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.jeux = jeux;

        let x = (canvas.width - 260) / 2;
        let y = 400;
        this.btnRejouer = new Bouton(x, y, 260, 70, "Rejouer", () => {
            this.jeux.init();
            this.jeux.demarrerTimer();
            this.jeux.etat = "JEU EN COURS";
        });
    }

    envoyerScore() {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('https://projetswebmiagel3.onrender.com/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ jeu: 'jeu1', score: this.jeux.score })
        });
    }


    draw() {
        let ctx = this.ctx;
        let w = this.jeux.canvas.width;
        let h = this.jeux.canvas.height;

        this.ctx.save();

    
        this.ctx.fillStyle = "#050505";
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.strokeStyle = "rgba(0, 255, 150, 0.08)";
        this.ctx.lineWidth = 0.5;
        const gridSize = 40;
        this.ctx.beginPath();
        for (let x = 0; x <= w; x += gridSize) {
            this.ctx.moveTo(x, 0); this.ctx.lineTo(x, h);
        }
        for (let y = 0; y <= h; y += gridSize) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(w, y);
        }
        this.ctx.stroke();

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        
        this.ctx.font = "bold 45px 'Bungee', sans-serif";
        this.ctx.shadowColor = "#00ffaa";
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = "#ffffff";
        this.ctx.fillText("MISSION COMPLETE", w / 2, h / 2 - 180);
        this.ctx.shadowBlur = 0;
        this.ctx.font = "18px 'Bungee', sans-serif";
        this.ctx.fillStyle = "#00ffaa"; 
        const statsY = h / 2 - 40;
        this.ctx.fillText(`SCORE FINAL : ${this.jeux.score}`, w / 2, statsY);

        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "14px 'Bungee', sans-serif";
        this.ctx.fillText(`VIES RESTANTES : ${this.jeux.vies}`, w / 2, statsY + 40);
        this.ctx.fillText(`TEMPS DERNIER NIVEAU : ${this.jeux.getTempsActuel()}S`, w / 2, statsY + 70);

        
        this.ctx.strokeStyle = "rgba(0, 255, 150, 0.5)";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(w / 2 - 100, statsY - 20);
        this.ctx.lineTo(w / 2 + 100, statsY - 20);
        this.ctx.stroke();

        
        this.ctx.restore();

        if (this.btnRejouer) {
            this.btnRejouer.x = w / 2 - (this.btnRejouer.w / 2);
            this.btnRejouer.y = h / 2 + 120;
            this.btnRejouer.draw(ctx);
        }
    }

    handleClick(mx, my) {
        this.btnRejouer.handleClick(mx, my);
    }
}
