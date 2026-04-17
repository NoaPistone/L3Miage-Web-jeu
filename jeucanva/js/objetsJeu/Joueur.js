export default class Joueur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 35;
        this.speed = 4;
        this.angle = 0;
        this.radius = this.size / 2;
    }

    

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        const radius = this.size / 2;

       
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#fffb00"; 
        ctx.fillStyle = "rgba(255, 251, 0, 0.6)";
        ctx.beginPath();
        ctx.arc(-radius * 0.8, 0, radius * 0.4, 0, Math.PI * 2);
        ctx.fill();

       
        ctx.shadowBlur = 5;
        ctx.shadowColor = "white";

        let bodyGrad = ctx.createLinearGradient(-radius, 0, radius, 0);
        bodyGrad.addColorStop(0, "#444");   
        bodyGrad.addColorStop(1, "#fff");  

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(radius, 0);               
        ctx.lineTo(-radius, -radius * 0.8);  
        ctx.lineTo(-radius * 0.5, 0);        
        ctx.lineTo(-radius, radius * 0.8);  
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.fillStyle = "#00ffff";
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(radius * 0.3, 0);
        ctx.lineTo(radius * 1.5, 0);
        ctx.setLineDash([5, 5]); 
        ctx.stroke();

        ctx.restore();
    }

    

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
}
