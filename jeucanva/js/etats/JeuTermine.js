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

    draw() {
        let ctx = this.ctx;
        let w = this.jeux.canvas.width;
        let h = this.jeux.canvas.height;

        this.ctx.save();


        let grad = this.ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#0f2027");
        grad.addColorStop(0.5, "#203a43");
        grad.addColorStop(1, "#2c5364");

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";


        this.ctx.font = "60px Bungee";
        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = "rgba(0,0,0,0.7)";
        this.ctx.shadowBlur = 20;

        this.ctx.fillText(" JEU TERMINÉ ", w / 2, h / 2 - 200);


        this.ctx.shadowBlur = 0;
        this.ctx.font = "22px Bungee";
        this.ctx.fillStyle = "#dddddd";
        this.ctx.fillText(`Score final : ${this.jeux.score}`, w / 2, h / 2 - 50);
        this.ctx.fillText(`Vies restantes : ${this.jeux.vies}`, w / 2, h / 2 - 5);
        ctx.fillText(`Temps du dernier niveau : ${this.jeux.getTempsActuel()} s`, w / 2, h / 2 + 40);
        this.btnRejouer.draw(ctx);
        this.ctx.restore();
    }


    handleClick(mx, my) {
        this.btnRejouer.handleClick(mx, my);
    }
}
