import { MeshBuilder, StandardMaterial, Color3 } from "@babylonjs/core";
import { maze1, maze2, maze3 } from "./labyrinthe";

export class GameManager {
    constructor(scene, player) {
        this.scene = scene;
        this.player = player;
        this.levels = [maze1, maze2, maze3];
        this.currentLevel = 0;

        this.caseSize = 2;
        this.height = 3;

        this.wallMaterial = new StandardMaterial("wallMat", scene);
        this.wallMaterial.diffuseColor = new Color3(0, 0, 0);
        this.wallMaterial.specularColor = new Color3(0, 0, 0);

        this.walls = []; // tableau pour stocker les murs générés

        this.startLevel();
    }

    startLevel() {
        // Supprime tous les murs du niveau précédent
        this.walls.forEach(mesh => mesh.dispose());
        this.walls = [];

        this.maze = this.levels[this.currentLevel];

        // Génération des murs
        for (let z = 0; z < this.maze.length; z++) {
            for (let x = 0; x < this.maze[z].length; x++) {
                if (this.maze[z][x] === 1) {
                    const wall = MeshBuilder.CreateBox("wall", {
                        width: this.caseSize,
                        height: this.height,
                        depth: this.caseSize
                    }, this.scene);

                    const totalSize = this.maze.length * this.caseSize;
                    wall.position.x = (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
                    wall.position.y = this.height / 2;
                    wall.position.z = (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);

                    wall.material = this.wallMaterial;
                    wall.checkCollisions = true;

                    this.walls.push(wall); // ajoute au tableau pour suppression future
                }
            }
        }

        // Place le joueur sur la case 2
        for (let z = 0; z < this.maze.length; z++) {
            for (let x = 0; x < this.maze[z].length; x++) {
                if (this.maze[z][x] === 2) {
                    this.setPlayerPosition(x, z);
                    return;
                }
            }
        }
    }

    setPlayerPosition(x, z) {
        const totalSize = this.maze.length * this.caseSize;
        this.player.mesh.position.x = (x * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
        this.player.mesh.position.y = this.height / 2;
        this.player.mesh.position.z = (z * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
    }

    update() {
        const totalSize = this.maze.length * this.caseSize;
        const xIndex = Math.floor((this.player.mesh.position.x + totalSize / 2) / this.caseSize);
        const zIndex = Math.floor((this.player.mesh.position.z + totalSize / 2) / this.caseSize);

        if (this.maze[zIndex] && this.maze[zIndex][xIndex] === 3) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel >= this.levels.length) {
            console.log("🎉 Tous les labyrinthes terminés !");
            return;
        }
        this.startLevel();
    }
}