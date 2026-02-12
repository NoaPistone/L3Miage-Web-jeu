import Objet from "./Objet.js";
import { cercleRectangleCentre } from "../collisions.js";

export default class Obstacle extends Objet {
    constructor(x,y,w,h,couleur,mouvement = null,vitesse = 0,min = null,max = null) {
        super(x,y,w,h,couleur);
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
        ctx.fillStyle = this.couleur;
        ctx.fillRect(this.x,this.y,this.w,this.h);
        ctx.restore();
    }

    estAtteint(joueur) {
        let cx = this.x + this.w/2;
        let cy = this.y + this.h/2;
        return cercleRectangleCentre(cx, cy, this.w, this.h, joueur.x, joueur.y, joueur.size/2);
    }


}