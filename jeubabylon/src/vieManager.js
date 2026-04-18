export class vieManager {
    constructor(vieMax = 100) {
        this.vieMax = vieMax;
        this.vie = vieMax;
        this._updateUI();
        this.overlay = document.getElementById("damageOverlay");
    }

    perdreVie(degats) {
        this.vie = Math.max(0, this.vie - degats);
        this._updateUI();

       
        if (this.overlay) {
            this.overlay.classList.add("active");
            
            
            setTimeout(() => {
                this.overlay.classList.remove("active");
            }, 500);
        }

        if (this.vie <= 0 && this.onMortCallback) {
            this.onMortCallback();
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

    _onMort(scoreManager, gameManager) {
        console.log("💀 Le joueur est mort !");

        if (document.exitPointerLock) {
            document.exitPointerLock();
        }

        const scoreEl = document.getElementById("gameOverScoreValue");
        if (scoreEl && scoreManager) scoreEl.textContent = scoreManager.getScore();

        const gameOver = document.getElementById("gameOver");
        if (gameOver) gameOver.classList.add("visible");

        const btn = document.getElementById("gameOverBtn");
        if (btn) {
            btn.onclick = () => {
                gameOver.classList.remove("visible");
                gameManager.isRunning = false;

                document.getElementById("mainMenu")?.classList.remove("hidden");
                document.getElementById("hudDroit").style.display = "none";
                document.getElementById("hudGauche").style.display = "none";
                document.getElementById("hudMilieu").style.display = "none";
            };
        }
    }
}