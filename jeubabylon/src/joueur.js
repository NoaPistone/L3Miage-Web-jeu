import { SceneLoader, Vector3, FollowCamera } from "@babylonjs/core";
import "@babylonjs/loaders/glTF";

export class Joueur {
    constructor(scene, canvas) {
        this.scene = scene;
        this.canvas = canvas;
        this.inputMap = {};
        
        // --- Réglages adaptés à l'échelle 1 (Géant) ---
        this.vitesse = 0.5;         // On augmente la vitesse car le perso est grand
        this.vitesseSaut = 0.8;     // Impulsion plus forte pour soulever le poids
        this.gravite = -0.03;       // Gravité plus forte pour retomber plus vite
        this.vitesseVerticale = 0;
        this.estAuSol = true;

        this._chargerModele();

        window.addEventListener("keydown", (e) => this.inputMap[e.key.toLowerCase()] = true);
        window.addEventListener("keyup", (e) => this.inputMap[e.key.toLowerCase()] = false);
    }

    async _chargerModele() {
    // 1. Charge le perso principal
    const result = await SceneLoader.ImportMeshAsync("", "/assets/", "Ch24_nonPBR.glb", this.scene);
    this.mesh = result.meshes[0];
    this.mesh.scaling = new Vector3(1, 1, 1);
    
    // On le remet dans le bon sens (car il marche à l'envers)
    this.mesh.rotationQuaternion = null; 
    this.mesh.rotation.y = Math.PI; 

    // 2. Charge l'animation de marche
    const animResult = await SceneLoader.ImportAnimationsAsync("/assets/", "ninja_walking.glb", this.scene);
    
    // On récupère le groupe d'animation
    this.walkAnim = animResult.animationGroups[0];
    this.walkAnim.stop(); // On ne la lance pas tout de suite

    // Caméra de suivi (3ème personne)
    this.camera = new FollowCamera("FollowCam", new Vector3(0, 10, -20), this.scene);
    this.camera.radius = 10;
    this.camera.heightOffset = 4;
    this.camera.lockedTarget = this.mesh;
}

    update() {
    // 1. Sécurité : On attend que le mesh soit chargé
    if (!this.mesh) return;

    let isMoving = false;
    let rotationY = this.mesh.rotation.y;

    // --- 2. DÉPLACEMENTS ZQSD ---
    // Note : Si "Z" te fait reculer, change le += en -=
    if (this.inputMap["z"]) {
        this.mesh.position.z += this.vitesse;
        rotationY = 0; // Regarde vers l'avant
        isMoving = true;
    }
    if (this.inputMap["s"]) {
        this.mesh.position.z -= this.vitesse;
        rotationY = Math.PI; // Regarde vers l'arrière (180°)
        isMoving = true;
    }
    if (this.inputMap["q"]) {
        this.mesh.position.x -= this.vitesse;
        rotationY = -Math.PI / 2; // Regarde à gauche
        isMoving = true;
    }
    if (this.inputMap["d"]) {
        this.mesh.position.x += this.vitesse;
        rotationY = Math.PI / 2; // Regarde à droite
        isMoving = true;
    }

    // Appliquer la rotation en douceur (Lerp) ou directe
    this.mesh.rotation.y = rotationY;

    // --- 3. LOGIQUE D'ANIMATION ---
    // On vérifie si l'animation de marche existe (si tu l'as chargée)
    if (this.walkAnim) {
        if (isMoving) {
            // Si on bouge et que l'anim ne tourne pas, on la lance
            if (!this.walkAnim.isPlaying) {
                this.walkAnim.play(true); // true = en boucle
            }
        } else {
            // Si on s'arrête, on stoppe l'anim de marche
            this.walkAnim.stop();
        }
    }

    // --- 4. LOGIQUE DU SAUT ---
    if (this.inputMap[" "] && this.estAuSol) {
        this.vitesseVerticale = this.vitesseSaut;
        this.estAuSol = false;
    }

    // --- 5. PHYSIQUE (GRAVITÉ) ---
    if (!this.estAuSol) {
        this.mesh.position.y += this.vitesseVerticale;
        this.vitesseVerticale += this.gravite;

        // Collision avec le sol
        if (this.mesh.position.y <= 0) {
            this.mesh.position.y = 0;
            this.vitesseVerticale = 0;
            this.estAuSol = true;
        }
    }
}
}