import { MeshBuilder, Vector3 } from "@babylonjs/core";

export class Joueur {
    constructor(scene) {
        this.scene = scene;
        this.mesh = MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
        
        // Position de départ (Y = 0.5 pour que le bas de la boule touche le sol à 0)
        this.positionInitialeY = 0.5;
        this.mesh.position.y = this.positionInitialeY; 

        this.vitesse = 0.1;
        this.vitesseSaut = 0.15; // Force de l'impulsion vers le haut
        this.gravite = -0.005;   // Force qui tire vers le bas
        this.vitesseVerticale = 0;
        this.estAuSol = true;

        this.inputMap = {};

        window.addEventListener("keydown", (event) => {
            this.inputMap[event.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", (event) => {
            this.inputMap[event.key.toLowerCase()] = false;
        });
    }

    update() {
        // --- 1. MOUVEMENTS HORIZONTAUX (Z, Q, S, D) ---
        // On peut bouger même pendant le saut
        if (this.inputMap["z"]) this.mesh.position.z += this.vitesse;
        if (this.inputMap["s"]) this.mesh.position.z -= this.vitesse;
        if (this.inputMap["q"]) this.mesh.position.x -= this.vitesse;
        if (this.inputMap["d"]) this.mesh.position.x += this.vitesse;

        // --- 2. LOGIQUE DU SAUT (Touche '0') ---
        if (this.inputMap[" "] && this.estAuSol) {
            this.vitesseVerticale = this.vitesseSaut;
            this.estAuSol = false;
        }

        // --- 3. PHYSIQUE (GRAVITÉ ET RETOMBÉE) ---
        if (!this.estAuSol) {
            // Appliquer la vitesse verticale à la position Y
            this.mesh.position.y += this.vitesseVerticale;
            
            // La gravité réduit la vitesse verticale (on finit par redescendre)
            this.vitesseVerticale += this.gravite;

            // Si on touche ou dépasse le sol
            if (this.mesh.position.y <= this.positionInitialeY) {
                this.mesh.position.y = this.positionInitialeY;
                this.vitesseVerticale = 0;
                this.estAuSol = true;
            }
        }
    }
}