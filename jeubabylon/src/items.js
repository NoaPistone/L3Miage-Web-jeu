const cristal = new URL("./assets/items/cristal.glb", import.meta.url).href;
const piece = new URL("./assets/items/piece.glb", import.meta.url).href;
const carte = new URL("./assets/items/map.glb", import.meta.url).href;
const boost = new URL("./assets/items/eclair.glb", import.meta.url).href;
const bottle = new URL("./assets/items/bottle.glb", import.meta.url).href;
const apple = new URL("./assets/items/apple.glb", import.meta.url).href;


export const itemsByLevel = {
    1: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" } 
    ],
    2: [
        { row: 4, col: 2, model: cristal, scale: 0.1, type: "cristal" },
    ],
    3: [
        { row: 1, col: 7, model: piece, scale: 0.2, type: "piece" },
        { row: 4, col: 1, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },
    ],
    4: [
        { row: 1, col: 4, model: piece, scale: 0.2, type: "piece" },       
        { row: 4, col: 5, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },
        { row: 1, col: 10, model: cristal, scale: 0.1, type: "cristal" },  
        { row: 6, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }, 
        { row: 3, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" }
    ],
    5: [
        { row: 1, col: 3, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }, 
        { row: 1, col: 12, model: cristal, scale: 0.1, type: "cristal" },                     
        { row: 5, col: 4, model: piece, scale: 0.2, type: "piece" },                       
        { row: 7, col: 1, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" }, 
        { row: 3, col: 12, model: piece, scale: 0.2, type: "piece" },
        { row: 3, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }
    ],
    6: [
        { row: 5, col: 6, model: cristal, scale: 0.1, type: "cristal" },
        { row: 3, col: 2, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },
        { row: 1, col: 11, model: cristal, scale: 0.1, type: "cristal" },                         
        { row: 1, col: 3, model: piece, scale: 0.2, type: "piece" },                              
        { row: 7, col: 8, model: piece, scale: 0.2, type: "piece" },                            
        { row: 3, col: 1, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },   
        { row: 5, col: 12, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },
        { row: 1, col: 13, model: piece, scale: 0.2, type: "piece" },
        { row: 7, col: 1, model: piece, scale: 0.2, type: "piece" }
    ],
    7: [
        { row: 1, col: 5, model: piece, scale: 0.2, type: "piece" },                              
        { row: 3, col: 4, model: carte, scale: 0.009, rotationX: Math.PI / 2, type: "carte" },    
        { row: 5, col: 3, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },   
        { row: 7, col: 9, model: cristal, scale: 0.1, type: "cristal" },                          
        { row: 9, col: 9, model: boost, scale: 1.0, rotationX: Math.PI / 2, type: "boost" },      
        { row: 13, col: 3, model: piece, scale: 0.2, type: "piece" },                             
        { row: 15, col: 13, model: cristal, scale: 0.1, type: "cristal" },                        
        { row: 18, col: 5, model: piece, scale: 0.2, type: "piece" },
        { row: 1, col: 15, model: piece, scale: 0.2, type: "piece" },
        { row: 3, col: 2, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" },   
        { row: 7, col: 11, model: bottle, scale: 1.5, rotationX: -Math.PI / 2, type: "bottle" },
        { row: 12, col: 1, model: cristal, scale: 0.1, type: "cristal" },
        { row: 18, col: 18, model: piece, scale: 0.2, type: "piece" },                        
        { row: 5, col: 18, model: apple, scale: 0.6, rotationX: -Math.PI / 2, type: "apple" }                    
    ],
};