import { Enemy } from "./enemy";

const enemiesByLevel = {
    4: [{ row: 3, col: 1 }],
    5: [{ row: 3, col: 4 }],
    6: [{ row: 3, col: 2 }, { row: 5, col: 9 }],
    7: [{ row: 3, col: 4 }, { row: 7, col: 10 }, { row: 15, col: 3 }, { row: 9, col: 18 }],
    8: [{ row: 3, col: 4 }, { row: 7, col: 7 }, { row: 13, col: 3 }, { row: 15, col: 9 }],
    9: [{ row: 3, col: 3 }, { row: 7, col: 7 }, { row: 11, col: 4 }, { row: 15, col: 11 }, { row: 17, col: 6 }],
};

const DEGATS = 10;
const COOLDOWN = 1000;

export class EnemyManager {
    constructor(scene, level, maze, caseSize, vieManager) {
        this.scene = scene;
        this.maze = maze; // Stocker le maze pour y accéder dans _load
        this.enemies = [];
        this.vieManager = vieManager;
        this.dernierContact = 0;
        this._load(level, maze, caseSize);
    }

    _load(level, maze, caseSize) {
        const ennemisConfigs = enemiesByLevel[level] || [];

        ennemisConfigs.forEach((config) => {
            if (maze[config.row] && maze[config.row][config.col] !== 1) {
                // TEST : Tous les ennemis utilisent monstre1.glb
                const fileName = "monstre1.glb";
                const newEnemy = new Enemy(this.scene, maze, caseSize, config.row, config.col, fileName);
                this.enemies.push(newEnemy);
            }
        });
    }

    update(playerPosition) {
        const now = Date.now();
        this.enemies.forEach(enemy => {
            enemy.update(playerPosition, () => {
                if (now - this.dernierContact > COOLDOWN) {
                    this.dernierContact = now;
                    if (this.vieManager) this.vieManager.perdreVie(DEGATS);
                    console.log("💀 Contact monstre !");
                }
            });
        });
    }

    dispose() {
        this.enemies.forEach(e => e.dispose());
        this.enemies = [];
    }
}