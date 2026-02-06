import Joueur from "./Joueur.js";
import Obstacle from "./Obstacle.js";
import Piece from "./Piece.js";
import Sortie from "./Sortie.js";
import { initListeners } from "./ecouteurs.js";
import { drawScore } from "./utils.js";
import Menu from "./etats/menu.js";
import GameOver from "./etats/GameOver.js";



export default class Jeux {
    obstacles = [];
    pieces = [];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        
        this.piecesParNiveau = {};
        this.scoreDebutNiveau = 0;

        this.inputStates = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.vies = 5;
        this.score = 0;
        this.niveau = 1; //1
        this.etat = "MENU";
        //this.etat = "JEU EN COURS";
        this.menu = new Menu(this.canvas, this.ctx, this);
        this.fin = new GameOver(this.canvas, this.ctx, this);
        this.pieceMessageTimer = 0;

        //Pour l'instant j'arrive à le faire fonctionner dans ecouteurs.js mais à long terme faudra mettre la bas
        this.canvas.addEventListener("click", (e) => {
        const rect = this.canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (this.canvas.height / rect.height);

  if (this.etat === "GAME OVER") {
    this.fin.handleClick(mx, my);
  }
});
    }

    init() {
        this.sortieActive = false;
        this.showPieceMessage = true;
        this.pieceMessageTimer = Date.now();
        this.joueur = new Joueur(30, 30);
        this.obstacles = [];
        this.pieces = [];
        initListeners(this.inputStates);
        let niveauActuel = 1; //1
        this.objetNiveau(niveauActuel);
        this.score = 0;
        this.vies = 5;
        this.niveau = 1; //1
        console.log("Jeu initialisé");
    }

    objetNiveau(niveau) {
        this.obstacles = [];
        this.pieces = [];
        this.scoreDebutNiveau = this.score;

        this.piecesParNiveau[niveau] = [];
        const addPiece = (x, y, w, h, color) => {
            this.pieces.push(new Piece(x, y, w, h, color));
            this.piecesParNiveau[niveau].push({ x, y, w, h, color });
        };

        if (niveau == 1) {
            console.log("création obstacles/pièces de niveau 1");
            this.sortieActive = false;

            this.obstacles.push(new Obstacle(141, 0, 33, 439, "black"));
            this.obstacles.push(new Obstacle(331, 141, 33, 497, "black"));
            this.obstacles.push(new Obstacle(456, 414, 166, 33, "black"));
            this.obstacles.push(new Obstacle(249, 17, 249, 33, "black"));
            this.obstacles.push(new Obstacle(414, 166, 124, 33, "black", "horizontal", 2, 348, 580));
            this.obstacles.push(new Obstacle(83, 505, 249, 33, "black"));
             addPiece(166, 456, 17, 17, "yellow");
            addPiece(124, 133, 17, 17, "yellow");
            addPiece(555, 17, 17, 17, "yellow");
            addPiece(555, 398, 17, 17, "yellow");
            addPiece(249, 555, 17, 17, "yellow");


            const size = 120;
            this.sortie = new Sortie(this.canvas.width - size, this.canvas.height - size, size, size);



        }

        if (niveau == 2) {
            this.obstacles.push(new Obstacle(83, 0, 25, 248, "black", "vertical", 3, 0, 373));
            this.obstacles.push(new Obstacle(0, 456, 456, 25, "black"));
            this.obstacles.push(new Obstacle(83, 248, 290, 25, "black"));
            this.obstacles.push(new Obstacle(0, 356, 373, 25, "black", "horizontal", 2, 0, 456));
            this.obstacles.push(new Obstacle(174, 149, 389, 25, "black", 'horizontal', 2, 83, 580));
            this.obstacles.push(new Obstacle(456, 149, 33, 331, "black", 'vertical', 2, 149, 580));
            this.obstacles.push(new Obstacle(191, 75, 331, 17, "black"));
            this.obstacles.push(new Obstacle(108, 564, 422, 25, "black", "horizontal", 1, 100, 580));
            addPiece(555, 25, 17, 17, "yellow");
            addPiece(414, 124, 17, 17, "yellow");
            addPiece(124, 331, 17, 17, "yellow");
            addPiece(439, 199, 17, 17, "yellow");
            addPiece(555, 564, 17, 17, "yellow");
            addPiece(41, 414, 17, 17, "yellow");

            // Sortie
            this.sortie = new Sortie(0, 481, 99, 99, "white");

        }

        /*if (niveau == 3) {

        }*/
    }


    start() {
        console.log("Jeu demarré");
        this.etat = "MENU D'ACCUEIL";
        //this.etat = "JEU EN COURS";
        this.niveau = 1; //1
        this.score = 0;
        this.vies = 5;
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }

    AnimationLoop() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this.etat === "MENU D'ACCUEIL") {
            this.menu.draw();
        } else if (this.etat === "JEU EN COURS") {
            this.update();
            this.drawObjets();
        } else if (this.etat === "GAME OVER") {
            this.fin.draw();
        }


        requestAnimationFrame(this.AnimationLoop.bind(this));
    }



    update() {
        this.obstacles.forEach(objet => {
            objet.update();
        });
        this.deplacementJoueur();
        this.collisionObstacle();
        this.collisionPieces();
        this.collisionSortie();
        if(this.vies <= 0) {
            this.etat = "GAME OVER";
            console.log("jeu terminé");
        }
    }

    deplacementJoueur() {
        this.joueur.vx = 0;
        this.joueur.vy = 0;


        if (this.inputStates.ArrowRight) {
            this.joueur.vx = 6;
        }
        if (this.inputStates.ArrowLeft) {
            this.joueur.vx = -6;
        }

        if (this.inputStates.ArrowUp) {
            this.joueur.vy = -6;
        }

        if (this.inputStates.ArrowDown) {
            this.joueur.vy = 6;
        }

        if (this.joueur.vx !== 0 || this.joueur.vy !== 0) {
            this.joueur.angle = Math.atan2(this.joueur.vy, this.joueur.vx);
        }

        this.joueur.move();
        this.CollisionBordsEcran();
    }

    drawObjets() {
        this.joueur.draw(this.ctx);
        this.sortie.draw(this.ctx, this.sortieActive);
        this.obstacles.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.pieces.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.drawScore();
        if (this.showPieceMessage) {
            let elapsed = Date.now() - this.pieceMessageTimer;
            if (elapsed > 2000) {  
                this.showPieceMessage = false;
            } else {
                let rectWidth = 500;
                let rectHeight = 60;
                let rectX = (this.canvas.width - rectWidth) / 2;
                let rectY = (this.canvas.height - rectHeight) / 2;

                
                this.ctx.save();
                this.ctx.fillStyle = "white";
                this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

                
                this.ctx.fillStyle = "black";
                this.ctx.font = "20px Arial";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Toutes les pièces doivent être collectées !", this.canvas.width / 2, this.canvas.height / 2);

                this.ctx.restore();
            }
        }
        
    }

    drawScore() {
        drawScore(this.ctx, this.canvas, this.score, this.niveau, this.vies);
    }

    CollisionBordsEcran() {
        let demi = this.joueur.size / 2;

        if (this.joueur.x - demi < 0) {
            this.joueur.x = demi;
            this.joueur.vx = 0;
        }

        if (this.joueur.x + demi > this.canvas.width) {
            this.joueur.x = this.canvas.width - demi;
            this.joueur.vx = 0;
        }

        if (this.joueur.y - demi < 0) {
            this.joueur.y = demi;
            this.joueur.vy = 0;
        }

        if (this.joueur.y + demi > this.canvas.height) {
            this.joueur.y = this.canvas.height - demi;
            this.joueur.vy = 0;
        }
    }

    collisionObstacle() {
        this.obstacles.forEach(obstacle => {
            if (obstacle.estAtteint(this.joueur)) {
                this.vies--;
                this.joueur.x = 30;
                this.joueur.y = 30;

                this.resetPiecesDuNiveau();

                console.log("Obstacle touché, vies restante :", this.vies, "score :", this.score);
            }
        });
    }

    collisionPieces() {
        this.pieces = this.pieces.filter(piece => {
            if (piece.estAtteint(this.joueur)) {
                this.score += 10;
                //Re mettre les pieces aussi 
                console.log("Piece attrapée, score :", this.score);
                return false;
            }
            return true;
        });

        if (this.niveau === 1 && this.pieces.length === 0) {
            this.sortieActive = true;
            this.showPieceMessage = false;
        }
    }

    collisionSortie() {
        if (this.sortie.estAtteint(this.joueur)) {
            if (this.niveau === 1 && !this.sortieActive) {
                console.log("Vous devez d'abord collecter toutes les pièces !");
                return;
            }
            console.log("Sortie atteinte");
            this.niveau++;
            console.log("niveau :", this.niveau);

            this.vies = 5;
            this.joueur.x = 30;
            this.joueur.y = 30;
            this.objetNiveau(this.niveau);
        }
    }

    resetPiecesDuNiveau() {
        const cfg = this.piecesParNiveau[this.niveau];
            if (!cfg) return;

        this.pieces = cfg.map(p => new Piece(p.x, p.y, p.w, p.h, p.color));
        this.sortieActive = false;
  }
}

