import Joueur from "./objetsJeu/Joueur.js";
import Obstacle from "./objetsJeu/Obstacle.js";
import Piece from "./objetsJeu/Piece.js";
import Sortie from "./objetsJeu/Sortie.js";
import { initListeners } from "./ecouteurs.js";
import { drawScore } from "./utils/utils.js";
import Ennemi from "./objetsJeu/Ennemi.js";
import Menu from "./etats/menu.js";
import GameOver from "./etats/GameOver.js";
import BtnDebloqueSortie from "./objetsJeu/BtnDebloqueSortie.js";
import JeuTermine from "./etats/JeuTermine.js";
import Transition from "./etats/Transition.js";

let debug = 3;

export default class Jeux {
    obstacles = [];
    pieces = [];
    ennemis = [];

    tempsDebutNiveau = 0;
    tempsNiveau = 0;
    timerActif = false;

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
        this.JeuTermine = new JeuTermine(this.canvas,this.ctx,this);
        this.transition = new Transition(this.canvas,this.ctx,this);

        //Pour l'instant j'arrive à le faire fonctionner dans ecouteurs.js mais à long terme faudra mettre la bas
        /*this.canvas.addEventListener("click", (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            const my = (e.clientY - rect.top) * (this.canvas.height / rect.height);

            if (this.etat === "GAME OVER") {
                this.fin.handleClick(mx, my);
            }
        });*/
    }

    init() {
        this.sortieActive = false;
        this.showPieceMessage = true;
        this.joueur = new Joueur(30, 30);
        this.obstacles = [];
        this.pieces = [];
        initListeners(this.inputStates, this.canvas,this);
        let niveauActuel = 1; //1
        //let niveauActuel = debug ?? 1; //sup quand test fini
        //this.niveau = niveauActuel; // a supp aussi
        this.objetNiveau(niveauActuel);
        this.score = 0;
        this.vies = 5;
        this.niveau = 1; //1
        console.log("Jeu initialisé");
    }

    demarrerTimer() {
        this.tempsDebutNiveau = Date.now();
        this.timerActif = true;
    }

    arreterTimer() {
        let maintenant = Date.now();
        this.tempsNiveau = (maintenant - this.tempsDebutNiveau) / 1000;
        console.log(`Temps du niveau : ${this.tempsNiveau.toFixed(2)} secondes`);
        this.timerActif = false;
        console.log(`Temps du niveau : ${this.tempsNiveau.toFixed(2)} secondes`);
    }

    objetNiveau(niveau) {
        this.obstacles = [];
        this.pieces = [];
        this.ennemis = [];
        this.scoreDebutNiveau = this.score;

        this.piecesParNiveau[niveau] = [];
        const addPiece = (x, y, w, h, color) => {
            this.pieces.push(new Piece(x, y, w, h, color));
            this.piecesParNiveau[niveau].push({ x, y, w, h, color });
        };

        if (niveau == 1) {
            console.log("création sortie du niveau 1");
            this.sortieActive = false;
            addPiece(166, 456, 17, 17, "yellow");
            addPiece(124, 133, 17, 17, "yellow");
            addPiece(555, 17, 17, 17, "yellow");
            let size = 120;
            this.sortie = new Sortie(this.canvas.width - size, this.canvas.height - size, size, size);
        }

        if (niveau == 2) {
            this.obstacles.push(new Obstacle(280, 0, 30, 400, "black"));
            addPiece(250, 456, 17, 17, "yellow");
            addPiece(362, 120, 17, 17, "yellow");
            addPiece(555, 500, 17, 17, "yellow");
            this.sortie = new Sortie(450, 10, 100, 100);
        }

        if (niveau == 3) { // si on touche les obstacles on perd une vie et on revient au debut
            this.obstacles.push(new Obstacle(141, 0, 33, 439, "black"));
            this.obstacles.push(new Obstacle(331, 141, 33, 497, "black"));
            addPiece(555, 25, 17, 17, "yellow");
            addPiece(280, 524, 17, 17, "yellow");
            addPiece(104, 331, 17, 17, "yellow");
            addPiece(439, 179, 17, 17, "yellow");
            addPiece(555, 434, 17, 17, "yellow");
            let size = 120;
            this.sortie = new Sortie(this.canvas.width - size, this.canvas.height - size, size, size);
        }

        if (niveau == 4) {
            this.obstacles.push(new Obstacle(141, 0, 33, 439, "black"));
            this.obstacles.push(new Obstacle(331, 141, 33, 497, "black"));
            this.obstacles.push(new Obstacle(456, 414, 166, 33, "black"));
            this.obstacles.push(new Obstacle(249, 17, 249, 33, "black"));
            this.obstacles.push(new Obstacle(414, 166, 124, 33, "black", "horizontal", 2, 348, 580));
            addPiece(166, 486, 17, 17, "yellow");
            addPiece(104, 133, 17, 17, "yellow");
            addPiece(555, 17, 17, 17, "yellow");
            addPiece(555, 338, 17, 17, "yellow");
            addPiece(249, 555, 17, 17, "yellow");


            const size = 120;
            this.sortie = new Sortie(this.canvas.width - size, this.canvas.height - size, size, size);
        }

        if (niveau == 5) {
            this.obstacles.push(new Obstacle(83, 0, 25, 248, "black", "vertical", 2, 0, 373));
            this.obstacles.push(new Obstacle(0, 456, 456, 25, "black"));
            this.obstacles.push(new Obstacle(83, 248, 290, 25, "black"));
            this.obstacles.push(new Obstacle(0, 356, 373, 25, "black", "horizontal", 2, 0, 456));
            this.obstacles.push(new Obstacle(174, 149, 389, 25, "black", 'horizontal', 2, 83, 580));

            addPiece(555, 25, 17, 17, "yellow");
            addPiece(414, 124, 17, 17, "yellow");
            addPiece(124, 331, 17, 17, "yellow");
            addPiece(439, 199, 17, 17, "yellow");
            addPiece(555, 564, 17, 17, "yellow");
            addPiece(41, 414, 17, 17, "yellow");

            // Sortie
            this.sortie = new Sortie(0, 481, 99, 99, "white");
        }

        if (niveau == 6) {
            this.obstacles.push(new Obstacle(0, 80, 300, 30, "black"));
            this.obstacles.push(new Obstacle(100, 80, 30, 170, "black"));
            this.obstacles.push(new Obstacle(0, 410, 300, 30, "black"));
            this.obsSupp = new Obstacle(0, 250, 130, 30, "black");
            this.obstacles.push(this.obsSupp);
            addPiece(160, 135, 17, 17, "yellow");
            addPiece(550, 50, 17, 17, "yellow");
            addPiece(550, 550, 17, 17, "yellow");
            addPiece(80, 550, 17, 17, "yellow");
            addPiece(150, 300, 17, 17, "yellow");

            this.sortie = new Sortie(10, 140, 80, 80);
            this.btn = new BtnDebloqueSortie(500, 500, 30, 30, "#ffa500");
        }
        if (niveau == 7) {
            this.obstacles.push(new Obstacle(0, 80, 300, 30, "black"));
            this.obstacles.push(new Obstacle(100, 80, 30, 170, "black"));
            this.obstacles.push(new Obstacle(200, 300, 300, 30, "black"));
            this.obstacles.push(new Obstacle(0, 410, 300, 30, "black"));
            this.obsSupp = new Obstacle(0, 250, 130, 30, "black");
            this.obstacles.push(this.obsSupp);
            addPiece(160, 135, 17, 17, "yellow");
            addPiece(550, 50, 17, 17, "yellow");
            addPiece(550, 550, 17, 17, "yellow");
            addPiece(80, 550, 17, 17, "yellow");
            addPiece(150, 300, 17, 17, "yellow");

            this.sortie = new Sortie(10, 140, 80, 80);
            this.btn = new BtnDebloqueSortie(500, 500, 30, 30, "#ffa500");
            this.ennemis.push(new Ennemi(300, 200, 30, 30, "red", 250, 2, 5));
        }
    }


    start() {
        console.log("Jeu demarré");
        this.etat = "MENU D'ACCUEIL";
        //this.etat = "JEU EN COURS";
        this.niveau = 1; //1
        //this.niveau = debug ?? 1; //a supp
        this.score = 0;
        this.vies = 5;
        //this.objetNiveau(this.niveau);//a supp
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }


    AnimationLoop() {
        if (this.etat === "MENU D'ACCUEIL") {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.menu.draw();
        } else if (this.etat === "JEU EN COURS") {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.update();
            this.drawObjets();
        } else if (this.etat === "GAME OVER") {
            this.fin.draw();
        } else if (this.etat=== "JEU TERMINE") {
            this.JeuTermine.draw();
        } else if (this.etat === "TRANSITION") {
            this.transition.draw();
        }


        requestAnimationFrame(this.AnimationLoop.bind(this));
    }



    update() {
        this.obstacles.forEach(objet => {
            objet.update();
        });
        this.deplacementJoueur();
        this.collisionPieces();
        this.collisionObstacle();
        this.collisionSortie();
        this.ennemis.forEach(ennemi => {
            ennemi.update(this.joueur);

            if (ennemi.estAtteint(this.joueur)) {
                this.vies--;
                this.joueur.x = 30;
                this.joueur.y = 30;
                ennemi.reset();
                console.log("Touché par un ennemi, vies :", this.vies);
            }
        });
        if (this.vies <= 0) {
            this.etat = "GAME OVER";
            console.log("jeu terminé");
        }
        if (this.niveau >= 6 && this.btn) {
            if (this.btn.actif && this.btn.estAtteint(this.joueur)) {
                this.btn.desactiver();
                const index = this.obstacles.indexOf(this.obsSupp);
                if (index != -1) {
                    this.obstacles.splice(index, 1);
                }
            }

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
        this.ennemis.forEach(e => e.draw(this.ctx));
        if (this.niveau >= 6 && this.btn) {
            this.btn.draw(this.ctx);
        }

        this.obstacles.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.pieces.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.drawScore();
        this.drawTimer();
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
                this.joueur.x -= this.joueur.vx;
                this.joueur.y -= this.joueur.vy;
                if (this.niveau >= 3) {
                    this.vies--;
                    this.joueur.x = 30;
                    this.joueur.y = 30;
                    this.score = this.scoreDebutNiveau;
                    this.resetPiecesDuNiveau();
                    console.log("Obstacle touché, vies restante :", this.vies, "score :", this.score);
                } 
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

        /*if (this.niveau === 1 && this.pieces.length === 0) {
            this.sortieActive = true;
            this.showPieceMessage = false;
        }*/
    }

    collisionSortie() {
        if (this.sortie.estAtteint(this.joueur)) {
            if (this.niveau < 7) {
                this.arreterTimer();
                console.log("Sortie atteinte");
                this.niveau++;
                console.log("niveau :", this.niveau);
                this.demarrerTimer(); // à enlever
                this.etat = "TRANSITION";

                //this.joueur.x = 30; // a enlever
                //this.joueur.y = 30; // a enlever
                //this.objetNiveau(this.niveau); // a enlever

            } else {
                this.arreterTimer();
                this.etat = "JEU TERMINE";
                console.log("jeu terminé");
            }
        }
    }

    resetPiecesDuNiveau() {
        const cfg = this.piecesParNiveau[this.niveau];
        if (!cfg) return;

        this.pieces = cfg.map(p => new Piece(p.x, p.y, p.w, p.h, p.color));
        this.sortieActive = false;

    }

    getTempsActuel() {
        if (!this.timerActif) {
            return this.tempsNiveau.toFixed(1);
        }
        return ((Date.now() - this.tempsDebutNiveau) / 1000).toFixed(1);
    }


    drawTimer() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "20px Bungee";
        this.ctx.fillText("Temps : " + this.getTempsActuel() + " s", 20, 30);
    }

}

