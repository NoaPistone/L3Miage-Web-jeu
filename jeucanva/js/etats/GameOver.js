import Bouton from "../utils/Bouton.js";

export default class GameOver {
  constructor(canvas, ctx, jeux) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.jeux = jeux;


    let x = (canvas.width - 260) / 2;
    let y = 260;
    this.btnRejouer = new Bouton(x, y, 260, 70, "Rejouer", () => {
      this.jeux.init();
      this.jeux.demarrerTimer();
      this.jeux.etat = "JEU EN COURS";
    });
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
    this.ctx.fillText("Game Over", this.canvas.width / 2, 150);

    this.ctx.shadowBlur = 0;
    this.btnRejouer.draw(this.ctx);
    this.ctx.restore();
  }


  handleClick(mx, my) {
    this.btnRejouer.handleClick(mx, my);
  }
}
