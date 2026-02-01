import Objet from "./Objet.js";
import { cercleRectangleCentre } from "./collisions.js";

export default class Sortie extends Objet {
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
        return cercleRectangleCentre(this.x + this.w / 2,this.y + this.h / 2,this.w,this.h,joueur.x,joueur.y,joueur.size / 2);
    }
}