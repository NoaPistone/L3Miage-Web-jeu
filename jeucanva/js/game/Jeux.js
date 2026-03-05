import Joueur from "../objetsJeu/Joueur.js";
import Obstacle from "../objetsJeu/Obstacle.js";
import Piece from "../objetsJeu/Piece.js";
import Sortie from "../objetsJeu/Sortie.js";
import { initListeners } from "./ecouteurs.js";
import { drawScore, drawMessage } from "../utils/utils.js";
import { chargerNiveau } from "./niveaux.js";
import Ennemi from "../objetsJeu/Ennemi.js";
import Menu from "../etats/menu.js";
import GameOver from "../etats/GameOver.js";
import BtnDebloqueSortie from "../objetsJeu/BtnDebloqueSortie.js";
import JeuTermine from "../etats/JeuTermine.js";
import Transition from "../etats/Transition.js";



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
        this.niveau = 1;
        this.etat = "MENU";
        this.menu = new Menu(this.canvas, this.ctx, this);
        this.fin = new GameOver(this.canvas, this.ctx, this);
        this.JeuTermine = new JeuTermine(this.canvas, this.ctx, this);
        this.transition = new Transition(this.canvas, this.ctx, this);
        this.messageAffiche = "";
        this.dureeAffichageMessage = 0;
    }

    init() {
        this.sortieActive = false;
        this.showPieceMessage = true;
        this.joueur = new Joueur(50, 50);
        this.obstacles = [];
        this.pieces = [];
        initListeners(this.inputStates, this.canvas, this);
        let niveauActuel = 1;
        chargerNiveau(this, niveauActuel);
        this.score = 0;
        this.vies = 5;
        this.niveau = 1;
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

    start() {
        console.log("Jeu demarré");
        this.etat = "MENU D'ACCUEIL";
        this.niveau = 1;
        this.score = 0;
        this.vies = 5;
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
        } else if (this.etat === "JEU TERMINE") {
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
                this.joueur.reset(50, 50);
                ennemi.reset();
                console.log("Touché par un ennemi, vies :", this.vies);
            }
        });
        if (this.vies <= 0) {
            this.etat = "GAME OVER";
            this.timerActif = false;
            this.tempsNiveau = 0
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


        if (this.dureeAffichageMessage > 0) {
            this.dureeAffichageMessage = drawMessage(this.ctx, this.canvas, this.messageAffiche, this.dureeAffichageMessage);
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
                this.joueur.x -= this.joueur.vx;
                this.joueur.y -= this.joueur.vy;
                if (this.niveau >= 3) {
                    this.vies--;
                    this.joueur.reset(50, 50);
                    this.score = this.scoreDebutNiveau;
                    this.resetPiecesDuNiveau();
                    if (this.niveau >= 7 && this.ennemis[0]) {
                        this.ennemis[0].reset();
                    }
                    console.log("Obstacle touché, vies restante :", this.vies, "score :", this.score);
                }
            }
        });
    }

    collisionPieces() {
        this.pieces = this.pieces.filter(piece => {
            if (piece.estAtteint(this.joueur)) {
                this.score += 10;
                console.log("Piece attrapée, score :", this.score);
                return false;
            }
            return true;
        });
    }

    collisionSortie() {
        if (this.sortie.estAtteint(this.joueur)) {
            if (this.niveau < 7) {
                this.arreterTimer();
                console.log("Sortie atteinte");
                this.etat = "TRANSITION";
                console.log("niveau :", this.niveau);
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

        if (this.niveau >= 6) {
            this.btn = new BtnDebloqueSortie(500, 500, 30, 30, "#ffa500");
            if (!this.obstacles.includes(this.obsSupp)) {
                this.obstacles.push(this.obsSupp);
            }
        }
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

    afficherMessageDebut(texte) {
        this.messageAffiche = texte;
        this.dureeAffichageMessage = 180;
    }

}

