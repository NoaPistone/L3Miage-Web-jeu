import { SceneLoader, Vector3, TransformNode } from "@babylonjs/core";
import { aStar } from "./Astar";

const VITESSE = 0.04;        
const RECALCUL_INTERVAL = 60; 
const CONTACT_RADIUS = 1.2; 

export class Enemy {
    constructor(scene, maze, caseSize, startRow, startCol, fileName) {
        this.scene = scene;
        this.maze = maze;
        this.caseSize = caseSize;
        this.chemin = [];
        this.frameCount = 0;
        
        this.root = new TransformNode("enemy_root", this.scene);
        this.mesh = null; 
        this.anims = {};
        this.isLoaded = false;
        this.currentAnimName = "";
        this.isTurning = false; 
        this.derniereDirection = new Vector3(0, 0, 1);

        this._chargerModele(fileName, startRow, startCol);
    }

    async _chargerModele(fileName, row, col) {
        try {
            const result = await SceneLoader.ImportMeshAsync("", "/assets/monstre/", fileName, this.scene);
            this.mesh = result.meshes[0];
            this.mesh.parent = this.root;
            
            // Correction d'angle de base
            this.mesh.rotation.y = Math.PI; 

            const totalSize = this.maze.length * this.caseSize;
            this.root.position.set(
                (col * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
                0.1, 
                (row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
            );

            result.animationGroups.forEach(group => {
                this.anims[group.name.toLowerCase()] = group;
                group.stop();
            });

            this.isLoaded = true;
            this._jouerAnim("walking"); 
        } catch (e) {
            console.error("Erreur chargement monstre:", e);
        }
    }

    // Modification ici pour accepter la direction cible après le virage
    _jouerAnim(nom, cibleApresVirage = null) {
        const anim = this.anims[nom.toLowerCase()];
        if (!this.isLoaded || !anim || this.currentAnimName === nom) return;

        if (nom.includes("turn")) {
            this.isTurning = true;
        }

        if (this.currentAnimName && this.anims[this.currentAnimName]) {
            this.anims[this.currentAnimName].stop();
        }

        anim.play(nom === "walking");
        this.currentAnimName = nom;

        if (nom !== "walking") {
            anim.onAnimationEndObservable.addOnce(() => {
                // IMPORTANT : On ne tourne physiquement le monstre qu'UNE FOIS l'animation finie
                if (cibleApresVirage) {
                    this.root.lookAt(cibleApresVirage);
                }
                this.isTurning = false;
                this._jouerAnim("walking");
            });
        }
    }

    update(playerPosition, onContactCallback) {
        if (!this.isLoaded || !this.root) return;

        this.frameCount++;
        
        // Hitbox
        const distanceAuJoueur = Vector3.Distance(this.root.position, playerPosition);
        if (distanceAuJoueur < CONTACT_RADIUS) {
            onContactCallback();
        }

        // Si on est en train de jouer l'animation de virage, on ne fait rien d'autre
        if (this.isTurning) return;

        if (this.frameCount % RECALCUL_INTERVAL === 0 || this.chemin.length === 0) {
            const enemyGrid = this._worldToGrid(this.root.position);
            const cible = this._worldToGrid(playerPosition);
            this.chemin = aStar(this.maze, enemyGrid, cible);
            if (this.chemin.length > 0) this.chemin.shift();
        }

        if (this.chemin.length > 0) {
            const cibleMonde = this._gridToWorld(this.chemin[0].row, this.chemin[0].col);
            const dir = cibleMonde.subtract(this.root.position).normalize();
            
            if (Vector3.Distance(this.root.position, cibleMonde) < 0.2) {
                this.chemin.shift();
            } else {
                const dot = Vector3.Dot(this.derniereDirection, dir);
                
                // Détection du besoin de tourner
                if (dot < 0.95) { 
                    const cross = Vector3.Cross(this.derniereDirection, dir);
                    let animNom = "";

                    if (dot < -0.8) animNom = "turn180";
                    else if (cross.y > 0) animNom = "turnright90";
                    else if (cross.y < 0) animNom = "turnleft90";
                    
                    if (animNom !== "") {
                        // On lance l'anim, mais on passe cibleMonde pour le lookAt final
                        this._jouerAnim(animNom, cibleMonde);
                        this.derniereDirection.copyFrom(dir);
                        return; // On arrête l'update ici : pas de mouvement, pas de lookAt immédiat
                    }
                }

                // Si on arrive ici, on est en ligne droite
                this.derniereDirection.copyFrom(dir);
                this.root.lookAt(cibleMonde);
                this.root.position.addInPlace(dir.scale(VITESSE));
            }
        }
    }

    _worldToGrid(pos) {
        const totalSize = this.maze.length * this.caseSize;
        const col = Math.floor((pos.x + totalSize / 2) / this.caseSize);
        const row = Math.floor((pos.z + totalSize / 2) / this.caseSize);
        return { row, col };
    }

    _gridToWorld(row, col) {
        const totalSize = this.maze.length * this.caseSize;
        return new Vector3(
            (col * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
            0.1,
            (row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
        );
    }

    dispose() {
        if (this.root) this.root.dispose();
    }
}