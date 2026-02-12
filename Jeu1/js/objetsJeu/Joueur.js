export default class Joueur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 41;
        this.speed = 4;
        this.angle = 0;
        this.radius =this.size /2;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(this.angle);
        ctx.fillStyle = "#b968d3";
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0,Math.PI*2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(this.size /2,0);
        ctx.strokeStyle ="black";
        ctx.stroke();
        ctx.restore();
        
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
