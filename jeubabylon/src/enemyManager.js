import { Enemy } from "./enemy";
import { Vector3 } from "@babylonjs/core";

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
const MARGE_SEPARATION = 0.02; // Marge réduite pour coller davantage

export class EnemyManager {
    constructor(scene, level, maze, caseSize, vieManager) {
        this.scene = scene;
        this.maze = maze;
        this.enemies = [];
        this.vieManager = vieManager;
        this.dernierContact = 0;
        this._load(level, maze, caseSize);
    }

    _load(level, maze, caseSize) {
        const configs = enemiesByLevel[level] || [];
        configs.forEach(config => {
            if (maze[config.row] && maze[config.row][config.col] !== 1) {
                this.enemies.push(new Enemy(this.scene, maze, caseSize, config.row, config.col, "monstre1.glb"));
            }
        });
    }

    _resolvePlayerData(playerRef) {
        if (!playerRef) return { position: null };
        if (playerRef.collider) {
            return {
                player: playerRef,
                collider: playerRef.collider,
                position: playerRef.collider.position,
                radius: playerRef.getCollisionRadius ? playerRef.getCollisionRadius() : 0.4
            };
        }
        return { position: playerRef, radius: 0.4 };
    }

    _resoudreContact(enemy, playerData, now) {
        if (!playerData.position) return;

        const enemyPos = enemy.getPosition();
        const playerPos = playerData.position;
        const delta = playerPos.subtract(enemyPos);
        delta.y = 0;
        const dist = delta.length();
        const distMin = enemy.getCollisionRadius() + (playerData.radius || 0.4);

        if (dist >= distMin) return;

        // Gestion des dégâts
        if (now - this.dernierContact > COOLDOWN) {
            this.dernierContact = now;
            if (this.vieManager) this.vieManager.perdreVie(DEGATS);
        }

        const normale = dist > 0.001 ? delta.scale(1 / dist) : new Vector3(1, 0, 0);
        const penetration = distMin - dist + MARGE_SEPARATION;

        // On repousse le monstre vers l'arrière s'il "écrase" le joueur contre un mur
        // mais avec une force modérée pour garder le contact visuel
        const pushEnemy = normale.scale(-penetration * 0.8); 
        enemy.appliquerPoussee(pushEnemy);

        // Le joueur est très peu poussé pour éviter de traverser les murs par erreur
        if (playerData.player && playerData.player.appliquerPoussee) {
            playerData.player.appliquerPoussee(normale.scale(penetration * 0.2));
        }
    }

    update(playerRef) {
        const data = this._resolvePlayerData(playerRef);
        if (!data.position) return;
        const now = Date.now();
        this.enemies.forEach(e => {
            e.update(data.position);
            this._resoudreContact(e, data, now);
        });
    }

    dispose() { this.enemies.forEach(e => e.dispose()); this.enemies = []; }
}