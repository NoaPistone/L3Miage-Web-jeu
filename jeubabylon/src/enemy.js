import {
    SceneLoader,
    Vector3,
    TransformNode,
    Quaternion,
    MeshBuilder
} from "@babylonjs/core";
import { aStar } from "./Astar";

const VITESSE = 0.05;
const RECALCUL_INTERVAL = 20;
const VITESSE_ROTATION = 0.18;
const DIRECT_CHASE_DISTANCE = 3.0; 
const STOP_DISTANCE = 0.1; 

export class Enemy {
    constructor(scene, maze, caseSize, startRow, startCol, fileName) {
        this.scene = scene;
        this.maze = maze;
        this.caseSize = caseSize;
        this.chemin = [];
        this.frameCount = 0;
        this.collisionRadius = 0.35; 

        this.lastPosition = new Vector3(0, 0, 0);
        this.stuckCounter = 0;
        this.stuckMode = 0;

        this.collider = MeshBuilder.CreateBox(
            "enemyCollider",
            { width: 0.5, depth: 0.5, height: 1.8 }, 
            this.scene
        );
        this.collider.isVisible = false;
        this.collider.checkCollisions = true;
        
        this.collider.ellipsoid = new Vector3(0.2, 0.9, 0.2);
        this.collider.ellipsoidOffset = new Vector3(0, 0.9, 0);

        this.root = new TransformNode("enemy_root", this.scene);
        this.root.parent = this.collider;
        this.root.position = new Vector3(0, -0.8, 0);
        this.root.rotationQuaternion = Quaternion.Identity();

        this.mesh = null;
        this.anims = {};
        this.isLoaded = false;
        this.currentAnimName = "";

        this._chargerModele(fileName, startRow, startCol);
    }

    async _chargerModele(fileName, row, col) {
        try {
            const result = await SceneLoader.ImportMeshAsync(
    "", 
    "assets/monstre/", 
    fileName, 
    this.scene
);
            this.mesh = result.meshes[0];
            this.mesh.parent = this.root;
            this.mesh.rotation.y = Math.PI;

            const totalSize = this.maze.length * this.caseSize;
            this.collider.position.set(
                (col * this.caseSize) - (totalSize / 2) + (this.caseSize / 2),
                0.9,
                (row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
            );

            result.animationGroups.forEach((group) => {
                this.anims[group.name.toLowerCase()] = group;
                group.stop();
            });

            this.isLoaded = true;
            this._jouerAnim("running");
        } catch (e) { console.error("Erreur monstre:", e); }
    }

    _jouerAnim(nom) {
        const anim = this.anims[nom.toLowerCase()];
        if (!this.isLoaded || !anim || this.currentAnimName === nom) return;
        if (this.currentAnimName && this.anims[this.currentAnimName]) this.anims[this.currentAnimName].stop();
        anim.play(true);
        this.currentAnimName = nom;
    }

    _distanceXZ(posA, posB) {
        return Math.sqrt(Math.pow(posA.x - posB.x, 2) + Math.pow(posA.z - posB.z, 2));
    }

    getPosition() { return this.collider ? this.collider.position : Vector3.Zero(); }
    getCollisionRadius() { return this.collisionRadius; }

    appliquerPoussee(pushVector) {
        if (!this.collider || !pushVector) return;
        const push = pushVector.clone();
        push.y = 0; 
        
        this.collider.moveWithCollisions(push);
        
        
        if (this.collider.position.y !== 0.9) {
            this.collider.position.y = 0.9;
        }
    }

    update(playerPosition) {
        if (!this.isLoaded || !this.collider || !playerPosition) return;

        this.frameCount++;
        const enemyPos = this.collider.position;

        if (this._distanceXZ(enemyPos, this.lastPosition) < 0.005) {
            this.stuckCounter++;
        } else {
            this.stuckCounter = 0;
        }
        if (this.stuckCounter > 15) { this.stuckMode = 20; this.stuckCounter = 0; }
        this.lastPosition.copyFrom(enemyPos);

        const distJoueur = this._distanceXZ(enemyPos, playerPosition);

        if (this.frameCount % RECALCUL_INTERVAL === 0 || this.chemin.length === 0) {
            this.chemin = aStar(this.maze, this._worldToGrid(enemyPos), this._worldToGrid(playerPosition)) || [];
            if (this.chemin.length > 0) this.chemin.shift();
        }

        let cibleMonde = null;
        if (distJoueur <= DIRECT_CHASE_DISTANCE) {
            const dir = playerPosition.subtract(enemyPos).normalize();
            cibleMonde = playerPosition.subtract(dir.scale(STOP_DISTANCE));
        } else if (this.chemin.length > 0) {
            cibleMonde = this._gridToWorld(this.chemin[0].row, this.chemin[0].col);
        }

        if (!cibleMonde) return;

        let direction = cibleMonde.subtract(enemyPos);
        direction.y = 0;

        if (this.stuckMode > 0) {
            const angle = Math.PI / 3; 
            const x = direction.x * Math.cos(angle) - direction.z * Math.sin(angle);
            const z = direction.x * Math.sin(angle) + direction.z * Math.cos(angle);
            direction.set(x, 0, z);
            this.stuckMode--;
        }

        const distCible = direction.length();
        if (distCible < 0.05) return;

        direction.normalize();
        const yaw = Math.atan2(direction.x, direction.z);
        Quaternion.SlerpToRef(this.root.rotationQuaternion, Quaternion.FromEulerAngles(0, yaw, 0), VITESSE_ROTATION, this.root.rotationQuaternion);

        this.collider.moveWithCollisions(direction.scale(Math.min(VITESSE, distCible)));
        
        
        if (this.collider.position.y !== 0.9) {
            this.collider.position.y = 0.9;
        }

        this._jouerAnim("running");
    }

    _worldToGrid(pos) {
        const sz = this.maze.length * this.caseSize;
        return { row: Math.floor((pos.z + sz / 2) / this.caseSize), col: Math.floor((pos.x + sz / 2) / this.caseSize) };
    }

    _gridToWorld(row, col) {
        const sz = this.maze.length * this.caseSize;
        return new Vector3((col * this.caseSize) - (sz / 2) + (this.caseSize / 2), 0.9, (row * this.caseSize) - (sz / 2) + (this.caseSize / 2));
    }

    dispose() {
        Object.values(this.anims).forEach(a => a.stop());
        if (this.collider) this.collider.dispose();
    }
}