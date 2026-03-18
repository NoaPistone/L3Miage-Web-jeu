import { MeshBuilder, Vector3 } from "@babylonjs/core";

export class Joueur {
    constructor(scene) {
        this.scene = scene;
        this.scene.collisionsEnabled = true;
        this.mesh = MeshBuilder.CreateSphere("player", { diameter: 1 }, scene);
        this.mesh.position.y = 0.5;

        // Configuration indispensable pour les murs
        this.mesh.checkCollisions = true;
        this.mesh.ellipsoid = new Vector3(0.5, 0.5, 0.5);
        this.mesh.ellipsoidOffset = new Vector3(0, 0.5, 0);

        this.vitesse = 0.15; // Augmenté un peu pour mieux voir
        this.inputMap = {};

        window.addEventListener("keydown", (e) => {
            this.inputMap[e.key.toLowerCase()] = true;
        });
        window.addEventListener("keyup", (e) => {
            this.inputMap[e.key.toLowerCase()] = false;
        });
    }

    update() {
        let mouvement = new Vector3(0, 0, 0);

        // On remplit le vecteur de mouvement
        if (this.inputMap["z"]) mouvement.z = this.vitesse;
        if (this.inputMap["s"]) mouvement.z = -this.vitesse;
        if (this.inputMap["q"]) mouvement.x = -this.vitesse;
        if (this.inputMap["d"]) mouvement.x = this.vitesse;

        // On applique le mouvement seulement si une touche est pressée
        if (mouvement.length() > 0) {
            this.mesh.moveWithCollisions(mouvement);
        }

    }
}