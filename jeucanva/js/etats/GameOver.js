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

  envoyerScore() {
    const token = localStorage.getItem('token');
    if (!token) return;
    fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ jeu: 'jeu1', score: this.jeux.score })
    });
  }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "#050000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "rgba(255, 0, 0, 0.05)";
    this.ctx.lineWidth = 0.5;
    const gridSize = 30;
    this.ctx.beginPath();
    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.moveTo(x, 0); this.ctx.lineTo(x, this.canvas.height);
    }
    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.moveTo(0, y); this.ctx.lineTo(this.canvas.width, y);
    }
    this.ctx.stroke();

    this.ctx.shadowBlur = 0; 
    this.ctx.textAlign = "center";

    
    this.ctx.font = "bold 42px 'Bungee', sans-serif";
    this.ctx.fillStyle = "#ffffff";
    this.ctx.fillText("GAME OVER", this.canvas.width / 2, 200);

    
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.lineWidth = 1;
    this.ctx.strokeText("GAME OVER", this.canvas.width / 2, 200);

    
    const lineY = 220;
    this.ctx.shadowColor = "#ff0000";
    this.ctx.shadowBlur = 5;
    this.ctx.strokeStyle = "#ff0000";
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width / 2 - 80, lineY);
    this.ctx.lineTo(this.canvas.width / 2 + 80, lineY);
    this.ctx.stroke();

    this.ctx.restore();

    
    if (this.btnRejouer) {
      this.btnRejouer.x = this.canvas.width / 2 - (this.btnRejouer.w / 2);
      this.btnRejouer.y = 280; 
      this.btnRejouer.draw(this.ctx);
    }
  }


  handleClick(mx, my) {
    this.btnRejouer.handleClick(mx, my);
  }
}
