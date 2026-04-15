function drawScore(ctx,canvas,score,niveau,vies) {
    let centerX = canvas.width / 2;
    ctx.save();
    let width = 180;
    let height = 90;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(centerX - width/2, 5, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - width/2, 5, width, height);

    ctx.fillStyle = "#ffffff"; 
    ctx.font = "bold 20px 'Bungee', sans-serif";
    ctx.textAlign = "center"; 
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 5;
    ctx.fillText("Score : " + score, centerX, 30); 
    ctx.fillText("Niveau : " + niveau, centerX, 60); 
    ctx.fillText("Vies : " + vies, centerX, 90);
    ctx.restore();
}



function drawMessage(ctx, canvas, message, duree) {
    if (!message || duree <= 0) return 0;

    ctx.save();

    
    ctx.font = "16px 'Bungee', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "2px";

    let textMetrics = ctx.measureText(message);
    let rectW = canvas.width; 
    let rectH = 50;
    let rectX = 0;
    let rectY = (canvas.height / 2) - (rectH / 2);

   
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(rectX, rectY, rectW, rectH);

    
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1;
    ctx.shadowColor = "#00ffff";
    ctx.shadowBlur = 10;

    ctx.beginPath();
    ctx.moveTo(0, rectY);
    ctx.lineTo(canvas.width, rectY); 
    ctx.moveTo(0, rectY + rectH);
    ctx.lineTo(canvas.width, rectY + rectH);
    ctx.stroke();

   
    ctx.fillStyle = "#00ffff";
    ctx.shadowBlur = 5;
   
    let textX = canvas.width / 2;
    let textW = textMetrics.width;
    ctx.fillRect(textX - textW/2 - 30, rectY + 15, 4, 20);
    
    ctx.fillRect(textX + textW/2 + 26, rectY + 15, 4, 20);

    
    ctx.shadowBlur = 0;
    ctx.fillStyle = "white";
    ctx.fillText(message.toUpperCase(), canvas.width / 2, canvas.height / 2);

    ctx.restore();

    return duree - 1;
}
export { drawScore, drawMessage}