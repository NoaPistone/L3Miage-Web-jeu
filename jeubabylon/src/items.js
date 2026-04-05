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
    1: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" } // Au milieu du couloir
    ],
    2: [
        { row: 4, col: 2, model: cristal, scale: 0.1, type: "cristal" },
    ],
    3: [
        { row: 1, col: 7, model: piece, scale: 0.2, type: "piece" },
        { row: 4, col: 1, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },
    ],
    4: [
        { row: 1, col: 4, model: piece, scale: 0.2, type: "piece" },       // Juste avant le premier mur
        { row: 4, col: 5, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" }, // Au centre de l'intersection
        { row: 1, col: 10, model: cristal, scale: 0.1, type: "cristal" },  // Cul-de-sac tout en haut à droite
        { row: 6, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }, // Dans le renfoncement en bas à gauche
        { row: 3, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" }
    ],
    5: [
        { row: 1, col: 3, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }, // Début du parcours
        { row: 1, col: 12, model: cristal, scale: 0.1, type: "cristal" },                     // Tout au bout du cul-de-sac en haut
        { row: 5, col: 4, model: piece, scale: 0.2, type: "piece" },                        // Milieu du labyrinthe
        { row: 7, col: 1, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" }, // Début du long couloir final
        { row: 3, col: 12, model: piece, scale: 0.2, type: "piece" },
        { row: 3, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }
    ],
    6: [
        { row: 5, col: 6, model: cristal, scale: 0.1, type: "cristal" },
        //{ row: 5, col: 6, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // croisement central
        //{ row: 3, col: 2, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },   // zone gauche
        { row: 3, col: 2, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },
        { row: 1, col: 11, model: cristal, scale: 0.1, type: "cristal" },                         // zone droite cachée
        { row: 1, col: 3, model: piece, scale: 0.2, type: "piece" },                              // couloir départ
        { row: 7, col: 8, model: piece, scale: 0.2, type: "piece" },                              // couloir final
        { row: 3, col: 1, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },   // Soin ennemi 1
        { row: 5, col: 12, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" }, // Soin ennemi 2
        { row: 1, col: 13, model: piece, scale: 0.2, type: "piece" },
        { row: 7, col: 1, model: piece, scale: 0.2, type: "piece" }
    ],
    7: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" },                              // couloir départ
        { row: 3, col: 4, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    // early, aide à s'orienter
        { row: 5, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },   // zone gauche milieu
        { row: 7, col: 9, model: cristal, scale: 0.1, type: "cristal" },                          // grand couloir central
        { row: 9, col: 9, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },      // zone cachée milieu
        { row: 13, col: 3, model: piece, scale: 0.2, type: "piece" },                             // zone bas gauche
        { row: 15, col: 13, model: cristal, scale: 0.1, type: "cristal" },                        // couloir bas droite
        { row: 18, col: 5, model: piece, scale: 0.2, type: "piece" },
        { row: 1, col: 15, model: piece, scale: 0.2, type: "piece" },
        { row: 3, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },   // Soin ennemi 1
        { row: 7, col: 11, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" }, // Soin ennemi 2
        { row: 12, col: 1, model: cristal, scale: 0.1, type: "cristal" },
        { row: 18, col: 18, model: piece, scale: 0.2, type: "piece" },                        // Pièce cachée coin bas-droite
        { row: 5, col: 18, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }                    // Soin ennemi 3
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