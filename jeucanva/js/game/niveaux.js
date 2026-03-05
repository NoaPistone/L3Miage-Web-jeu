import Joueur from "../objetsJeu/Joueur.js";
import Obstacle from "../objetsJeu/Obstacle.js";
import Piece from "../objetsJeu/Piece.js";
import Sortie from "../objetsJeu/Sortie.js";
import Ennemi from "../objetsJeu/Ennemi.js";
import BtnDebloqueSortie from "../objetsJeu/BtnDebloqueSortie.js";


export function chargerNiveau(jeux, niveau) {
    jeux.obstacles = [];
    jeux.pieces = [];
    jeux.ennemis = [];
    jeux.scoreDebutNiveau = jeux.score;

    jeux.piecesParNiveau[niveau] = [];
    let addPiece = (x, y, w, h, color) => {
        jeux.pieces.push(new Piece(x, y, w, h, color));
        jeux.piecesParNiveau[niveau].push({ x, y, w, h, color });
    };

    if (niveau == 1) {
        console.log("création sortie du niveau 1");
        jeux.sortieActive = false;
        addPiece(166, 456, 17, 17, "yellow");
        addPiece(124, 133, 17, 17, "yellow");
        addPiece(555, 17, 17, 17, "yellow");
        let size = 120;
        jeux.sortie = new Sortie(jeux.canvas.width - size, jeux.canvas.height - size, size, size);
    }

    if (niveau == 2) {
        jeux.obstacles.push(new Obstacle(280, 0, 30, 400, "black"));
        addPiece(250, 456, 17, 17, "yellow");
        addPiece(362, 120, 17, 17, "yellow");
        addPiece(555, 500, 17, 17, "yellow");
        jeux.sortie = new Sortie(450, 10, 100, 100);
    }

    if (niveau == 3) { 
        jeux.obstacles.push(new Obstacle(141, 0, 33, 439, "black"));
        jeux.obstacles.push(new Obstacle(331, 141, 33, 497, "black"));
        addPiece(555, 25, 17, 17, "yellow");
        addPiece(280, 524, 17, 17, "yellow");
        addPiece(104, 331, 17, 17, "yellow");
        addPiece(439, 179, 17, 17, "yellow");
        addPiece(555, 434, 17, 17, "yellow");
        let size = 120;
        jeux.sortie = new Sortie(jeux.canvas.width - size, jeux.canvas.height - size, size, size);
    }

    if (niveau == 4) {
        jeux.obstacles.push(new Obstacle(141, 0, 33, 439, "black"));
        jeux.obstacles.push(new Obstacle(331, 141, 33, 497, "black"));
        jeux.obstacles.push(new Obstacle(456, 414, 166, 33, "black"));
        jeux.obstacles.push(new Obstacle(249, 17, 249, 33, "black"));
        jeux.obstacles.push(new Obstacle(414, 166, 124, 33, "black", "horizontal", 2, 348, 580));
        addPiece(166, 486, 17, 17, "yellow");
        addPiece(104, 133, 17, 17, "yellow");
        addPiece(555, 17, 17, 17, "yellow");
        addPiece(555, 338, 17, 17, "yellow");
        addPiece(249, 555, 17, 17, "yellow");


        let size = 120;
        jeux.sortie = new Sortie(jeux.canvas.width - size, jeux.canvas.height - size, size, size);
    }

    if (niveau == 5) {
        jeux.obstacles.push(new Obstacle(83, 0, 25, 248, "black", "vertical", 2, 0, 373));
        jeux.obstacles.push(new Obstacle(0, 456, 456, 25, "black"));
        jeux.obstacles.push(new Obstacle(83, 248, 290, 25, "black"));
        jeux.obstacles.push(new Obstacle(0, 356, 373, 25, "black", "horizontal", 2, 0, 456));
        jeux.obstacles.push(new Obstacle(174, 149, 389, 25, "black", 'horizontal', 2, 83, 580));

        addPiece(555, 25, 17, 17, "yellow");
        addPiece(414, 124, 17, 17, "yellow");
        addPiece(124, 331, 17, 17, "yellow");
        addPiece(439, 199, 17, 17, "yellow");
        addPiece(555, 564, 17, 17, "yellow");
        addPiece(41, 414, 17, 17, "yellow");

        jeux.sortie = new Sortie(0, 481, 99, 99, "white");
    }

    if (niveau == 6) {
        jeux.obstacles.push(new Obstacle(0, 80, 300, 30, "black"));
        jeux.obstacles.push(new Obstacle(100, 80, 30, 170, "black"));
        jeux.obstacles.push(new Obstacle(0, 410, 300, 30, "black"));
        jeux.obsSupp = new Obstacle(0, 250, 130, 30, "black");
        jeux.obstacles.push(jeux.obsSupp);
        addPiece(160, 135, 17, 17, "yellow");
        addPiece(550, 50, 17, 17, "yellow");
        addPiece(550, 550, 17, 17, "yellow");
        addPiece(80, 550, 17, 17, "yellow");
        addPiece(150, 300, 17, 17, "yellow");

        jeux.sortie = new Sortie(10, 140, 80, 80);
        jeux.btn = new BtnDebloqueSortie(500, 500, 30, 30, "#ffa500");
    }
    if (niveau == 7) {
        jeux.obstacles.push(new Obstacle(0, 80, 300, 30, "black"));
        jeux.obstacles.push(new Obstacle(100, 80, 30, 170, "black"));
        jeux.obstacles.push(new Obstacle(200, 300, 300, 30, "black"));
        jeux.obstacles.push(new Obstacle(0, 410, 300, 30, "black"));
        jeux.obsSupp = new Obstacle(0, 250, 130, 30, "black");
        jeux.obstacles.push(jeux.obsSupp);
        addPiece(160, 135, 17, 17, "yellow");
        addPiece(550, 50, 17, 17, "yellow");
        addPiece(550, 550, 17, 17, "yellow");
        addPiece(80, 550, 17, 17, "yellow");
        addPiece(150, 300, 17, 17, "yellow");

        jeux.sortie = new Sortie(10, 140, 80, 80);
        jeux.btn = new BtnDebloqueSortie(500, 500, 30, 30, "#ffa500");
        jeux.ennemis.push(new Ennemi(300, 200, 30, 30, "red", 250, 2, 5));

    }

    if (niveau === 1) {
        jeux.afficherMessageDebut("Atteignez la ligne d'arrivée !");
    } else if (niveau === 3) {
        jeux.afficherMessageDebut("Les blocs noirs vous tuent !");
    } else if (niveau === 6) {
        jeux.afficherMessageDebut("Activez le bouton orange pour sortir !");
    }
}
