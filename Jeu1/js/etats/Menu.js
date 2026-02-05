export default class Menu {
    constructor(canvas,ctx,jeux) {
        this.canvas = canvas;
        this.ctx  = ctx;
        this.jeux = jeux;

        this.bouton = {
            x:this.canvas.width/2 - 150,
            y:300,
            w:300,
            h:60
        };

        this.onClick = this.handleClick.bind(this);
        canvas.addEventListener("click",this.onClick);
    }


    draw() {
        this.ctx.save();

        let grad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        grad.addColorStop(0, "#7ae3df");
        grad.addColorStop(1, "#fad0c4");
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 50px 'Verdana', sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.shadowColor = "rgba(0,0,0,0.5)";
        this.ctx.shadowBlur = 10;
        this.ctx.fillText("JEU CANVAS", this.canvas.width / 2, 150);
        this.ctx.fillStyle = "#b968d3";
        //this.ctx.shadowBlur = 5; // moins d'ombre
        //this.ctx.font = "24px 'Verdana', sans-serif";
        //this.ctx.fillText("Arrivez à la sortie et gagnez !", this.canvas.width / 2, 210);
        this.ctx.fillRect(
            this.bouton.x,
            this.bouton.y,
            this.bouton.w,
            this.bouton.h
        );

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 30px 'Verdana', sans-serif";
        this.ctx.fillText(
            "DÉMARRER",
            this.bouton.x + this.bouton.w / 2,
            this.bouton.y + 40
        );

        this.ctx.restore();
    }

    handleClick(event) {
        console.log("CLICK DETECTÉ");
        this.jeux.etat = "JEU EN COURS";
        let rect = this.canvas.getBoundingClientRect();
        let mx = event.clientX - rect.left;
        let my = event.clientY - rect.top;

        if (
            mx > this.bouton.x &&
            mx < this.bouton.x + this.bouton.w &&
            my > this.bouton.y &&
            my < this.bouton.y + this.bouton.h
        ) {
            console.log("BOUTON OK → PLAY");
            this.jeux.init();
            this.jeux.etat = "JEU EN COURS";
        }
    }

}