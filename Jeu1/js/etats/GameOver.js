export default class GameOver {
  constructor(canvas, ctx, jeux) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.jeux = jeux;

    this.btnRejouer = { x: 0, y: 0, w: 0, h: 0 };
  }

  draw() {
    this.ctx.save();
    let grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    grad.addColorStop(0, "#7ae3df");
    grad.addColorStop(1, "#fad0c4");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "white";
    this.ctx.font = "bold 50px 'Verdana', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.shadowColor = "rgba(0,0,0,0.5)";
    this.ctx.shadowBlur = 10;
    this.ctx.fillText("Game Over", this.canvas.width / 2, 150);

    // Bouton Rejouer
    const w = 260;
    const h = 70;
    const x = (this.canvas.width - w) / 2;
    const y = 260;
    this.btnRejouer = { x, y, w, h };
    this.ctx.shadowBlur = 0;
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(x, y, w, h);
    this.ctx.fillStyle = "black";
    this.ctx.font = "bold 28px Verdana";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText("Rejouer", this.canvas.width / 2, y + h / 2);
    this.ctx.restore();
  }

  handleClick(mx, my) {
    const b = this.btnRejouer;
    const inside =
      mx >= b.x && mx <= b.x + b.w &&
      my >= b.y && my <= b.y + b.h;

    if (inside) {
      this.jeux.init();
      this.jeux.etat = "JEU EN COURS";
    }
  }
}
