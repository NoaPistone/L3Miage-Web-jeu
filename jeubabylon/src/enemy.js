import { SceneLoader, Vector3, TransformNode, Quaternion } from "@babylonjs/core";
import { aStar } from "./Astar";

/**
 * CONFIGURATION DU COMPORTEMENT
 */
const VITESSE = 0.04;        
const RECALCUL_INTERVAL = 60; 
const CONTACT_RADIUS = 1.2; 
const VITESSE_ROTATION = 0.12; // Plus c'est bas, plus le virage est large (naturel)

export class Enemy {
    constructor(scene, maze, caseSize, startRow, startCol, fileName) {
        this.scene = scene;
        this.maze = maze;
        this.caseSize = caseSize;
        this.chemin = [];
        this.frameCount = 0;
        
        // Le Root est le "cerveau" qui se déplace
        this.root = new TransformNode("enemy_root", this.scene);
        this.mesh = null; 
        this.anims = {};
        this.isLoaded = false;
        this.currentAnimName = "";

        this._chargerModele(fileName, startRow, startCol);
    }

    async _chargerModele(fileName, row, col) {
        try {
            const result = await SceneLoader.ImportMeshAsync("", "/assets/monstre/", fileName, this.scene);
            
            // On prend le premier mesh et on l'attache au root
            this.mesh = result.meshes[0];
            this.mesh.parent = this.root;
            
            /**
             * CORRECTION DE L'ORIENTATION
             * On tourne le mesh de 180° localement car le modèle 3D regarde vers l'arrière par défaut.
             */
            this.mesh.rotationQuaternion = null; // On force l'usage de .rotation pour l'offset
            this.mesh.rotation.y = Math.PI; 

            // Initialisation de la position sur la grille
            const totalSize = this.maze.length * this.caseSize;
            this.root.position.set(
                (col * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
                0.1, 
                (row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
            );

            // Initialisation du Quaternion sur le root (nécessaire pour le Slerp)
            this.root.rotationQuaternion = Quaternion.Identity();

            // Stockage des animations
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

    _jouerAnim(nom) {
        const anim = this.anims[nom.toLowerCase()];
        if (!this.isLoaded || !anim || this.currentAnimName === nom) return;

        // On arrête l'ancienne animation proprement
        if (this.currentAnimName && this.anims[this.currentAnimName]) {
            this.anims[this.currentAnimName].stop();
        }

        anim.play(true); 
        this.currentAnimName = nom;
    }

    update(playerPosition, onContactCallback) {
        if (!this.isLoaded || !this.root) return;

        this.frameCount++;
        
        // Vérification de collision avec le joueur
        const distanceAuJoueur = Vector3.Distance(this.root.position, playerPosition);
        if (distanceAuJoueur < CONTACT_RADIUS) {
            onContactCallback();
        }

        // Recalcul de l'itinéraire via A*
        if (this.frameCount % RECALCUL_INTERVAL === 0 || this.chemin.length === 0) {
            const enemyGrid = this._worldToGrid(this.root.position);
            const cible = this._worldToGrid(playerPosition);
            this.chemin = aStar(this.maze, enemyGrid, cible);
            if (this.chemin.length > 0) this.chemin.shift();
        }

        if (this.chemin.length > 0) {
            const cibleMonde = this._gridToWorld(this.chemin[0].row, this.chemin[0].col);
            const directionCible = cibleMonde.subtract(this.root.position).normalize();
            
            /**
             * 1. ROTATION FLUIDE (SLERP)
             * On calcule la rotation vers la prochaine case et on y va progressivement
             */
            const rotationCible = Quaternion.RotationQuaternionFromAxis(
                Vector3.Cross(Vector3.Up(), directionCible),
                Vector3.Up(),
                directionCible
            );

            Quaternion.SlerpToRef(
                this.root.rotationQuaternion,
                rotationCible,
                VITESSE_ROTATION,
                this.root.rotationQuaternion
            );

            /**
             * 2. MOUVEMENT
             * Si on est proche du point, on passe au suivant, sinon on avance
             */
            if (Vector3.Distance(this.root.position, cibleMonde) < 0.4) {
                this.chemin.shift();
            } else {
                // On avance selon l'axe avant (forward) actuel du monstre
                // Cela permet d'avoir des trajectoires courbes très fluides
                const avant = this.root.forward; 
                this.root.position.addInPlace(avant.scale(VITESSE));
                
                this._jouerAnim("walking");
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