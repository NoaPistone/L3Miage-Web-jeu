import { MeshBuilder, StandardMaterial, Texture, Color3, Vector3, Vector4, Mesh, SceneLoader } from "@babylonjs/core";
import { maze1, maze2, maze3, maze4, maze5, maze6, maze7, maze8, maze9 } from "./labyrinthe";
import { ItemManager } from "./itemsManager";
import { ScoreManager } from "./scoreManager";
import "@babylonjs/loaders/glTF";

export class GameManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.levels = [maze1, maze2, maze3, maze4, maze5, maze6, maze7, maze8, maze9];
        this.currentLevel = 0;
        this.caseSize = 4;
        this.height = 9;
        this.mainWallMesh = null;
        this.exitMesh = null;
        this.wallMaterial = null;
        this.maze = null;
        this.spawnPosition = null;
        this.playerPlaced = false;
        this.itemManager = null;
        this.scoreManager = new ScoreManager(this.player, this.scene);
        this.chronoInterval = null;
        this.chronoSecondes = 0;

        this.initMaterial();
        this.startLevel();
    }

    initMaterial() {
        this.wallMaterial = new StandardMaterial("wallMat", this.scene);
        const textureUrl = new URL("./assets/textures/wall3.jpg", import.meta.url).href;
        const wallTexture = new Texture(textureUrl, this.scene);

        // On règle la répétition ici pour que les briques ne soient pas géantes
        // vScale gère la répétition verticale (hauteur)
        wallTexture.vScale = 4;
        wallTexture.uScale = 2; // Pas de répétition horizontale, on veut des briques verticales

        this.wallMaterial.diffuseTexture = wallTexture;
        this.wallMaterial.specularColor = new Color3(0, 0, 0);
        this.wallMaterial.freeze();
    }

    startLevel() {

        if (this.mainWallMesh) {
            this.mainWallMesh.dispose();
            this.mainWallMesh = null;
        }

        if (this.exitMesh) {
            this.exitMesh.dispose();
            this.exitMesh = null;
        }

        if (this.itemManager) {
            this.itemManager.dispose();
            this.itemManager = null;
        }


        const maze = this.levels[this.currentLevel];
        console.log(`--- 🏰 NIVEAU ${this.currentLevel + 1} / ${this.levels.length} ---`);
        this.maze = maze;
        this.spawnPosition = null;
        this.playerPlaced = false;

        const totalSize = maze.length * this.caseSize;
        const tempWalls = [];


        const faceUV = new Array(6);

        // Pour les côtés (0, 1, 2, 3), on garde l'orientation standard
        faceUV[0] = new Vector4(0, 0, 1, 1);
        faceUV[1] = new Vector4(0, 0, 1, 1);
        faceUV[2] = new Vector4(0, 0, 1, 1);
        faceUV[3] = new Vector4(0, 0, 1, 1);

        // Pour le haut et le bas (4, 5), on met souvent une texture neutre 
        // ou on s'en fiche car le joueur ne les voit pas avec le toit.
        faceUV[4] = new Vector4(0, 0, 0, 0);
        faceUV[5] = new Vector4(0, 0, 0, 0);

        for (let z = 0; z < maze.length; z++) {
            for (let x = 0; x < maze[z].length; x++) {
                const posX = (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
                const posZ = (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
                if (maze[z][x] === 1) {
                    const wall = MeshBuilder.CreateBox("tempWall", {
                        width: this.caseSize,
                        height: this.height,
                        depth: this.caseSize,
                        faceUV: faceUV,
                        wrap: true
                    }, this.scene);
                    wall.position.set(posX, this.height / 2, posZ);
                    tempWalls.push(wall);
                }



                if (maze[z][x] === 2) {
                    this.spawnPosition = new Vector3(posX, 0.9, posZ);
                }

                if (maze[z][x] === 3) { // 👈
                    this.scoreManager.setExitPosition(new Vector3(posX, 0.5, posZ));
                }
            }
        }

        if (tempWalls.length > 0) {
            this.mainWallMesh = Mesh.MergeMeshes(tempWalls, true, true, undefined, false, true);
            this.mainWallMesh.material = this.wallMaterial;
            this.mainWallMesh.checkCollisions = true;
            this.mainWallMesh.freezeWorldMatrix();
        }


        this.setPlayerPosition();
        this.itemManager = new ItemManager(this.scene, this.currentLevel + 1, maze, this.caseSize, this.scoreManager);
        this.startChrono();
    }

    setPlayerPosition() {
        if (!this.spawnPosition) return;
        if (!this.player || !this.player.collider) return;

        this.player.collider.position.copyFrom(this.spawnPosition);
        this.playerPlaced = true;
    }

    update() {
        if (!this.maze) return;
        if (!this.player || !this.player.collider) return;

        if (!this.playerPlaced) {
            this.setPlayerPosition();
            return;
        }

        if (this.itemManager) {
            this.itemManager.update(this.player.collider.position);
        }

        const totalSize = this.maze.length * this.caseSize;

        const xIndex = Math.floor((this.player.collider.position.x + totalSize / 2) / this.caseSize);
        const zIndex = Math.floor((this.player.collider.position.z + totalSize / 2) / this.caseSize);


        const isExit = (z, x) => {
            return this.maze[z] && this.maze[z][x] === 3;
        };
        // On crée une petite zone de détection autour du joueur (0.6 unité de distance)
        const detectionDist = 1.0;
        const checkXPlus = Math.floor((this.player.collider.position.x + detectionDist + totalSize / 2) / this.caseSize);
        const checkXMinus = Math.floor((this.player.collider.position.x - detectionDist + totalSize / 2) / this.caseSize);
        const checkZPlus = Math.floor((this.player.collider.position.z + detectionDist + totalSize / 2) / this.caseSize);
        const checkZMinus = Math.floor((this.player.collider.position.z - detectionDist + totalSize / 2) / this.caseSize);

        // Si n'importe quel côté du joueur touche la case 3, on change de niveau
        if (isExit(zIndex, xIndex) ||
            isExit(zIndex, checkXPlus) || isExit(zIndex, checkXMinus) ||
            isExit(checkZPlus, xIndex) || isExit(checkZMinus, xIndex)) {

            console.log("🏁 Sortie atteinte !");
            this.nextLevel();
        }
    }

    nextLevel() {
        this.scoreManager.supprimerFleche(); // 👈
        this.player.desactiverBoost();
        this.currentLevel++;

        if (this.currentLevel >= this.levels.length) {
            console.log("🏆 Jeu terminé !");
            this.currentLevel = this.levels.length - 1;
            return;
        }

        this.startLevel();
    }

    startChrono() {
        if (this.chronoInterval) clearInterval(this.chronoInterval);
        this.chronoSecondes = 0;
        this._updateChrono();

        this.chronoInterval = setInterval(() => {
            this.chronoSecondes++;
            this._updateChrono();
        }, 1000);
    }

    _updateChrono() {
        const min = Math.floor(this.chronoSecondes / 60).toString().padStart(2, '0');
        const sec = (this.chronoSecondes % 60).toString().padStart(2, '0');
        const el = document.getElementById("chronoValue");
        if (el) el.textContent = `${min}:${sec}`;
    }
}