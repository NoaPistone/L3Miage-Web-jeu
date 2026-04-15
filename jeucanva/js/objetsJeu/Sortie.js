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



  draw(ctx) {
    let w = (this.width !== undefined) ? this.width : this.w;
    let h = (this.height !== undefined) ? this.height : this.h;

    ctx.save();
    ctx.translate(this.x, this.y);

    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    
    ctx.shadowBlur = 0;

    
    let borderGrad = ctx.createLinearGradient(0, 0, w, h);
    borderGrad.addColorStop(0, '#00ffff');
    borderGrad.addColorStop(1, '#000066');

    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 4;

   
    const b = 15;

    ctx.beginPath();
    ctx.moveTo(b, 0);               
    ctx.lineTo(w - b, 0);          
    ctx.lineTo(w, b);              
    ctx.lineTo(w, h - b);         
    ctx.lineTo(w - b, h);          
    ctx.lineTo(b, h);               
    ctx.lineTo(0, h - b);         
    ctx.lineTo(0, b);             
    ctx.closePath();
    ctx.stroke();

   
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10; 
    ctx.shadowColor = '#ffffff';

    const pS = 3; 
   
    ctx.fillRect(b - pS / 2, -pS / 2, pS, pS);         
    ctx.fillRect(w - b - pS / 2, -pS / 2, pS, pS);    
    ctx.fillRect(b - pS / 2, h - pS / 2, pS, pS);    
    ctx.fillRect(w - b - pS / 2, h - pS / 2, pS, pS); 

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
