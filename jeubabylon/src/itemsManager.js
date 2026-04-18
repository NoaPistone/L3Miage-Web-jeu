import { SceneLoader, TransformNode } from "@babylonjs/core";
import { itemsByLevel } from "./items";

const COLLECT_RADIUS = 3;

export class ItemManager {
    constructor(scene, level, mazeGrid, caseSize, scoreManager) {
        this.scene = scene;
        this.items = [];
        this.caseSize = caseSize;
        this.mazeHeight = mazeGrid.length;
        this.scoreManager = scoreManager;
        this._load(level, mazeGrid);
    }

    _load(level, mazeGrid) {
        const levelItems = itemsByLevel[level] || [];
        console.log(`📦 Items pour le niveau ${level} :`, levelItems); 

        const totalSize = this.mazeHeight * this.caseSize;
        levelItems.forEach(item => {
            const posX = (item.col * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);
            const posZ = (item.row * this.caseSize) - (totalSize / 2) + (this.caseSize / 2);

            SceneLoader.ImportMesh("", item.model, "", this.scene, (meshes) => {
                const pivot = new TransformNode("pivot_" + Date.now(), this.scene);
                pivot.position.set(posX, 0.8, posZ);
                pivot.scaling.setAll(item.scale || 0.2);

                meshes.forEach(m => {
                    m.rotationQuaternion = null;
                    m.rotation.set(item.rotationX || 0, 0, 0); 
                    m.parent = pivot;
                });

                this.items.push({ meshes: meshes, root: pivot, type: item.type });
            });
        });
    }

    
    update(playerPosition) {
        this.items = this.items.filter(item => {
            if (!item.root) return false;


            item.root.rotation.y += 0.04;


            const dx = playerPosition.x - item.root.position.x;
            const dz = playerPosition.z - item.root.position.z;
            const dist = Math.sqrt(dx * dx + dz * dz);

            if (dist < COLLECT_RADIUS) {
                item.root.dispose(false, true); 
                if (this.scoreManager) {
                    this.scoreManager.addPoints(item.type);
                }
                return false;
            }

            return true;
        });
    }
    
    dispose() {
        this.items.forEach(item => {
            item.meshes.forEach(m => m.dispose());
            if (item.root) item.root.dispose();
        });
        this.items = [];
    }
}