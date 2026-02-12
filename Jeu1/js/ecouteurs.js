
function initListeners(inputStates,canvas,jeux) {

    window.onkeydown = (event) => {
        console.log("Touche pressée : " + event.key);
        if (event.key === "ArrowRight") {
            inputStates.ArrowRight = true;
        }
        if (event.key === "ArrowLeft") {
            inputStates.ArrowLeft = true;
        }
        if (event.key === "ArrowUp") {
            inputStates.ArrowUp = true;
        }
        if (event.key === "ArrowDown") {
            inputStates.ArrowDown = true;
        }
    }

    window.onkeyup = (event) => {
        console.log("Touche relachée : " + event.key);
        if (event.key === "ArrowRight") {
            inputStates.ArrowRight = false;
        }
        if (event.key === "ArrowLeft") {
            inputStates.ArrowLeft = false;
        }
        if (event.key === "ArrowUp") {
            inputStates.ArrowUp = false;
        }
        if (event.key === "ArrowDown") {
            inputStates.ArrowDown = false;
        }
    }

    canvas.onclick = (e) => {
        let rect = canvas.getBoundingClientRect();
        let mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        let my = (e.clientY - rect.top) * (canvas.height / rect.height);

        
        switch (jeux.etat) {
            case "MENU D'ACCUEIL":
                jeux.menu.handleClick(mx, my);
                break;
            case "GAME OVER":
                jeux.fin.handleClick(mx, my);
                break;
            case "JEU TERMINE":
                jeux.JeuTermine.handleClick(mx, my); 
                break;
            case "TRANSITION" :
                jeux.transition.handleClick(mx,my);
                break;

        }
    };
}

export { initListeners };


