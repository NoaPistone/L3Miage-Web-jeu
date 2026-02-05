import Joueur from "./Joueur.js";
import Obstacle from "./Obstacle.js";
import Piece from "./Piece.js";
import Sortie from "./Sortie.js";
import { initListeners } from "./ecouteurs.js";
import { drawScore } from "./utils.js";
import Menu from "./etats/menu.js";



export default class Jeux {
    obstacles = [];
    pieces = [];

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
        this.niveau = 1; //1
        this.etat = "MENU";
        //this.etat = "JEU EN COURS";
        this.menu = new Menu(this.canvas,this.ctx,this);
        this.pieceMessageTimer = 0;

        
    }

    init() {
        this.sortieActive = false;
        this.showPieceMessage = false;
        this.joueur = new Joueur(40,40);
        this.obstacles = [];
        this.pieces = [];
        initListeners(this.inputStates);
        let niveauActuel = 1; //1
        this.objetNiveau(niveauActuel);
        this.score = 0;
        this.vies = 3;
        this.niveau = 1; //1
        console.log("Jeu initialisé");
    }

    objetNiveau(niveau) {
        this.obstacles = [];
        this.pieces = [];
        if (niveau == 1) {
            console.log("création obstacles/pièces de niveau 1");
            this.showPieceMessage = true;
            this.pieceMessageTimer = Date.now();
            this.sortieActive = false;
            this.obstacles.push(new Obstacle(170,0,40,530,"black"));
            this.obstacles.push(new Obstacle(400,170,40,600,"black"));
            this.obstacles.push(new Obstacle(550,500,200,40,"black"));
            this.obstacles.push(new Obstacle(300, 20, 300, 40, "black"));
            this.obstacles.push(new Obstacle(500,200,150,40,'black','horizontal',2,420,700));
            this.obstacles.push(new Obstacle(100,610,300,40,'black'));
            this.pieces.push(new Piece(200,550,20,20,"yellow"));
            this.pieces.push(new Piece(150,160,20,20,"yellow"));
            this.pieces.push(new Piece(670, 20, 20, 20, "yellow"));
            this.pieces.push(new Piece(670, 480, 20, 20, "yellow"));
            this.pieces.push(new Piece(300, 670, 20, 20, "yellow"));

            
            this.sortie = new Sortie(580,580,120,120,"white");
            
        }

        if (niveau == 2) {
            this.obstacles.push(new Obstacle(100, 0, 30, 300, "black","vertical",3,0,450)); 
            this.obstacles.push(new Obstacle(0, 550, 550, 30, "black")); 
            this.obstacles.push(new Obstacle(100, 300, 350, 30, "black")); 
            this.obstacles.push(new Obstacle(0, 430, 450, 30, "black","horizontal",2,0,550)); 
            this.obstacles.push(new Obstacle(210, 180, 470, 30, "black",'horizontal',2,100,700));
            this.obstacles.push(new Obstacle(550, 180, 40, 400, "black",'vertical',2,180,700)); 
            this.obstacles.push(new Obstacle(230, 90, 400, 20, "black"));
            this.obstacles.push(new Obstacle(130, 680, 510, 30, "black","horizontal",1,120,700));

            this.pieces.push(new Piece(670, 30, 20, 20, "yellow"));   
            this.pieces.push(new Piece(500, 150, 20, 20, "yellow"));  
            this.pieces.push(new Piece(150, 400, 20, 20, "yellow"));  
            this.pieces.push(new Piece(530, 240, 20, 20, "yellow"));  
            this.pieces.push(new Piece(670, 680, 20, 20, "yellow"));
            this.pieces.push(new Piece(50, 500, 20, 20, "yellow"));
            // Ajoute l'ennemie plus tard et faire une class
            // this.ennemis = [new Ennemi(300,300)];

            this.sortie = new Sortie(0,580,120,120,"white");
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
        this.vies = 3;
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }

    AnimationLoop() {
        this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
        if (this.etat === "MENU D'ACCUEIL") {
            this.menu.draw();
        } else if (this.etat === "JEU EN COURS") {
            this.update();
            this.drawObjets();
        }

        
        requestAnimationFrame(this.AnimationLoop.bind(this));
    }

    

    update() {
        this.obstacles.forEach(o => o.update && o.update());
        
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
        this.drawScore();
        if (this.showPieceMessage) {
            let elapsed = Date.now() - this.pieceMessageTimer;
            if (elapsed > 2000) {  // 10 secondes
                this.showPieceMessage = false;
            } else {
                let rectWidth = 500;
                let rectHeight = 60;
                let rectX = (this.canvas.width - rectWidth) / 2;
                let rectY = (this.canvas.height - rectHeight) / 2;

            // Dessiner le rectangle blanc
                this.ctx.save();
                this.ctx.fillStyle = "white";
                this.ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Dessiner le texte noir centré
                this.ctx.fillStyle = "black";
                this.ctx.font = "20px Arial";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText("Toutes les pièces doivent être collectées !", this.canvas.width / 2, this.canvas.height / 2);

                this.ctx.restore();
            }
        }
        /*this.joueur.draw(this.ctx);
        this.sortie.draw(this.ctx);
        this.obstacles.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.pieces.forEach(obj => {
            obj.draw(this.ctx);
        });
        this.drawScore();*/
    }

    drawScore() {
        drawScore(this.ctx,this.canvas,this.score,this.niveau,this.vies);
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
                //Re mettre les pieces aussi 
                console.log("Piece attrapée, score :",this.score);
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
            
            this.joueur.x = 40;
            this.joueur.y = 40;
            this.objetNiveau(this.niveau);
        }
    }
}

