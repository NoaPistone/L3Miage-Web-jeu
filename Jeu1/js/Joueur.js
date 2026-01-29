export default class Joueur {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 50;
        this.speed = 4;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    move() {
    this.x += this.vx;
    this.y += this.vy;
    }


}
