import Jeux from "./game/Jeux.js";

let canvas = document.querySelector("#Canvas"); // Vérifie bien la majuscule 'C' dans ton index.html
let game = new Jeux(canvas);
game.init();
game.start();