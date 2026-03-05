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

    ctx.font = "bold 18px Bungee";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    let textMetrics = ctx.measureText(message);
    let paddingX = 40;
    let paddingY = 20;
    let rectW = textMetrics.width + paddingX;
    let rectH = 40 + paddingY;
    let rectX = (canvas.width - rectW) / 2;
    let rectY = (canvas.height / 2) - (rectH / 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(rectX + 5, rectY + 5, rectW, rectH);
    ctx.fillStyle = "#333";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.fillRect(rectX, rectY, rectW, rectH);
    ctx.strokeRect(rectX, rectY, rectW, rectH);
    ctx.fillStyle = "white";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    return duree - 1;
}
export { drawScore, drawMessage}