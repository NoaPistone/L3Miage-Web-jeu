const imgSortie = new Image();
imgSortie.src = "./assets/ligne_arrive.png"; 
let imgLoaded = false;

imgSortie.onload = () => { imgLoaded = true; };
imgSortie.onerror = () => { console.warn("Image sortie introuvable:", imgSortie.src); };

export default class Sortie {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width; this.height = height;
    this.w = width; this.h = height;
  }


  draw(ctx, active = true) {
    let w = (this.width !== undefined) ? this.width : this.w;
    let h = (this.height !== undefined) ? this.height : this.h;
    ctx.save();
    ctx.translate(this.x + w / 2, this.y + h / 2);

    if (imgLoaded) {
      ctx.drawImage(imgSortie, -w / 2, -h / 2, w, h);
    } else {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
    }

    ctx.restore();
  }



  estAtteint(joueur) {
    let w = this.width ?? this.w;
    let h = this.height ?? this.h;

    let cx = joueur.x, cy = joueur.y;
    let r = joueur.size / 2;

    let closestX = Math.max(this.x, Math.min(cx, this.x + w));
    let closestY = Math.max(this.y, Math.min(cy, this.y + h));

    let dx = cx - closestX;
    let dy = cy - closestY;

    return (dx * dx + dy * dy) <= (r * r);
  }
}
