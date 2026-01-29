export default class ObjetGraphique {
    constructor(x,y,w,h,couleur) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        if(couleur !== undefined) {
            this.couleur = couleur;
        }
    }


}