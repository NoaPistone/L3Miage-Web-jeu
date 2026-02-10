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

        // 🎨 Fond dégradé
        let grad = this.ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "#0f2027");
        grad.addColorStop(0.5, "#203a43");
        grad.addColorStop(1, "#2c5364");

        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, w, h);

        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        // ✨ Titre avec effet glow
        this.ctx.font = "60px Bungee";
        this.ctx.fillStyle = "white";
        this.ctx.shadowColor = "rgba(0,0,0,0.7)";
        this.ctx.shadowBlur = 20;

        this.ctx.fillText(" JEU TERMINÉ ", w / 2, h / 2 - 100);

        // Désactiver le glow pour le reste
        this.ctx.shadowBlur = 0;


        // 📊 Petit récap (optionnel mais stylé)
        this.ctx.font = "22px Bungee";
        this.ctx.fillStyle = "#dddddd";
        this.ctx.fillText(
            `Score final : ${this.jeux.score}`,
            w / 2,
            h / 2 + 20
        );

        this.ctx.fillText(
            `Vies restantes : ${this.jeux.vies}`,
            w / 2,
            h / 2 + 65
        );

        ctx.fillText(
            `Temps du dernier niveau : ${this.jeux.getTempsActuel()} s`,
            w / 2,
            h / 2 + 110
        );


        this.ctx.restore();
    }
}
