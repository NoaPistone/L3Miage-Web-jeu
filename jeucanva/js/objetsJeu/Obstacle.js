import Objet from "./Objet.js";
import { cercleRectangleCentre } from "../game/collisions.js";

export default class Obstacle extends Objet {
    constructor(x, y, w, h, couleur, mouvement = null, vitesse = 0, min = null, max = null) {
        super(x, y, w, h, couleur);
        this.mouvement = mouvement;
        this.vitesse = vitesse;
        this.min = min;
        this.max = max;

    }

    update() {
        if (this.mouvement == "horizontal") {
            this.x += this.vitesse;

            if (this.x <= this.min || this.x + this.w >= this.max) {
                this.vitesse *= -1;
            }
        }

        if (this.mouvement == "vertical") {
            this.y += this.vitesse;

            if (this.y <= this.min || this.y + this.h >= this.max) {
                this.vitesse *= -1;
            }
        }
    }

    
    draw(ctx) {
        ctx.save();
       
        ctx.translate(this.x, this.y);

        const w = this.w;
        const h = this.h;
        const time = Date.now() * 0.002;

     
        const neonViolet = '#bd00ff';      
        const neonLightViolet = '#e6b3ff'; 
        const neonGlowColor = 'rgba(189, 0, 255, 0.7)';

        let bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#10002b'); 
        bgGrad.addColorStop(1, '#000000');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; 
        ctx.strokeRect(1, 1, w - 2, h - 2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';      
        ctx.strokeRect(3, 3, w - 6, h - 6);

        
        ctx.shadowBlur = 25; 
        ctx.shadowColor = neonViolet;

        ctx.strokeStyle = neonLightViolet; 
        ctx.lineWidth = 4;

        
        ctx.strokeRect(0, 0, w, h);

       
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(189, 0, 255, 0.2)'; 

        
        const tubeSpacing = Math.max(h / 4, 10);
        ctx.beginPath();
        for (let y = tubeSpacing; y < h; y += tubeSpacing) {
            ctx.moveTo(w * 0.1, y);
            ctx.lineTo(w * 0.9, y);
        }
        ctx.stroke();

        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(w * 0.1, h * 0.1);
        ctx.lineTo(w * 0.3, h * 0.3);
        ctx.stroke();

        ctx.restore();
    }

    estAtteint(joueur) {
        let cx = this.x + this.w / 2;
        let cy = this.y + this.h / 2;
        return cercleRectangleCentre(cx, cy, this.w, this.h, joueur.x, joueur.y, joueur.size / 2);
    }


}