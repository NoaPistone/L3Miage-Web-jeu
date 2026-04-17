import Objet from "./Objet.js";
import { cercleCollision } from "../game/collisions.js";


export default class Piece extends Objet {
    constructor(x, y, w, h, couleur) {
        super(x, y, w, h, couleur);
        this.size = w;
        this.radius = w / 2;

    }

    

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const radius = this.size / 2;
        const time = Date.now() * 0.005;

       
        const cyanCore = '#ffffff';         
        const cyanLight = '#00ffff';        
        const cyanDark = '#008b8b';         
        const cyanGlow = 'rgba(0, 255, 255, 0.8)';

       
        ctx.shadowBlur = 20;
        ctx.shadowColor = cyanGlow;

        
        let grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
        grad.addColorStop(0, cyanCore);       
        grad.addColorStop(0.4, cyanLight);    
        grad.addColorStop(1, cyanDark);        

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'; 
        ctx.lineWidth = 1.5;

        
        const pulse = Math.sin(time) * 1.5; 
        const innerSize = (radius * 0.35) + pulse;

        ctx.beginPath();
       
        ctx.rect(-innerSize / 2, -innerSize / 2, innerSize, innerSize);

       
        const armLength = radius * 0.6;
        ctx.moveTo(-innerSize / 2, 0); ctx.lineTo(-armLength, 0);
        ctx.moveTo(innerSize / 2, 0); ctx.lineTo(armLength, 0);  
        ctx.moveTo(0, -innerSize / 2); ctx.lineTo(0, -armLength); 
        ctx.moveTo(0, innerSize / 2); ctx.lineTo(0, armLength); 
        ctx.stroke();

        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
       
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.8, -Math.PI / 4, -Math.PI * 0.75, true);
        ctx.fill();

        ctx.restore();
    }

    estAtteint(joueur) {
        return cercleCollision(this, joueur);
    }


}