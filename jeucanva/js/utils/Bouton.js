export default class Bouton { 
    constructor(x, y, w, h, texte, callback) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.texte = texte;
        this.callback = callback;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.w, this.h);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.w, this.h);

        ctx.fillStyle = "black";
        ctx.font = "bold 28px Bungee";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillText(this.texte, this.x + this.w / 2, this.y + this.h / 2);
        ctx.restore();
    }

    handleClick(mx, my) {
        if (mx >= this.x && mx <= this.x + this.w && my >= this.y && my <= this.y + this.h) {
            this.callback();
        }
    }
}
