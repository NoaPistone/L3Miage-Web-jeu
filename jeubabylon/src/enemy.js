import { MeshBuilder, StandardMaterial, Color3, Vector3 } from "@babylonjs/core";
import { aStar } from "./Astar";
 
const ETAT_PATROUILLE = "patrouille";
const ETAT_POURSUITE = "poursuite";
const DETECTION_RADIUS = 12; 
const CONTACT_RADIUS = 1.5;  
const VITESSE = 0.04;        
const RECALCUL_INTERVAL = 60; 
 
export class Enemy {
    constructor(scene, maze, caseSize, startRow, startCol) {
        this.scene = scene;
        this.maze = maze;
        this.caseSize = caseSize;
        this.etat = ETAT_PATROUILLE;
        this.chemin = [];
        this.frameCount = 0;
        this.row = startRow;
        this.col = startCol;
 
        const totalSize = maze.length * caseSize;
 
        
        this.mesh = MeshBuilder.CreateSphere("enemy", { diameter: 1.2 }, scene);
        this.mesh.position.set(
            (startCol * caseSize) - (totalSize / 2) + (caseSize / 2),
            0.6,
            (startRow * caseSize) - (totalSize / 2) + (caseSize / 2)
        );
 
        
        const mat = new StandardMaterial("enemyMat", scene);
        mat.diffuseColor = new Color3(0.8, 0, 0);
        mat.emissiveColor = new Color3(0.4, 0, 0);
        this.mesh.material = mat;
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
            0.6,
            (row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2)
        );
    }
 
    
    _caseAleatoire() {
        const cases = [];
        for (let r = 0; r < this.maze.length; r++) {
            for (let c = 0; c < this.maze[r].length; c++) {
                if (this.maze[r][c] !== 1) cases.push({ row: r, col: c });
            }
        }
        return cases[Math.floor(Math.random() * cases.length)];
    }
 
    update(playerPosition, onContactCallback) {
        if (!this.mesh) return;
 
        this.frameCount++;
 
        
        const dx = playerPosition.x - this.mesh.position.x;
        const dz = playerPosition.z - this.mesh.position.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
 
        
        if (dist < DETECTION_RADIUS) {
            this.etat = ETAT_POURSUITE;
        } else {
            this.etat = ETAT_PATROUILLE;
        }
 
        
        if (dist < CONTACT_RADIUS) {
            onContactCallback();
        }
 
        
        if (this.frameCount % RECALCUL_INTERVAL === 0 || this.chemin.length === 0) {
            const enemyGrid = this._worldToGrid(this.mesh.position);
 
            if (this.etat === ETAT_POURSUITE) {
                
                const playerGrid = this._worldToGrid(playerPosition);
                this.chemin = aStar(this.maze, enemyGrid, playerGrid);
            } else {
                
                const cible = this._caseAleatoire();
                this.chemin = aStar(this.maze, enemyGrid, cible);
            }
 
            
            if (this.chemin.length > 0) this.chemin.shift();
        }
 
        
        if (this.chemin.length > 0) {
            const prochaine = this._gridToWorld(this.chemin[0].row, this.chemin[0].col);
            const direction = prochaine.subtract(this.mesh.position);
            const distCase = direction.length();
 
            if (distCase < 0.2) {
                
                this.chemin.shift();
            } else {
                direction.normalize().scaleInPlace(VITESSE);
                this.mesh.position.addInPlace(direction);
            }
        }
    }
 
    dispose() {
        if (this.mesh) {
            this.mesh.dispose();
            this.mesh = null;
        }
    }
}