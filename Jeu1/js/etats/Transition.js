export default class Transition {
    constructor(canvas, ctx, jeux) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.jeux = jeux;
    }

    draw() {
        this.ctx.save();

        
        this.ctx.fillStyle = "rgba(0,0,0,0.8)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";

        this.ctx.font = "40px Bungee";
        this.ctx.fillText(
            `Niveau ${this.jeux.niveau - 1} terminé !`,
            this.canvas.width / 2,
            150
        );

        this.ctx.font = "24px Bungee";
        this.ctx.fillText(
            `Score : ${this.jeux.score}`,
            this.canvas.width / 2,
            250
        );

        this.ctx.fillText(
            `Temps : ${this.jeux.tempsNiveau.toFixed(1)} s`,
            this.canvas.width / 2,
            300
        );

        this.ctx.fillText(
            `Vies restantes : ${this.jeux.vies}`,
            this.canvas.width / 2,
            350
        );
        
        /*this.ctx.font = "20px Bungee";
        this.ctx.fillText(
            "Clique pour continuer",
            this.canvas.width / 2,
            450
        );*/

        // Bouton Continuer
        let w = 260;
        let h = 70;
        let x = (this.canvas.width - w) / 2;
        let y = 400;
        this.btnContinuer= { x, y, w, h };
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(x, y, w, h);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 3;
        this.ctx.strokeRect(x, y, w, h);
        this.ctx.fillStyle = "black";
        this.ctx.font = "bold 28px Bungee";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Continuer", this.canvas.width / 2, y + h / 2);

        this.ctx.restore();
    }

    handleClick(mx, my) {
        let b = this.btnContinuer;
        let inside =
            mx >= b.x && mx <= b.x + b.w &&
            my >= b.y && my <= b.y + b.h;

        if (inside) {
            this.jeux.objetNiveau(this.jeux.niveau);
            this.jeux.joueur.x = 30;
            this.jeux.joueur.y = 30;
            this.jeux.demarrerTimer();
            this.jeux.etat = "JEU EN COURS";
        }
    }


}