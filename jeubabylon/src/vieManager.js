// vieManager.js
export class vieManager {
    constructor(vieMax = 100) {
        this.vieMax = vieMax;
        this.vie = vieMax;
        this._updateUI();
    }
 
    perdreVie(degats) {
        this.vie = Math.max(0, this.vie - degats);
        console.log(`💀 -${degats} vie ! Vie restante : ${this.vie}`);
        this._updateUI();
 
        if (this.vie <= 0) {
            this._onMort();
        }
    }
 
    regagnerVie(points) {
        this.vie = Math.min(this.vieMax, this.vie + points);
        console.log(`❤️ +${points} vie ! Vie restante : ${this.vie}`);
        this._updateUI();
    }
 
    reset() {
        this.vie = this.vieMax;
        this._updateUI();
    }
 
    _updateUI() {
        const el = document.getElementById("vieBarFill");
        if (el) {
            const pourcentage = (this.vie / this.vieMax) * 100;
            el.style.width = pourcentage + "%";
        }
    }
 
    _onMort() {
        console.log("💀 Le joueur est mort !");
        // On remet la vie à fond pour l'instant
        // Plus tard on pourra afficher un écran de game over
        this.vie = this.vieMax;
        this._updateUI();
    }
}