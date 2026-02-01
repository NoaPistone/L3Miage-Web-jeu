import Jeux from "./Jeux.js";

let canvas = document.querySelector("#Canvas");
let game = new Jeux(canvas);
game.init();
game.start();


