function initListeners(inputStates) {

    window.addEventListener("keydown", (event) => {
        console.log("Touche pressée :", event.key);
        /*
        if (event.key === "ArrowRight") inputStates.ArrowRight = true;
        if (event.key === "ArrowLeft")  inputStates.ArrowLeft  = true;
        if (event.key === "ArrowUp")    inputStates.ArrowUp    = true;
        if (event.key === "ArrowDown")  inputStates.ArrowDown  = true;
        */
        if(event.key === "ArrowRight") {
            inputStates.ArrowRight = true;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = true;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = true;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = true;
        }
    });

    window.addEventListener("keyup", (event) => {
        console.log("Touche relâchée :", event.key);
        /*
        if (event.key === "ArrowRight") inputStates.ArrowRight = false;
        if (event.key === "ArrowLeft")  inputStates.ArrowLeft  = false;
        if (event.key === "ArrowUp")    inputStates.ArrowUp    = false;
        if (event.key === "ArrowDown")  inputStates.ArrowDown  = false;
        */
       if(event.key === "ArrowRight") {
            inputStates.ArrowRight = false;
        }
        if(event.key === "ArrowLeft") {
            inputStates.ArrowLeft = false;
        }
        if(event.key === "ArrowUp") {
            inputStates.ArrowUp = false;
        }
        if(event.key === "ArrowDown") {
            inputStates.ArrowDown = false;
        }
    });
}

export { initListeners };


