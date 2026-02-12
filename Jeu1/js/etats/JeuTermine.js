export default class JeuTermine {
    constructor(canvas, ctx, jeux) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.jeux = jeux;
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
        this.ctx.fillText(
            `Score final : ${this.jeux.score}`,
            w / 2,
            h / 2 -50 //+30
        );

        this.ctx.fillText(
            `Vies restantes : ${this.jeux.vies}`,
            w / 2,
            h / 2 - 5 //+75
        );

        ctx.fillText(
            `Temps du dernier niveau : ${this.jeux.getTempsActuel()} s`,
            w / 2,
            h / 2 + 40 //120
        );


        // Bouton Rejouer
        w = 260;
        h = 70;
        let x = (this.canvas.width - w) / 2;
        let y = 400;
        this.btnRejouer = { x, y, w, h };
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 28px Bungee";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Rejouer", this.canvas.width / 2, y + h / 2);
        this.ctx.restore();
    }

    handleClick(mx, my) {
        let b = this.btnRejouer;
        let inside =
            mx >= b.x && mx <= b.x + b.w &&
            my >= b.y && my <= b.y + b.h;

        if (inside) {
            this.jeux.init();
            this.jeux.etat = "JEU EN COURS";
        }
    }
}
