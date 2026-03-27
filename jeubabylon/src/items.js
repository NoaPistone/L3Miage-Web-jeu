const cristal = new URL("./assets/items/cristal.glb", import.meta.url).href;
const piece = new URL("./assets/items/piece.glb", import.meta.url).href;
const carte = new URL("./assets/items/map.glb", import.meta.url).href;
const boost = new URL("./assets/items/eclair.glb", import.meta.url).href;
const bottle = new URL("./assets/items/bottle.glb", import.meta.url).href;
const apple = new URL("./assets/items/apple.glb", import.meta.url).href;

// Référence des items disponibles  :
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
        { row: 1, col: 7, model: piece, scale: 0.2, type: "piece" },
        { row: 4, col: 1, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },
    ],
    4: [
        { row: 1, col: 4, model: piece, scale: 0.2, type: "piece" },       // couloir du haut
        //{ row: 4, col: 5, model: piece, scale: 0.3, type: "piece" }, 
        { row: 4, col: 5, model: boost,  scale: 1.0,   rotationX:  Math.PI / 2, type: "boost"   }    
    ],
    5: [
        { row: 3, col: 1, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },  // chemin principal
        { row: 2, col: 6, model: cristal, scale: 0.1, type: "cristal" },                        // faux chemin
        { row: 6, col: 4, model: piece, scale: 0.2, type: "piece" },   
        //{ row: 6, col: 4, model: boost,  scale: 1.0,   rotationX:  Math.PI / 2, type: "boost"   }                         // couloir final avant la sortie
    ],
    6: [
        { row: 5, col: 6, model: cristal, scale: 0.1,                           type: "cristal" },
        //{ row: 5, col: 6, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // croisement central
        //{ row: 3, col: 2, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },   // zone gauche
        { row: 3, col: 2, model: boost,  scale: 1.0,   rotationX:  Math.PI / 2, type: "boost"   }  ,
        { row: 1, col: 11, model: cristal, scale: 0.1, type: "cristal" },                         // zone droite cachée
        { row: 1, col: 3, model: piece, scale: 0.2, type: "piece" },                              // couloir départ
        { row: 7, col: 8, model: piece, scale: 0.2, type: "piece" },                              // couloir final
    ],
    7: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" },                              // couloir départ
        { row: 3, col: 4, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // early, aide à s'orienter
        { row: 5, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },   // zone gauche milieu
        { row: 7, col: 9, model: cristal, scale: 0.1, type: "cristal" },                          // grand couloir central
        { row: 9, col: 8, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },      // zone cachée milieu
        { row: 13, col: 3, model: piece, scale: 0.2, type: "piece" },                             // zone bas gauche
        { row: 15, col: 12, model: cristal, scale: 0.1, type: "cristal" },                        // couloir bas droite
        { row: 18, col: 5, model: piece, scale: 0.2, type: "piece" },                             // couloir tout en bas
    ],
    8: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" },                              // couloir départ
        { row: 3, col: 4, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // tôt, aide à s'orienter
        { row: 5, col: 3, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },     // zone gauche
        { row: 7, col: 7, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },      // zone milieu
        { row: 9, col: 6, model: piece, scale: 0.2, type: "piece" },                              // couloir central
        { row: 11, col: 2, model: cristal, scale: 0.1, type: "cristal" },                         // zone bas gauche cachée
        { row: 13, col: 5, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },  // zone milieu bas
        { row: 15, col: 9, model: piece, scale: 0.2, type: "piece" },                             // couloir bas central
        { row: 17, col: 10, model: cristal, scale: 0.1, type: "cristal" },                        // couloir final
    ],
    9: [
        { row: 1, col: 8, model: piece, scale: 0.2, type: "piece" },                              // couloir départ haut
        { row: 1, col: 16, model: cristal, scale: 0.1, type: "cristal" },                         // zone droite cachée haut
        { row: 3, col: 2, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // tôt, aide à s'orienter
        { row: 5, col: 4, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },     // zone gauche milieu
        { row: 7, col: 8, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },      // grand couloir central
        { row: 9, col: 12, model: piece, scale: 0.2, type: "piece" },                             // zone centrale bas
        { row: 11, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },  // zone gauche bas
        { row: 13, col: 11, model: cristal, scale: 0.1, type: "cristal" },                        // zone droite cachée bas
        { row: 17, col: 14, model: piece, scale: 0.2, type: "piece" },                            // couloir final avant sortie
        { row: 18, col: 6, model: piece, scale: 0.2, type: "piece" },                             // couloir tout en bas
    ],
};