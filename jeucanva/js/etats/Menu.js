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
        this.ctx.fillStyle = "#050505";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        this.ctx.lineWidth = 1;
        const gridSize = 50;
        this.ctx.beginPath();
        for (let x = 0; x <= this.canvas.width; x += gridSize) {
            this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height);
        }
        for (let y = 0; y <= this.canvas.height; y += gridSize) {
            this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y);
        }
        this.ctx.stroke();
        this.ctx.font = "bold 50px 'Bungee', sans-serif";
        this.ctx.textAlign = "center";
       
        this.ctx.shadowColor = "#00ffff";
        this.ctx.shadowBlur = 15;
        this.ctx.fillStyle = "#ffffff"; 
        this.ctx.fillText("NEON ESCAPE", this.canvas.width / 2, 180);

        this.ctx.shadowBlur = 0;
        this.ctx.strokeStyle = "#00ffff";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2 - 100, 200);
        this.ctx.lineTo(this.canvas.width / 2 + 100, 200);
        this.ctx.stroke();
        this.ctx.restore();

        if (this.boutonJouer) {
            this.boutonJouer.draw(this.ctx);
        }
    }

    handleClick(event) {
        if (this.jeux.etat !== "MENU D'ACCUEIL") return;

        let rect = this.canvas.getBoundingClientRect();
        let mx = (event.clientX - rect.left) * (this.canvas.width / rect.width);
        let my = (event.clientY - rect.top) * (this.canvas.height / rect.height);

        this.boutonJouer.handleClick(mx, my);
    }
}