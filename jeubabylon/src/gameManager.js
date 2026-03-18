import { MeshBuilder, StandardMaterial, Texture, Color3, Vector3, Vector4, Mesh } from "@babylonjs/core";
import { maze1, maze2, maze3 } from "./labyrinthe";

export class GameManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.levels = [maze1, maze2, maze3];
        this.currentLevel = 0;
        this.caseSize = 2;
        this.height = 3;
        this.mainWallMesh = null; // Un seul mesh pour tout le labyrinthe
        this.wallMaterial = null;

        this.initMaterial();
        this.startLevel();
    }

    initMaterial() {
        this.wallMaterial = new StandardMaterial("wallMat", this.scene);
        const textureUrl = new URL("./assets/textures/wall3.jpg", import.meta.url).href;
        this.wallMaterial.diffuseTexture = new Texture(textureUrl, this.scene);
        this.wallMaterial.specularColor = new Color3(0, 0, 0);
        this.wallMaterial.freeze();
    }

    startLevel() {
        if (this.mainWallMesh) {
            this.mainWallMesh.dispose();
        }

        const maze = this.levels[this.currentLevel];
        this.maze = maze; 
        const totalSize = maze.length * this.caseSize;
        const tempWalls = []; 

        const faceUV = new Array(6).fill(new Vector4(0, 0, 1, 1));

        for (let z = 0; z < maze.length; z++) {
            for (let x = 0; x < maze[z].length; x++) {
                if (maze[z][x] === 1) {
                    const wall = MeshBuilder.CreateBox("tempWall", {
                        width: this.caseSize,
                        height: this.height,
                        depth: this.caseSize,
                        faceUV: faceUV
                    }, this.scene);

                    wall.position.x = (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
                    wall.position.z = (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
                    wall.position.y = this.height / 2;

                    tempWalls.push(wall);
                }
                if (maze[z][x] === 2) this.setPlayerPosition(x, z, maze.length);
            }
        }

        // --- LA FUSION : On transforme 400 murs en 1 seul ---
        if (tempWalls.length > 0) {
            this.mainWallMesh = Mesh.MergeMeshes(tempWalls, true, true, undefined, false, true);
            this.mainWallMesh.material = this.wallMaterial;
            this.mainWallMesh.checkCollisions = true;
            this.mainWallMesh.freezeWorldMatrix(); // Optimisation ultime
        }
    }

    setPlayerPosition(x, z, mazeSize) {
        const totalSize = mazeSize * this.caseSize;
        this.player.mesh.position.set(
            (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
            0.5,
            (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
        );
    }

    update() {
        if (!this.maze) return;

        const totalSize = this.maze.length * this.caseSize;
        
        // Calcul de la case actuelle du joueur
        const xIndex = Math.floor((this.player.mesh.position.x + totalSize / 2) / this.caseSize);
        const zIndex = Math.floor((this.player.mesh.position.z + totalSize / 2) / this.caseSize);

        // Détection de la sortie (Case 3)
        if (this.maze[zIndex] && this.maze[zIndex][xIndex] === 3) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.currentLevel++;
        
        if (this.currentLevel >= this.levels.length) {
            console.log("🏆 Jeu terminé !");
            this.currentLevel = this.levels.length - 1; 
            return; 
        }

        this.startLevel();
    }
}