import Objet from "./Objet.js";
import { cercleCollision } from "../collisions.js";


export default class Piece extends Objet {
    constructor(x,y,w,h,couleur) {
        super(x,y,w,h,couleur);
        this.size = w;
        this.radius = w / 2;   

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.couleur;
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
    }



    estAtteint(joueur) {
        return cercleCollision(this,joueur);
    }


}