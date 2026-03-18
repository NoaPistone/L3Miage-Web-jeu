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
        this.mainWallMesh = null;
        this.wallMaterial = null;
        this.maze = null;
        this.spawnPosition = null;
        this.playerPlaced = false;

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
            this.mainWallMesh = null;
        }

        const maze = this.levels[this.currentLevel];
        this.maze = maze;
        this.spawnPosition = null;
        this.playerPlaced = false;

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

                if (maze[z][x] === 2) {
                    this.spawnPosition = new Vector3(
                        (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
                        0.9,
                        (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
                    );
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

        const totalSize = this.maze.length * this.caseSize;

        const xIndex = Math.floor((this.player.collider.position.x + totalSize / 2) / this.caseSize);
        const zIndex = Math.floor((this.player.collider.position.z + totalSize / 2) / this.caseSize);

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