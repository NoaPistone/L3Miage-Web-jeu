function drawScore(ctx,canvas,score,niveau,vies) {
    let centerX = canvas.width / 2;
    ctx.save();
    let width = 220;
    let height = 90;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(centerX - width/2, 5, width, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(centerX - width/2, 5, width, height);

    ctx.fillStyle = "#ffffff"; 
    ctx.font = "bold 24px 'Verdana', sans-serif";
    ctx.textAlign = "center"; 
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 5;
    ctx.fillText("Score : " + score, centerX, 30);
    ctx.fillText("Niveau : " + niveau, centerX, 60);
    ctx.fillText("Vies : " + vies, centerX, 90);
    ctx.restore();
}

export { drawScore}