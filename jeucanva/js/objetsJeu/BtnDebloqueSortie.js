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
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.fillStyle = this.couleur;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
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