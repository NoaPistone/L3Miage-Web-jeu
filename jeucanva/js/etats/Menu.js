import Bouton from "../utils/Bouton.js";


export default class Menu {
    constructor(canvas, ctx, jeux) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.jeux = jeux;

        let x = canvas.width / 2 - 150;
        let y = 300;
        this.bouton = { x: this.canvas.width / 2 - 150, y: 300, w: 300, h: 60 };
        this.boutonJouer = new Bouton(x, y, 300, 60, "DÉMARRER", () => {
            this.jeux.init();
            this.jeux.demarrerTimer();
            this.jeux.etat = "JEU EN COURS";
        });
        this.onClick = this.handleClick.bind(this);
        canvas.addEventListener("click", this.onClick);
    }


    draw() {
        this.ctx.save();

        let grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, "#7ae3df");
        grad.addColorStop(1, "#fad0c4");
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 60px 'Bungee', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = "rgba(0,0,0,0.5)";
        this.ctx.shadowBlur = 25;
        this.ctx.fillText("JEU CANVAS", this.canvas.width / 2, 150);
        this.ctx.fillStyle = "#b968d3";
        this.ctx.shadowBlur = 0;
        this.boutonJouer.draw(this.ctx);
        this.ctx.restore();
    }

    handleClick(event) {
        if (this.jeux.etat !== "MENU D'ACCUEIL") return;

        let rect = this.canvas.getBoundingClientRect();
        let mx = (event.clientX - rect.left) * (this.canvas.width / rect.width);
        let my = (event.clientY - rect.top) * (this.canvas.height / rect.height);

        this.boutonJouer.handleClick(mx, my);
    }
}