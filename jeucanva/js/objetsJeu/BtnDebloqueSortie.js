import Objet from "./Objet.js";
import { cercleRectangleCentre } from "../game/collisions.js";

export default class BtnDebloqueSortie extends Objet {
    constructor(x, y, w, h, couleur) {
        super(x, y, w, h, couleur);
        this.actif = true;
    }

    draw(ctx) {
        if (!this.actif) {
            return;
        }
        ctx.save();
        ctx.translate(this.x, this.y);

        const w = this.w;
        const h = this.h;
        let baseGrad = ctx.createLinearGradient(0, 0, w, h);
        baseGrad.addColorStop(0, '#333');
        baseGrad.addColorStop(1, '#111');

        ctx.fillStyle = baseGrad;
        
        const r = 5;
        ctx.beginPath();
        ctx.roundRect(0, 0, w, h, r);
        ctx.fill();

        
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, w - 4, h - 4);

        
        const padding = 8;
        const btnW = w - (padding * 2);
        const btnH = h - (padding * 2);

       
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#00ff88';

        
        
        let btnGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, btnW);
        btnGrad.addColorStop(0, '#eeffcc'); 
        btnGrad.addColorStop(0.5, '#00ff88'); 
        btnGrad.addColorStop(1, '#004422');  

        ctx.fillStyle = btnGrad;
        ctx.beginPath();
        ctx.roundRect(padding, padding, btnW, btnH, 3);
        ctx.fill();

        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding + 5, h / 2);
        ctx.lineTo(w - padding - 5, h / 2);
        ctx.stroke();

        ctx.restore();
    }

    estAtteint(joueur) {
        if (!this.actif) {
            return false;
        }
        let cx = this.x + this.w / 2;
        let cy = this.y + this.h / 2;
        return cercleRectangleCentre(cx, cy, this.w, this.h, joueur.x, joueur.y, joueur.size / 2);
    }

    desactiver() {
        this.actif = false;
    }

}