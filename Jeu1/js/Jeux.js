import Joueur from "./Joueur.js";
import Obstacle from "./Obstacle.js";
import Piece from "./Piece.js";
import Sortie from "./Sortie.js";
import { initListeners } from "./ecouteurs.js";


export default class Jeux {
    obstacles = [];
    pieces = [];
    //sortieTestee  = false;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.inputStates = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.vies = 3;
        this.score = 0;
        this.niveau =1;

        
    }

    init() {
        this.joueur = new Joueur(40,40);

        initListeners(this.inputStates);
        let niveauActuel = 1;
        this.objetNiveau(niveauActuel);
        this.score = 0;
        this.vies = 3;
        this.niveau = 1;
        console.log("Jeu initialisé");
    }

    objetNiveau(niveau) {
        if (niveau == 1) {
            console.log("création obstacles/pièces de niveau 1");
            this.obstacles.push(new Obstacle(170,0,40,530,"black"));
            this.obstacles.push(new Obstacle(400,170,40,600,"black"));
            this.obstacles.push(new Obstacle(550,500,200,40,"black"));
            //this.obstacles.push(new Obstacle(400, 0, 200, 20, "black"));
            this.pieces.push(new Piece(200,550,20,20,"yellow"));
            this.pieces.push(new Piece(150,160,20,20,"yellow"));
            this.pieces.push(new Piece(670, 20, 20, 20, "yellow"));
            this.pieces.push(new Piece(670, 480, 20, 20, "yellow")); 
            this.sortie = new Sortie(580,580,120,120,"white");
        }

        

        /*if(niveau == 2) {

        }

        if (niveau == 3) {

        }*/
    }

    
    start() {
        console.log("Jeu demarré");
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }

    AnimationLoop() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        this.drawObjets();
        this.update();
        // this.drawObjets();
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }

    

    update() {
        this.deplacementJoueur();
        this.collisionObstacle();
        this.collisionPieces();
        this.collisionSortie();
    }

    deplacementJoueur() {
        this.joueur.vx = 0;
        this.joueur.vy = 0;

        
       if(this.inputStates.ArrowRight) {
            this.joueur.vx = 7;
        } 
        if(this.inputStates.ArrowLeft) {
            this.joueur.vx = -7;
        } 

        if(this.inputStates.ArrowUp) {
            this.joueur.vy = -7;
        } 

        if(this.inputStates.ArrowDown) {
            this.joueur.vy = 7;
        } 

        if (this.joueur.vx !== 0 || this.joueur.vy !== 0) {
        this.joueur.angle = Math.atan2(this.joueur.vy, this.joueur.vx);
        }

        this.joueur.move();
        this.CollisionBordsEcran();
    }

    drawObjets() {
        this.joueur.draw(this.ctx);
        this.sortie.draw(this.ctx);
        this.obstacles.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.pieces.forEach(obj => {
            obj.draw(this.ctx);
        });
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
            if(obstacle.estAtteint(this.joueur)) {
                this.vies --;
                this.joueur.x = 40;
                this.joueur.y = 40;

                console.log("Obstacle touché, vies restante :", this.vies, "score :",this.score);
            }
        });
    }

    collisionPieces() {
        this.pieces = this.pieces.filter(piece => {
            if (piece.estAtteint(this.joueur)) {
                this.score += 10;
                //Re mettre les pieces aussi ? 
                console.log("Piece attrapée, score :",this.score);
                return false;
            }
            return true;
        });
    }

    collisionSortie() {
        if (this.sortie.estAtteint(this.joueur)) {
            console.log("Sortie atteinte");
            this.niveau++;
            console.log("niveau :", this.niveau);
            //this.initNiveau();
        }
    }
}

