// Sortie.js
const imgSortie = new Image();
imgSortie.src = "./assets/ligne_arrive.png"; // <- ton PNG
let imgLoaded = false;

imgSortie.onload = () => { imgLoaded = true; };
imgSortie.onerror = () => { console.warn("Image sortie introuvable:", imgSortie.src); };

export default class Sortie {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;

    // compat si ailleurs tu utilises w/h ou width/height
    this.width = width;  this.height = height;
    this.w = width;      this.h = height;
  }

  draw(ctx, active = true) {
    const w = this.width ?? this.w;
    const h = this.height ?? this.h;

    ctx.save();

    // option rendre plus sombre si pas active
    ctx.globalAlpha = active ? 1 : 0.45;

    if (imgLoaded) {
      // cover (remplit le carré sans déformer)
      const scale = Math.max(w / imgSortie.width, h / imgSortie.height);
      const dw = imgSortie.width * scale;
      const dh = imgSortie.height * scale;
      const dx = this.x + (w - dw) / 2;
      const dy = this.y + (h - dh) / 2;

      ctx.drawImage(imgSortie, dx, dy, dw, dh);
    } else {
      // fallback si l'image n'est pas encore chargée
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.strokeRect(this.x, this.y, w, h);
    }

    ctx.restore();
  }

  // collision joueur (cercle) vs sortie (rectangle)
  estAtteint(joueur) {
    const w = this.width ?? this.w;
    const h = this.height ?? this.h;

    const cx = joueur.x, cy = joueur.y;
    const r = joueur.size / 2;

    const closestX = Math.max(this.x, Math.min(cx, this.x + w));
    const closestY = Math.max(this.y, Math.min(cy, this.y + h));

    const dx = cx - closestX;
    const dy = cy - closestY;

    return (dx * dx + dy * dy) <= (r * r);
  }
}
