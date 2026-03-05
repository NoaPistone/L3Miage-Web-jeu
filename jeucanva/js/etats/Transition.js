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
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";

        this.ctx.font = "40px Bungee";
        this.ctx.fillText(`Niveau ${this.jeux.niveau} terminé !`, this.canvas.width / 2, 150);
        this.ctx.font = "24px Bungee";
        this.ctx.fillText(`Score : ${this.jeux.score}`, this.canvas.width / 2, 250);
        this.ctx.fillText(`Temps : ${this.jeux.tempsNiveau.toFixed(1)} secondes`, this.canvas.width / 2, 300);
        this.ctx.fillText(`Vies restantes : ${this.jeux.vies}`, this.canvas.width / 2, 350);
        this.btnContinuer.draw(this.ctx);

        this.ctx.restore();
    }

    handleClick(mx, my) {
        this.btnContinuer.handleClick(mx, my);
    }
}