import Objet from "./Objet.js";

export default class Ennemi extends Objet {
    constructor(x, y, w = 30, h = 30, couleur = "red", zone = 150, vitesse = 3) {
        super(x, y, w, h, couleur);

        this.baseX = x;
        this.baseY = y;

        this.zone = zone;
        this.vitesse = vitesse;
        this.actif = false;
    }

    update(joueur) {
        let dx = joueur.x - this.x;
        let dy = joueur.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        this.actif = dist < this.zone;

        if (this.actif) {
            let nx = dx / (dist || 1);
            let ny = dy / (dist || 1);

            this.x += nx * this.vitesse;
            this.y += ny * this.vitesse;


            this.angle = Math.atan2(ny, nx);
        }
    }

    estAtteint(joueur) {
        return (joueur.x + joueur.size / 2 > this.x - this.w / 2 && joueur.x - joueur.size / 2 < this.x + this.w / 2 && joueur.y + joueur.size / 2 > this.y - this.h / 2 && joueur.y - joueur.size / 2 < this.y + this.h / 2);
    }

    reset() {
        this.x = this.baseX;
        this.y = this.baseY;
        this.angle = 0;
        this.actif = false;
    }

   

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const w = this.w;
        const h = this.h;
        const time = Date.now() * 0.005;

       
        const flicker = Math.sin(time * 2) * 5;
        let thrustGrad = ctx.createLinearGradient(-w, 0, -w / 2, 0);
        thrustGrad.addColorStop(0, 'transparent');
        thrustGrad.addColorStop(1, '#ff4d00'); 

        ctx.fillStyle = thrustGrad;
        ctx.beginPath();
        ctx.moveTo(-w / 2, -h / 4);
        ctx.lineTo(-w - flicker, 0);
        ctx.lineTo(-w / 2, h / 4);
        ctx.fill();

       
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ff0000'; 

        let bodyGrad = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
        bodyGrad.addColorStop(0, '#600');
        bodyGrad.addColorStop(1, '#f00'); 

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(w / 2, 0);              
        ctx.lineTo(0, -h / 2);             
        ctx.lineTo(-w / 2, 0);             
        ctx.lineTo(0, h / 2);            
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff'; 
        ctx.fillRect(w * 0.1, -1, w * 0.2, 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke(); 

        ctx.restore();
    }
}
