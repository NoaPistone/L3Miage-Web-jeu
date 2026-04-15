import { chargerNiveau } from "../game/niveaux.js";
import Bouton from "../utils/Bouton.js";

export default class Transition {
    constructor(canvas, ctx, jeux) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.jeux = jeux;

        let x = (canvas.width - 260) / 2;
        let y = 400;
        this.btnContinuer = new Bouton(x, y, 260, 70, "Continuer", () => {
            this.jeux.niveau++;
            chargerNiveau(this.jeux, this.jeux.niveau);
            this.jeux.joueur.reset(50, 50);
            this.jeux.demarrerTimer();
            this.jeux.etat = "JEU EN COURS";
        });
    }

    

    draw() {
    this.ctx.save();
    let bgGrad = this.ctx.createRadialGradient(
        this.canvas.width / 2, this.canvas.height / 2, 0,
        this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
    );
    bgGrad.addColorStop(0, "rgba(20, 40, 60, 0.95)"); 
    bgGrad.addColorStop(1, "rgba(0, 0, 0, 0.98)");
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 2;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = "#00ffff";
    this.ctx.strokeStyle = "rgba(0, 255, 255, 0.3)";
    
    const centerX = this.canvas.width / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - 180, 0);
    this.ctx.lineTo(centerX - 180, this.canvas.height);
    this.ctx.moveTo(centerX + 180, 0);
    this.ctx.lineTo(centerX + 180, this.canvas.height);
    this.ctx.stroke();

    this.ctx.textAlign = "center";
    this.ctx.font = "italic 40px 'Bungee', sans-serif";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.shadowBlur = 20;
    this.ctx.fillText(`NIVEAU ${this.jeux.niveau} FINI`, centerX, 150);
    this.ctx.shadowBlur = 0;
    this.ctx.font = "20px 'Bungee', sans-serif";
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    this.ctx.fillText(`SCORE : ${this.jeux.score}`, centerX, 260);
    
    this.ctx.font = "16px 'Bungee', sans-serif";
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    this.ctx.fillText(`${this.jeux.tempsNiveau.toFixed(1)} SECONDES`, centerX, 310);
    this.ctx.fillText(`${this.jeux.vies} VIES RESTANTES`, centerX, 350);
    this.ctx.fillStyle = "#00ffff";
    this.ctx.fillRect(centerX - 40, 275, 80, 3);
    this.ctx.restore();

    if (this.btnContinuer) {
        this.btnContinuer.x = this.canvas.width / 2 - (this.btnContinuer.w / 2);
        this.btnContinuer.y = 430;
        this.btnContinuer.draw(this.ctx);
    }
}

    handleClick(mx, my) {
        this.btnContinuer.handleClick(mx, my);
    }
}