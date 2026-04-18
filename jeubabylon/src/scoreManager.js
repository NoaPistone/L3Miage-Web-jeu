import { MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { vieManager } from "./vieManager";

export class ScoreManager {
    constructor(player, scene, vieManager) {
        this.score = 0;
        this.player = player;
        this.scene = scene;
        this.vieManager = vieManager;
        this.exitPosition = null;
        this._updateUI();
    }

    setExitPosition(pos) {
        this.exitPosition = pos;
    }




    activerCarte() {
        if (!this.exitPosition || !this.player) return;

        const fleche = MeshBuilder.CreateCylinder("fleche", {
            height: 0.8,
            diameterTop: 0,
            diameterBottom: 0.6,
            tessellation: 4
        }, this.scene);

        const mat = new StandardMaterial("flecheMat", this.scene);
        mat.diffuseColor = new Color3(0, 0, 0);
        mat.emissiveColor = new Color3(0, 0, 0);
        mat.specularColor = new Color3(0, 0, 0);
        mat.disableLighting = true;
        fleche.material = mat;
        fleche.rotation.x = Math.PI / 2;

        const updateArrow = () => {
            const playerPos = this.player.collider.position;
            const exitPos = this.exitPosition;
            const dir = exitPos.subtract(playerPos).normalize();
            const angle = Math.atan2(dir.x, dir.z);
            const forward = this.player.collider.forward;
            const offset = forward.scale(2);
            fleche.position.x = playerPos.x + offset.x;
            fleche.position.z = playerPos.z + offset.z;
            fleche.position.y = 0.5;
            fleche.rotation.y = angle;
            fleche.scaling.x = 0.5;
            fleche.scaling.y = 0.5;
            fleche.scaling.z = 0.1;
        };

        this.scene.onBeforeRenderObservable.add(updateArrow);


        this.flecheActive = fleche;
        this.flecheObserver = updateArrow;

        this.flecheTimeout = setTimeout(() => {
            this.supprimerFleche();
        }, 15000);
    }


    supprimerFleche() {
        if (this.flecheObserver) {
            this.scene.onBeforeRenderObservable.removeCallback(this.flecheObserver);
            this.flecheObserver = null;
        }
        if (this.flecheActive) {
            this.flecheActive.dispose();
            this.flecheActive = null;
        }
        if (this.flecheTimeout) {
            clearTimeout(this.flecheTimeout);
            this.flecheTimeout = null;
        }
    }


    addPoints(type) {
        console.log("addPoints appelé avec type:", type);
        switch (type) {
            case "cristal":
                this.score += 50;
                console.log("💎 +50 points ! Score :", this.score);
                break;
            case "piece":
                this.score += 10;
                console.log("🪙 +10 points ! Score :", this.score);
                break;
            case "carte":
                this.score += 15;
                this.activerCarte();
                console.log("🗺️ +15 points ! Score :", this.score);
                break;
            case "boost":
                if (this.player) this.player.activerBoost();
                console.log("⚡ Boost activé !");
                break;
            case "bottle":
                this.score += 5;
                if (this.vieManager) this.vieManager.regagnerVie(20);
                console.log("🍶 +5 points ! Score :", this.score);
                break;
            case "apple":
                this.score += 2;
                if (this.vieManager) this.vieManager.regagnerVie(10);
                console.log("🍎 +2 points ! Score :", this.score);
                break;
            default:
                console.warn("⚠️ Type d'item inconnu :", type);
        }
        this._updateUI();
    }

    _updateUI() {
        console.log("_updateUI appelé, score:", this.score);
        const el = document.getElementById("scoreValue");
        if (el) el.textContent = this.score;
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.score = 0;
        this._updateUI();
    }

    envoyerScore() {
        const token = localStorage.getItem('token');
        if (!token) return;
        fetch('https://projetswebmiagel3.onrender.com/api/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ jeu: 'jeu2', score: this.score })
        });
    }


    
}