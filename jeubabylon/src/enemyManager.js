// EnemyManager.js
import { Enemy } from "./enemy";
 
// Positions des ennemis par niveau (row, col doivent être des cases 0)
const enemiesByLevel = {
    4: [{ row: 3, col: 1 }], // Un seul ennemi (intersection gauche)
    5: [{ row: 3, col: 4 }], // Un seul ennemi (passage central)
    6: [
        { row: 3, col: 2 },  // Ennemi zone gauche
        { row: 5, col: 9 }  // Ennemi zone droite
    ],
    7: [
        { row: 3, col: 4 },  // Gardien zone départ
        { row: 7, col: 10 }, // Gardien centre
        { row: 15, col: 3 },  // Gardien zone basse
        { row: 9, col: 18 }
    ],
    8: [
        { row: 3, col: 4 },
        { row: 7, col: 7 },
        { row: 13, col: 3 },
        { row: 15, col: 9 }
    ],
    9: [
        { row: 3, col: 3 },
        { row: 7, col: 7 },
        { row: 11, col: 4 },
        { row: 15, col: 11 },
        { row: 17, col: 6 }
    ],
};
 
const DEGATS = 10;          // points de vie perdus au contact
const COOLDOWN = 1500;      // ms entre chaque dégât pour éviter le spam
 
export class EnemyManager {
    constructor(scene, level, maze, caseSize, vieManager) {
        this.scene = scene;
        this.enemies = [];
        this.vieManager = vieManager;
        this.dernierContact = 0;
        this._load(level, maze, caseSize);
    }
 
    _load(level, maze, caseSize) {
        const ennemis = enemiesByLevel[level] || [];
 
        ennemis.forEach(e => {
            // Vérifie que la case est bien un 0
            if (maze[e.row] && maze[e.row][e.col] !== 1) {
                this.enemies.push(new Enemy(this.scene, maze, caseSize, e.row, e.col));
            }
        });
    }
 
    update(playerPosition) {
        const now = Date.now();
 
        this.enemies.forEach(enemy => {
            enemy.update(playerPosition, () => {
                // Cooldown pour éviter de perdre 10 points par frame
                if (now - this.dernierContact > COOLDOWN) {
                    this.dernierContact = now;
                    if (this.vieManager) {
                        this.vieManager.perdreVie(DEGATS);
                    }
                    console.log("💀 Contact ennemi ! -10 vie");
                }
            });
        });
    }
 
    dispose() {
        this.enemies.forEach(e => e.dispose());
        this.enemies = [];
    }
}