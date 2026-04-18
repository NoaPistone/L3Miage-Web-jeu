import { MeshBuilder, StandardMaterial, Texture, Color3, Vector3, Vector4, Mesh, SceneLoader } from "@babylonjs/core";
import { maze1, maze2, maze3, maze4, maze5, maze6, maze7 } from "./labyrinthe";
import { ItemManager } from "./itemsManager";
import { ScoreManager } from "./scoreManager";
import { EnemyManager } from "./enemyManager";
import { vieManager } from "./vieManager";
import "@babylonjs/loaders/glTF";
import { INTRO_TEXT, LEVEL_INTROS } from "./story";



export class GameManager {
    constructor(scene, player, autoStart = false) {
        this.scene = scene;
        this.player = player;
        this.levels = [maze1, maze2, maze3, maze4, maze5, maze6, maze7];
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
        this.vieManager = new vieManager(100);
        this.scoreManager = new ScoreManager(this.player, this.scene, this.vieManager);
        this.vieManager.onMortCallback = () => {
            this.vieManager._onMort(this.scoreManager, this);
        };
        this.chronoInterval = null;
        this.chronoSecondes = 0;
        this.escalierMesh = null;
        this.enemyManager = null;
        this.enTransition = false;
        this.isRunning = false;
        this.chronoTotal = 0;

        this.initMaterial();

        if (autoStart) {
            this.startStoryMode();
        }
    }

    initMaterial() {
        this.wallMaterial = new StandardMaterial("wallMat", this.scene);
        const textureUrl = new URL("./assets/textures/wall3.jpg", import.meta.url).href;
        const wallTexture = new Texture(textureUrl, this.scene);

        wallTexture.vScale = 4;
        wallTexture.uScale = 2;

        this.wallMaterial.diffuseTexture = wallTexture;
        this.wallMaterial.specularColor = new Color3(0, 0, 0);
        this.wallMaterial.freeze();
    }

    startLevel() {
        if (this.escalierMesh) {
            this.escalierMesh.dispose();
            this.escalierMesh = null;
        }

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

        if (this.enemyManager) {
            this.enemyManager.dispose();
            this.enemyManager = null;
        }

        const maze = this.levels[this.currentLevel];
        console.log(`--- 🏰 NIVEAU ${this.currentLevel + 1} / ${this.levels.length} ---`);
        this.maze = maze;
        this.spawnPosition = null;
        this.playerPlaced = false;

        const totalSize = maze.length * this.caseSize;
        const tempWalls = [];

        const faceUV = new Array(6);
        faceUV[0] = new Vector4(0, 0, 1, 1);
        faceUV[1] = new Vector4(0, 0, 1, 1);
        faceUV[2] = new Vector4(0, 0, 1, 1);
        faceUV[3] = new Vector4(0, 0, 1, 1);
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

                if (maze[z][x] === 3) {
                    this.scoreManager.setExitPosition(new Vector3(posX, 0.5, posZ));
                    this._loadEscalier(posX, posZ);
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
        this.enemyManager = new EnemyManager(this.scene, this.currentLevel + 1, maze, this.caseSize, this.vieManager);
        this.chronoTotal += this.chronoSecondes;
        this.startChrono();

    }

    setPlayerPosition() {
        if (!this.spawnPosition) return;
        if (!this.player || !this.player.collider) return;

        this.player.collider.position.copyFrom(this.spawnPosition);
        this.playerPlaced = true;
    }

    update() {
        if (!this.isRunning) return;
        if (!this.maze) return;
        if (!this.player || !this.player.collider) return;
        if (this.enTransition) return;

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

        const detectionDist = 1.0;
        const checkXPlus = Math.floor((this.player.collider.position.x + detectionDist + totalSize / 2) / this.caseSize);
        const checkXMinus = Math.floor((this.player.collider.position.x - detectionDist + totalSize / 2) / this.caseSize);
        const checkZPlus = Math.floor((this.player.collider.position.z + detectionDist + totalSize / 2) / this.caseSize);
        const checkZMinus = Math.floor((this.player.collider.position.z - detectionDist + totalSize / 2) / this.caseSize);

        if (
            isExit(zIndex, xIndex) ||
            isExit(zIndex, checkXPlus) ||
            isExit(zIndex, checkXMinus) ||
            isExit(checkZPlus, xIndex) ||
            isExit(checkZMinus, xIndex)
        ) {
            console.log("🏁 Sortie atteinte !");
            this.nextLevel();
        }

        if (this.enemyManager) {
            this.enemyManager.update(this.player.collider.position);
        }
    }

    nextLevel() {
        if (this.enTransition) return;
        this.enTransition = true;

        this.scoreManager.supprimerFleche();
        this.player.desactiverBoost();

        this.currentLevel++;

        if (this.currentLevel >= this.levels.length) {
            console.log("🏆 Jeu terminé !");
            this.isRunning = false;
            this.enTransition = false;

            if (this.chronoInterval) clearInterval(this.chronoInterval);

            const transition = document.getElementById("transition");
            transition.classList.add("fadeIn");

            if (document.exitPointerLock) document.exitPointerLock();

            setTimeout(() => {
                transition.classList.remove("fadeIn");
                const totalSecondes = this.chronoTotal + this.chronoSecondes;
                const min = Math.floor(totalSecondes / 60).toString().padStart(2, "0");
                const sec = (totalSecondes % 60).toString().padStart(2, "0");

                const token = localStorage.getItem('token');
                if (token) {
                    fetch('https://projetswebmiagel3.onrender.com/api/scores', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({ jeu: 'jeu2', score: this.scoreManager.getScore() })
                    });
                }

                document.getElementById("finScoreValue").textContent = this.scoreManager.getScore();
                document.getElementById("finTempsValue").textContent = `${min}:${sec}`;
                document.getElementById("finJeu").classList.remove("hidden");

                document.getElementById("finQuitterBtn").onclick = () => {
                    window.close();
                };

                
                document.getElementById("finMenuBtn").onclick = () => {
                    document.getElementById("finJeu").classList.add("hidden");
                    document.getElementById("hudDroit").style.display = "none";
                    document.getElementById("hudGauche").style.display = "none";
                    document.getElementById("hudMilieu").style.display = "none";
                    document.getElementById("mainMenu").classList.remove("hidden");
                };
            }, 800);

            return;
        }

        const transition = document.getElementById("transition");
        transition.classList.add("fadeIn");

        setTimeout(() => {
            if (window.showLevelIntro) {
                window.showLevelIntro(this.currentLevel, () => {
                    this.startLevel();
                    setTimeout(() => {
                        transition.classList.remove("fadeIn");
                        this.enTransition = false;
                    }, 300);
                });
            } else {
                this.startLevel();
                setTimeout(() => {
                    transition.classList.remove("fadeIn");
                    this.enTransition = false;
                }, 300);
            }
        }, 800);

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
        const min = Math.floor(this.chronoSecondes / 60).toString().padStart(2, "0");
        const sec = (this.chronoSecondes % 60).toString().padStart(2, "0");
        const el = document.getElementById("chronoValue");
        if (el) el.textContent = `${min}:${sec}`;
    }

