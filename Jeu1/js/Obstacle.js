import Objet from "./Objet.js";
import { cercleRectangleCentre } from "./collisions.js";

export default class Obstacle extends Objet {
    constructor(x,y,w,h,couleur) {
        super(x,y,w,h,couleur);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.restore();
    }

    estAtteint(joueur) {
        // rx, ry = centre du rectangle
        const cx = this.x + this.w/2;
        const cy = this.y + this.h/2;
        return cercleRectangleCentre(cx, cy, this.w, this.h, joueur.x, joueur.y, joueur.size/2);
    }


}