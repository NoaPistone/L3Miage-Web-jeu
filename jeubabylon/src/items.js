const cristal = new URL("./assets/items/cristal.glb", import.meta.url).href;
const piece = new URL("./assets/items/piece.glb", import.meta.url).href;
const carte = new URL("./assets/items/map.glb", import.meta.url).href;
const boost = new URL("./assets/items/eclair.glb", import.meta.url).href;
const bottle = new URL("./assets/items/bottle.glb", import.meta.url).href;
const apple = new URL("./assets/items/apple.glb", import.meta.url).href;
 
// Référence des items disponibles (pour copier-coller facilement) :
//{ row: 1, col: 4, model: bottle, scale: 1.5,   rotationX: -Math.PI / 2, type: "bottle"  }
//{ row: 1, col: 4, model: carte,  scale: 0.009, rotationX:  Math.PI / 2, type: "carte"   }
//{ row: 1, col: 4, model: apple,  scale: 0.6,   rotationX: -Math.PI / 2, type: "apple"   }
//{ row: 1, col: 4, model: boost,  scale: 1.0,   rotationX:  Math.PI / 2, type: "boost"   }
//{ row: 1, col: 4, model: cristal, scale: 0.1,                           type: "cristal" }
//{ row: 1, col: 4, model: piece,  scale: 0.3,                            type: "piece"   }
 
export const itemsByLevel = {
    2: [
        { row: 4, col: 2, model: cristal, scale: 0.1, type: "cristal" },
    ],
    3: [
        { row: 1, col: 7, model: piece, scale: 0.3,   type: "piece" },
        { row: 4, col: 1, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },
    ],
};