    _loadEscalier(posX, posZ) {
        if (this.escalierMesh) {
            this.escalierMesh.dispose();
            this.escalierMesh = null;
        }

        const escalierUrl = new URL("./assets/textures/escalier5.glb", import.meta.url).href;

        SceneLoader.ImportMesh(
            "",
            "",
            escalierUrl,
            this.scene,
            (meshes) => {
                if (!meshes || meshes.length === 0) {
                    console.log("Aucun mesh chargé pour l'escalier.");
                    return;
                }

                const root = new Mesh("escalierRoot", this.scene);

                meshes.forEach((mesh) => {
                    if (mesh !== root) {
                        mesh.parent = root;
                        mesh.checkCollisions = false;
                    }
                });

                root.scaling = new Vector3(0.20, 0.13, 0.09);

                
                this.scene.executeWhenReady(() => {
                    const bounds = root.getHierarchyBoundingVectors();

                    const centerX = (bounds.min.x + bounds.max.x) / 2;
                    const centerZ = (bounds.min.z + bounds.max.z) / 2;
                    const bottomY = bounds.min.y;

                    
                    root.getChildMeshes().forEach((child) => {
                        child.position.x -= centerX;
                        child.position.y -= bottomY;
                        child.position.z -= centerZ;
                    });

                    
                    root.position = new Vector3(posX, 0, posZ);

                    

                    this.escalierMesh = root;
                });
            },
            null,
            (scene, message, exception) => {
                console.error("Erreur chargement escalier :", message, exception);
            }
        );
    }

    restart() {
        this.currentLevel = 0;
        this.enTransition = false;
        this.isRunning = true;
        this.vieManager.reset();
        this.scoreManager.reset();
        this.startLevel();
    }

    startStoryMode() {
        this.startGame(0);
    }

    startLevelMode(levelIndex) {
        this.startGame(levelIndex);
    }

    startGame(levelIndex = 0) {
        if (levelIndex < 0) levelIndex = 0;
        if (levelIndex >= this.levels.length) levelIndex = this.levels.length - 1;

        this.currentLevel = levelIndex;
        this.enTransition = false;
        this.isRunning = true;

        this.vieManager.reset();
        this.scoreManager.reset();
        this.startLevel();
    }

    getIntroText() {
        return INTRO_TEXT;
    }

    getLevelIntroText(levelIndex) {
        return LEVEL_INTROS[levelIndex] ?? null;
    }
}